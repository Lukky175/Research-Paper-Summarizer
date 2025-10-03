import logo from './logo.svg';
import './App.css';
import LandingPage from "./Landing page/LandingPage";
import Navbar from "./NavigationBar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />   {/* Navbar stays common on all pages */}
        <div className="page-content"> {/* ensures centering / navbar padding from App.css */}
          <Routes>
            <Route path="/" element={<LandingPage />} />        {/* Default = Login */}
            {/* <Route path="/register" element={<Register />} />  */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
