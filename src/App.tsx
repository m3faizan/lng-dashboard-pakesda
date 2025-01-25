import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ImportStatistics from "./pages/ImportStatistics";
import PricingMetrics from "./pages/PricingMetrics";
import LNGTerminals from "./pages/LNGTerminals";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/import-statistics" element={<ImportStatistics />} />
        <Route path="/pricing-metrics" element={<PricingMetrics />} />
        <Route path="/lng-terminals" element={<LNGTerminals />} />
      </Routes>
    </Router>
  );
}

export default App;