import { BrowserRouter, Routes, Route } from "react-router-dom";
import Services from "./pages/Services";
import IndiaVsAbroad from "./pages/IndiaVsAbroad";
import CompareResult from "./pages/CompareResult";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Services />} />
        <Route path="/india-vs-abroad" element={<IndiaVsAbroad />} />
        <Route path="/compare-result" element={<CompareResult />} />
      </Routes>
    </BrowserRouter>
  );
}
