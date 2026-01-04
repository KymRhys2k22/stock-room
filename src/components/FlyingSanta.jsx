import React from "react";
import "@divriots/flying-santa";

/**
 * FlyingSanta Component
 *
 * Seasonal decoration component using a custom web component.
 * Renders an animated Santa flying across the screen.
 * Wrapped in React component for easier integration.
 */
function FlyingSanta() {
  return (
    <>
      <flying-santa
        style={{
          position: "fixed",
        }}
        speed="1"
        change-speed="3000"
        presents-distance="100"
        presents-interval="100"
        presents-drop-speed="1"
        presents-number="1"
        presents-size="1"
        presents-color="pink"></flying-santa>
    </>
  );
}

export default FlyingSanta;
