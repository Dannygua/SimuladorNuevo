import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimuladorAhorro } from "./components/SimuladorAhorro";
import { SimuladorCredito } from "./components/SimuladorCredito";
import { SimuladorInversion } from "./components/SimuladorInversion";

function App() {
  return (
    <Routes>
      <Route path="/simuladorAhorro" element={<SimuladorAhorro />} />
      <Route path="/simuladorCredito" element={<SimuladorCredito />} />
      <Route path="/simuladorInversion" element={<SimuladorInversion />} />
    </Routes>
  );
}

export default App;
