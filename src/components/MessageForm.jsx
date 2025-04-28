import { useState } from "react";

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {!sent ? (
        <form 
          name="marcos-messages" 
          method="POST" 
          data-netlify="true" 
          data-netlify-uploads="true" 
          encType="multipart/form-data"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {/* Campo oculto obrigatório para o Netlify identificar o form */}
          <input type="hidden" name="form-name" value="marcos-messages" />

          {/* Nome */}
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 bg-gray-800 rounded text-black"
            required
          />

          {/* Mensagem */}
          <textarea
            name="message"
            placeholder="Sua mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 bg-gray-800 rounded text-black h-32"
            required
          />

          {/* Upload da Imagem */}
          <input 
            type="file" 
            name="photo" 
            accept="image/*" 
            className="p-2 bg-gray-800 rounded text-white"
          />

          {/* Botão */}
          <button type="submit" className="bg-green-500 hover:bg-green-600 rounded p-2 font-bold text-white">
            Enviar Mensagem
          </button>
        </form> 
      ) : (
        <h1 className="text-2xl font-bold text-center">Obrigado apela sua mensagem! 🎉</h1>
      )}
    </div>
  );
}
