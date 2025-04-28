import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Confetti from "react-confetti";
import { FaPlayCircle } from "react-icons/fa";

export default function Countdown({ onFinish }) {
  const [targetDate, setTargetDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchTimeAndTarget = async () => {
      try {
        // Pega a data do Firestore
        const docSnap = await getDoc(doc(db, "settings", "countdown"));
        if (!docSnap.exists()) return;

        const fetchedTargetDate = docSnap.data().targetDate.toDate().getTime();
        setTargetDate(fetchedTargetDate);

        // Agora busca a hora real de Brasília
        const res = await fetch("http://worldtimeapi.org/api/timezone/America/Sao_Paulo");
        const data = await res.json();
        const now = new Date(data.datetime).getTime();

        setCurrentTime(now);
        setTimeLeft(fetchedTargetDate - now);
      } catch (error) {
        console.error("Erro ao buscar hora de Brasília:", error);
      }
    };

    fetchTimeAndTarget();
  }, []);

  useEffect(() => {
    if (!currentTime || !targetDate) return;

    const interval = setInterval(() => {
      const newNow = currentTime + (Date.now() - currentTime); 
      const diff = targetDate - newNow;

      if (diff <= 0) {
        clearInterval(interval);
        setShowConfetti(true);
        onFinish && onFinish();
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime, targetDate, onFinish]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handlePlayMusic = () => {
    const iframe = playerRef.current;
    iframe && iframe.contentWindow.postMessage(
      '{"event":"command","func":"unMute","args":""}', "*"
    );
  };

  if (!timeLeft) {
    return <div className="text-white">Carregando...</div>;
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          ref={playerRef}
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/hQ6k0_Iura0?autoplay=1&mute=1&enablejsapi=1&controls=0&loop=1&playlist=hQ6k0_Iura0"
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full object-cover"
        ></iframe>
      </div>

      <h1 className="text-white text-7xl font-bold animate-pulse z-10">
        {formatTime(timeLeft)}
      </h1>

      <button onClick={handlePlayMusic} className="z-10 mt-8">
        <FaPlayCircle size={60} color="white" className="hover:scale-110 transition-transform duration-300" />
      </button>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle
          numberOfPieces={400}
          gravity={0.3}
        />
      )}
    </div>
  );
}
