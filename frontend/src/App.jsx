import './App.scss';
import { Welcome } from "./page/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./page/auth/Auth";
import { UserDashboard } from "./page/dashboard/UserDashboard";
import { Register } from "./page/auth/Register";
import AdminDashboard from "./page/dashboard/AdminDashboard";

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
