import { useRef, useState } from "react";

export default function BackgroundMusic({ videoId }) {
  const playerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleUnmuteMusic = () => {
    if (playerRef.current) {
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "unMute",
          args: [],
        }),
        "*"
      );
      setIsMuted(false);
    }
  };

  return (
    <>
      <iframe
        ref={playerRef}
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&enablejsapi=1`}
        title="Música de Fundo"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      ></iframe>

      {isMuted && (
        <button
          onClick={handleUnmuteMusic}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all animate-bounce"
        >
          🔊 Ativar Música
        </button>
      )}
    </>
  );
}
