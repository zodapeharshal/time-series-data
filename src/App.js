import "./App.css";

import CompanyDetails from "./Components/CompanyDetails";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CompanyDetails/:cmpid" element={<CompanyDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
