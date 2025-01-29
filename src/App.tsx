import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import ImportStatistics from "./pages/ImportStatistics";
import PriceMetrics from "./pages/PriceMetrics";
import LNGTerminals from "./pages/LNGTerminals";
import GenerationMetrics from "./pages/GenerationMetrics";
import Auth from "./pages/Auth";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/import-statistics" element={<ImportStatistics />} />
        <Route path="/price-metrics" element={<PriceMetrics />} />
        <Route path="/lng-terminals" element={<LNGTerminals />} />
        <Route path="/generation-metrics" element={<GenerationMetrics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;