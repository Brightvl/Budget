import './App.scss';
import { Welcome } from "./components/auth/Welcome.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./components/auth/Auth.jsx";
import { UserDashboard } from "./components/dashboard/UserDashboard.jsx";
import { Register } from "./components/auth/Register.jsx";
import AdminDashboard from "./components/dashboard/AdminDashboard.jsx";

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
