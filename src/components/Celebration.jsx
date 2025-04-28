import { useEffect } from "react";
import { Howl } from "howler";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import messages from "../data/messages.json"; // 🆕 Importa as mensagens

const images = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
];

export default function Celebration() {
  useEffect(() => {
    const sound = new Howl({
      src: ['/music/celebration.mp3'],
      autoplay: true,
      loop: true,
      volume: 0.5,
    });
    sound.play();
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-y-auto">
      
      {/* Partículas */}
      <Particles
        options={{
          background: { color: { value: "#000" } },
          particles: {
            color: { value: "#ffffff" },
            number: { value: 50 },
            size: { value: 3 },
            move: { enable: true, speed: 1.5 }
          }
        }}
        className="absolute w-full h-full"
      />

      <motion.h1 
        className="text-white text-6xl font-bold mt-10 z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        🎉 Parabéns Marcos Mendes 🎉
      </motion.h1>


      <div className="flex flex-wrap justify-center gap-4 z-10 mt-12">
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Foto ${index}`}
            className="w-48 h-48 object-cover rounded-xl shadow-2xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.3 }}
          />
        ))}
      </div>


      <div className="flex flex-col items-center gap-4 mt-20 mb-12 z-10">
        <h2 className="text-4xl font-bold text-white mb-6">Mensagens especiais 🎁</h2>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {messages.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-lg p-4 w-64"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {item.photoUrl && (
                <img 
                  src={item.photoUrl} 
                  alt={item.name} 
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <p className="font-bold text-lg text-black">{item.name}</p>
              <p className="text-black">{item.message}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
