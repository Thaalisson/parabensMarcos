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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Acesso Restrito 🚪</h2>
        <p className="text-gray-400 text-sm">Digite o código secreto para continuar</p>
      </div>

      <input
        type="password"
        placeholder="Digite o código secreto"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-bold text-white transition duration-300"
      >
        Entrar
      </button>

      {error && (
        <p className="text-red-400 text-center animate-pulse">
          Código incorreto. Tente novamente.
        </p>
      )}
    </form>
  );
}
