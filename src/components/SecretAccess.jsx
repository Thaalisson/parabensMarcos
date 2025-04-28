import { useState } from "react";

export default function SecretAccess({ onSuccess }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (code.trim() === "BabyMendes") {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-4">Acesso Restrito 🚪</h1>
      <input
        type="password"
        placeholder="Digite o código secreto"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="p-2 bg-gray-800 rounded text-black"
        required
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 rounded p-2 font-bold text-white">
        Entrar
      </button>
      {error && <p className="text-red-500 text-center">Código incorreto. Tente novamente.</p>}
    </form>
  );
}
