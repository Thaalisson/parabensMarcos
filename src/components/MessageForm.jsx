import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // apenas o Firestore agora

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [sent, setSent] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadFileToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // seu Cloudinary Cloud Name
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY; // sua API Key

    const timestamp = Math.floor(Date.now() / 1000);

    // Busca assinatura segura
    const signRes = await fetch('/.netlify/functions/sign-cloudinary', {
      method: 'POST',
      body: JSON.stringify({ timestamp }),
    });

    if (!signRes.ok) {
      throw new Error('Falha ao gerar assinatura.');
    }

    const { signature } = await signRes.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('resource_type', 'auto'); // ⚡ importante para aceitar imagem ou áudio

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Erro Cloudinary: ${data.error?.message || res.statusText}`);
    }

    return data.secure_url;
  };

  const handleSubmit = async () => {
    setLoading(true);
    let fileUrl = "";

    try {
      if (file) {
        fileUrl = await uploadFileToCloudinary(file);
      }

      await addDoc(collection(db, "messages"), {
        name,
        message,
        ...(fileUrl && { photoUrl: fileUrl }),
        createdAt: new Date()
      });

      setSent(true);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar a mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-green-500">🎉 Mensagem Enviada!</h1>
        <p className="text-white">Obrigado pela sua mensagem.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-xl text-white">
      {!confirming ? (
        <>
          <h2 className="text-2xl font-semibold text-center">Deixe sua mensagem 🎈</h2>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500"
            required
          />

          <textarea
            placeholder="Escreva sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 h-32 resize-none"
            required
          />

          <input
            type="file"
            accept="image/*,audio/*"
            onChange={handleFileChange}
            className="p-2 rounded bg-gray-800 border border-gray-700 cursor-pointer"
          />

          {filePreview && (
            <>
              {file?.type.startsWith('image') ? (
                <img src={filePreview} alt="Preview" className="rounded-lg max-h-64 object-cover mt-4" />
              ) : file?.type.startsWith('audio') ? (
                <audio controls className="mt-4 w-full">
                  <source src={filePreview} type={file?.type} />
                  Seu navegador não suporta áudio.
                </audio>
              ) : null}
            </>
          )}

          <button
            onClick={() => setConfirming(true)}
            className="bg-blue-600 hover:bg-blue-700 rounded py-2 font-bold transition mt-4"
          >
            Revisar e Enviar
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center">Confirme sua mensagem ✨</h2>

          <div className="p-4 bg-gray-800 rounded-lg">
            <p><span className="font-semibold">Nome:</span> {name}</p>
            <p className="mt-2"><span className="font-semibold">Mensagem:</span> {message}</p>
            {filePreview && (
              <>
                {file?.type.startsWith('image') ? (
                  <img src={filePreview} alt="Preview" className="rounded-lg mt-2 max-h-64 object-cover" />
                ) : file?.type.startsWith('audio') ? (
                  <audio controls className="mt-4 w-full">
                    <source src={filePreview} type={file?.type} />
                    Seu navegador não suporta áudio.
                  </audio>
                ) : null}
              </>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setConfirming(false)}
              className="bg-yellow-600 hover:bg-yellow-700 rounded py-2 px-4 font-bold transition"
              disabled={loading}
            >
              Editar
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 rounded py-2 px-4 font-bold transition"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Confirmar Envio"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
