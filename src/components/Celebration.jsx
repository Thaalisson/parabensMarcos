import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Confetti from "react-confetti";
import BackgroundMusic from "../components/BackgroundMusic";

export default function Celebration() {
  const [messages, setMessages] = useState([]);
  const [showConfetti, setShowConfetti] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [expandedMessages, setExpandedMessages] = useState({});

  const defaultImages = ["/gokuss3.jpg", "/onepice.jpeg", "/naruto.png"];

  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    setTimeout(() => {
      setShowConfetti(false);
    }, 15000);
  }, []);

  const handlePrev = (e) => {
    e.stopPropagation();
    setDirection(-1);
    setSelectedIndex((prev) => (prev === 0 ? messages.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    setSelectedIndex((prev) => (prev === messages.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const url = messages[selectedIndex]?.photoUrl || getRandomDefaultImage();
    const link = document.createElement("a");
    link.href = url;
    link.download = `foto_${selectedIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedMessages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-2xl animate-pulse">
        Carregando mensagens...
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start text-center overflow-y-auto bg-black pb-10">
      <BackgroundMusic videoId="xVGoGYb55NI" />

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={400}
          gravity={0.3}
        />
      )}

      <h1 className="text-white text-5xl md:text-6xl font-bold mt-10 animate-pulse">
        🎉 Parabéns Marcos Mendes 🎉
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 mt-12">
        {messages.map((item, index) => {
          const isExpanded = expandedMessages[item.id];
          const textLimit = 150;
          const displayText = !isExpanded && item.message.length > textLimit
            ? item.message.substring(0, textLimit) + "..."
            : item.message;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedIndex(index)}
              className={`bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col items-center p-6 cursor-pointer ${index === 0 ? "border-4 border-yellow-400 animate-pulse" : ""}`}
            >
              <img
                src={item.photoUrl || getRandomDefaultImage()}
                alt={`Foto de ${item.name}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 mb-4 shadow-md"
              />
              <p className="font-bold text-lg text-black mb-2">{item.name}</p>

              <div className="text-black text-center break-words relative">
                <p className="transition-all whitespace-pre-line">{displayText}</p>
                {item.message.length > textLimit && (
                  <button
                    onClick={(e) => toggleExpand(e, item.id)}
                    className="mt-2 text-blue-600 text-sm flex items-center justify-center gap-1"
                  >
                    {isExpanded ? (<>Ver menos <FaChevronUp size={12} /></>) : (<>Ver mais <FaChevronDown size={12} /></>)}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              key={messages[selectedIndex]?.id}
              className="bg-white rounded-lg p-6 max-w-md w-full relative flex flex-col items-center"
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) handlePrev(e);
                else if (info.offset.x < -100) handleNext(e);
              }}
            >
              <button
                className="absolute top-2 right-2 text-black text-xl font-bold"
                onClick={() => setSelectedIndex(null)}
              >
                ✖
              </button>

              <div className="flex justify-between w-full absolute top-1/2 transform -translate-y-1/2 px-4">
                <button
                  onClick={handlePrev}
                  className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-50"
                >
                  <FaChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-50"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>

              <div className="text-black mb-2 mt-4 text-sm">
                {selectedIndex + 1} / {messages.length}
              </div>

              <img
                src={messages[selectedIndex]?.photoUrl || getRandomDefaultImage()}
                alt={`Foto de ${messages[selectedIndex]?.name}`}
                className="w-full h-auto rounded-lg mb-4 object-cover"
              />

              <h2 className="text-3xl font-extrabold text-black mb-2">
                {messages[selectedIndex]?.name}
              </h2>

              <p className="text-lg text-gray-800 font-medium text-center mt-2 overflow-y-auto max-h-80 px-2">
                {messages[selectedIndex]?.message}
              </p>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm mt-4 transition-colors"
              >
                <FaDownload size={16} /> Download
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
