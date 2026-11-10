import { createRoot } from "react-dom/client";
import LearningApp from "../components/learning-app";
import "../app/globals.css";
import "../app/omri-brand.css";
import "../app/studio.css";
import "../app/studio-catalog.css";
import "../app/studio-learning.css";

createRoot(document.getElementById("root")!).render(<LearningApp />);
