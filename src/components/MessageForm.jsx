import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // importa o db correto

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Adiciona a mensagem no Firestore
      await addDoc(collection(db, "messages"), {
        name: name,
        message: message,
        createdAt: new Date() // Opcional: ajuda a ordenar depois
      });

      setSent(true);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {!sent ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 bg-gray-800 rounded text-black"
            required
          />

          <textarea
            name="message"
            placeholder="Sua mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 bg-gray-800 rounded text-black h-32"
            required
          />

          <button type="submit" className="bg-green-500 hover:bg-green-600 rounded p-2 font-bold text-white">
            Enviar Mensagem
          </button>
        </form>
      ) : (
        <h1 className="text-2xl font-bold text-center">Obrigado pela sua mensagem! 🎉</h1>
      )}
    </div>
  );
}
