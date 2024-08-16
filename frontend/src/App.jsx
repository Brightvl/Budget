import './App.scss';
import { Welcome } from "./components/auth/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./components/auth/Auth";
import { UserDashboard } from "./components/dashboard/UserDashboard";
import { Register } from "./components/auth/Register";
import AdminDashboard from "./components/dashboard/AdminDashboard";

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
