import { useEffect } from "react";
import "@divriots/flying-santa";
import { cleanup } from "@divriots/flying-santa";

export default function FlyingSanta({
  changeSpeed = 3000,
  speed = 1,
  presentsDistance = 120,
  presentsInterval = 80,
  presentsDropSpeed = 1,
}) {
  useEffect(() => {
    // cleanup in case something already exists
    cleanup();

    return () => {
      // remove santa when component unmounts
      cleanup();
    };
  }, []);

  return (
    <flying-santa
      change-speed={changeSpeed}
      speed={speed}
      presents-distance={presentsDistance}
      presents-interval={presentsInterval}
      presents-drop-speed={presentsDropSpeed}></flying-santa>
  );
}
