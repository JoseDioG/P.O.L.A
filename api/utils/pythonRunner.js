const { spawn } = require("child_process");
const path = require("path");

const apiDir = path.join(__dirname, "..");
const projectRoot = path.join(apiDir, "..");
const backendDir = path.join(projectRoot, "backend");

function resolvePythonFile(file) {
  const scriptPath = path.isAbsolute(file)
    ? path.normalize(file)
    : path.join(backendDir, file);

  const relativePath = path.relative(backendDir, scriptPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Arquivo Python fora do backend: ${file}`);
  }

  if (path.extname(scriptPath) !== ".py") {
    throw new Error(`Arquivo Python invalido: ${file}`);
  }

  return scriptPath;
}

function parsePythonOutput(output) {
  const text = output.trim();
  if (!text) return null;

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    try {
      return JSON.parse(lines[index]);
    } catch (_) {
      // Permite logs antes da linha JSON final.
    }
  }

  return text;
}

function runPython(file, args = []) {
  return new Promise((resolve, reject) => {
    let scriptPath;

    try {
      scriptPath = resolvePythonFile(file);
    } catch (error) {
      reject(error);
      return;
    }

    const pythonPath = process.env.PYTHON_PATH || "python";
    const child = spawn(pythonPath, [scriptPath, ...args], {
      cwd: backendDir,
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        PYTHONPATH: [backendDir, process.env.PYTHONPATH].filter(Boolean).join(path.delimiter),
      },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        const message = stderr.trim() || stdout.trim() || `Python finalizou com codigo ${code}`;
        reject(new Error(message));
        return;
      }

      resolve(parsePythonOutput(stdout));
    });
  });
}

module.exports = runPython;
