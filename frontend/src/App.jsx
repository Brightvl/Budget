import './App.css';
import { Welcome } from "./components/Welcome.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./components/Auth.jsx";
import { UserDashboard } from "./components/UserDashboard.jsx";
import { Register } from "./components/Register.jsx";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
