import { useState } from "react";
import Countdown from "../components/Countdown";
import Celebration from "../components/Celebration";

export default function Home() {
  const [isCelebration, setIsCelebration] = useState(false);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {!isCelebration ? (
        <Countdown onFinish={() => setIsCelebration(true)} />
      ) : (
        <Celebration />
      )}
    </div>
  );
}
