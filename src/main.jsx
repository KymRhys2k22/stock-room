import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Fixture from "./Fixture.jsx";
import UploadImage from "./UploadImage.jsx";
import NotFound from "./components/NotFound.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

/* if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
} */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey="pk_live_Y2xlcmsuZGFpc29wYXYuc3RvcmUk"
      afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/fixtures/:label" element={<Fixture />} />
            <Route path="/upload-image" element={<UploadImage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
