import { useEffect, useState, useRef } from "react";
import Confetti from "react-canvas-confetti";
import { FaPlayCircle } from "react-icons/fa"; // Ícone bonito de Play

const targetDate = new Date('2025-04-29T00:00:00').getTime();

export default function Countdown({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        onFinish();
        setShowConfetti(true);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinish]);

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
    if (iframe) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*"
      );
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">

      {/* YouTube Video 🎵 */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
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

      {/* Countdown */}
      <h1 className="text-white text-7xl font-bold animate-pulse z-10">
        {formatTime(timeLeft)}
      </h1>

      {/* Botão Play Música */}
      <button
        onClick={handlePlayMusic}
        className="z-10 mt-8"
      >
        <FaPlayCircle size={60} color="white" className="hover:scale-110 transition-transform duration-300" />
      </button>

      {/* Confetti quando terminar */}
      {showConfetti && <Confetti />}
    </div>
  );
}
