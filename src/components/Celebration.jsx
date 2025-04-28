import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Celebration() {
  const [messages, setMessages] = useState([]);

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
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-y-auto">
      <h1 className="text-white text-6xl font-bold mt-10 z-10">
        🎉 Parabéns Marcos Mendes 🎉
      </h1>

      <div className="flex flex-wrap justify-center gap-6 px-4 mt-12">
        {messages.length > 0 ? (
          messages.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-lg p-4 w-64"
            >
              <p className="font-bold text-lg text-black">{item.name}</p>
              <p className="text-black">{item.message}</p>
            </div>
          ))
        ) : (
          <p className="text-white mt-10">Carregando mensagens...</p>
        )}
      </div>
    </div>
  );
}
