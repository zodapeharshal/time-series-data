import "./App.css";
import Table from "./Components/Table";
import CompanyDetails from "./Components/CompanyDetails";
import { Route, Routes, Link } from "react-router-dom";
import Home from "./Components/Home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CompanyDetails" element={<CompanyDetails />} />
      </Routes>
    </div>
  );
}

export default App;
