from copy import deepcopy

from models.nota import Nota
from services.aluno_service import buscar_aluno
from utils.db import DB_LOCK
from utils.validators import exigir_permissao


def adicionar_nota(db, usuario, aluno, disciplina, valor):
    permitido, mensagem = exigir_permissao(usuario, "nota_criar")
    if not permitido:
        return False, mensagem

    if not isinstance(db, dict):
        return False, "Banco de dados invalido"

    with DB_LOCK:
        notas = db.get("notas")
        if notas is None:
            db["notas"] = []
            notas = db["notas"]
        if not isinstance(notas, list):
            return False, "Lista de notas invalida"

        _, aluno_db = buscar_aluno(db, aluno)
        if aluno_db is None:
            return False, "Aluno nao cadastrado"

        try:
            nota = Nota(
                aluno_db["nome"],
                disciplina,
                valor,
                aluno_id=aluno_db.get("id"),
            ).para_dict()
        except (TypeError, ValueError) as erro:
            return False, str(erro)

        notas.append(nota)
        return True, "Nota adicionada"


def listar_notas(db, usuario, aluno=None):
    permitido, mensagem = exigir_permissao(usuario, "nota_visualizar")
    if not permitido:
        return False, mensagem, []

    with DB_LOCK:
        notas = db.get("notas", []) if isinstance(db, dict) else []
        if not isinstance(notas, list) or not all(isinstance(nota, dict) for nota in notas):
            return False, "Lista de notas invalida", []
        if aluno:
            notas = [
                nota for nota in notas
                if nota.get("aluno") == aluno or nota.get("aluno_id") == aluno
            ]

        return True, "Notas listadas", deepcopy(notas)
