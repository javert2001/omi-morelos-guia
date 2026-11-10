import { createRoot } from "react-dom/client";
import LearningApp from "../components/learning-app";
import "../app/globals.css";
import "../app/omri-brand.css";

createRoot(document.getElementById("root")!).render(<LearningApp />);
