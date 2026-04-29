class Ocorrência:
    def __init__(self, aluno, descrição, categoria, prioridade):
        self.aluno = aluno
        self.descrição = descrição
        self.categoria = categoria
        self.prioridade = prioridade
        self.estado = "REGISTRADA"
        self.histórico = []

        self._log("Ocorrência criada")

    def _log(self, ação):
        self.histórico.append({
            "ação": ação,
            "estado": self.estado
        })

    def atualização_de_estado(self, novo_estado, papel):
        permitido = {
            "PROFESSOR": [],
            "COORDENADOR": ["EM_ANALISE", "RESOLVIDA"],
            "DIRETOR": ["ENCERRADA"]
        }

        if novo_estado not in permitido.get(papel, []):
            raise Exception(f"{papel} não pode alterar para {novo_estado}")

        self.estado = novo_estado
        self._log(f"estado alterado para {novo_estado}")

    def abrir_histórico(self):
        return self.histórico


# TESTE RÁPIDO
if __name__ == "__main__":
    o = Ocorrência("João", "Aluno desrespeitou professor", "comportamento", "alta")
    o.atualização_de_estado("EM_ANALISE", "COORDENADOR")
    o.atualização_de_estado("RESOLVIDA", "COORDENADOR")
    o.atualização_de_estado("ENCERRADA", "DIRETOR")

    print(o.abrir_histórico())