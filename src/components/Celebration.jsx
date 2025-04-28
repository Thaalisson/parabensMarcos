import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Confetti from "react-confetti";

export default function Celebration() {
  const [messages, setMessages] = useState([]);
  const [showConfetti, setShowConfetti] = useState(true);

  const defaultImages = ["/gokuss3.jpg", "/onepice.jpeg"]; // Imagens padrão

  // Função para pegar uma imagem aleatória
  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messagesData);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };

    fetchMessages();

    setTimeout(() => {
      setShowConfetti(false);
    }, 15000);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start text-center overflow-y-auto bg-black pb-10">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={400}
          gravity={0.3}
        />
      )}

      <h1 className="text-white text-5xl md:text-6xl font-bold mt-10 z-10 animate-pulse">
        🎉 Parabéns Marcos Mendes 🎉
      </h1>

      <div className="flex flex-wrap justify-center gap-8 px-4 mt-12">
        {messages.length > 0 ? (
          messages.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-2xl overflow-hidden w-72 flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300"
            >
              {/* Se tiver foto usa a enviada, senão pega uma imagem padrão aleatória */}
              <img 
                src={item.photoUrl || getRandomDefaultImage()} 
                alt={`Foto de ${item.name}`}
                className="w-64 h-64 object-cover rounded-lg mb-4"
              />

              <p className="font-bold text-lg text-black mb-2">{item.name}</p>
              <p className="text-black text-center break-words">{item.message}</p>
            </div>
          ))
        ) : (
          <p className="text-white mt-10">Carregando mensagens...</p>
        )}
      </div>
    </div>
  );
}
