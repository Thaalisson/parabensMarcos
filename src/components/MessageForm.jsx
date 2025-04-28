import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // apenas o Firestore agora

export default function MessageForm() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [sent, setSent] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const cloudName = "dl9j8b8vl"; // seu Cloudinary Cloud Name
    const apiKey = "227677196951464"; // ⚡ insira sua API Key aqui

    const timestamp = Math.floor(Date.now() / 1000);

    // Primeiro busca a assinatura no Netlify Function
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

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
    let photoUrl = "";

    try {
      if (photo) {
        photoUrl = await uploadImageToCloudinary(photo);
      }

      await addDoc(collection(db, "messages"), {
        name,
        message,
        ...(photoUrl && { photoUrl }),
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
            accept="image/*"
            onChange={handlePhotoChange}
            className="p-2 rounded bg-gray-800 border border-gray-700 cursor-pointer"
          />

          {photoPreview && (
            <img src={photoPreview} alt="Preview" className="rounded-lg max-h-64 object-cover" />
          )}

          <button
            onClick={() => setConfirming(true)}
            className="bg-blue-600 hover:bg-blue-700 rounded py-2 font-bold transition"
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
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="rounded-lg mt-2 max-h-64 object-cover" />
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
