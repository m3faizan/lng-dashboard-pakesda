import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import ImportStatistics from "./pages/ImportStatistics";
import PricingMetrics from "./pages/PricingMetrics";
import LNGTerminals from "./pages/LNGTerminals";
import GenerationMetrics from "./pages/GenerationMetrics";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/import-statistics" element={<ImportStatistics />} />
        <Route path="/pricing-metrics" element={<PricingMetrics />} />
        <Route path="/lng-terminals" element={<LNGTerminals />} />
        <Route path="/generation-metrics" element={<GenerationMetrics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;