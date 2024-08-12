import './App.css';
import { Welcome } from "./components/Welcome.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth } from "./components/Auth.jsx";
import {UserDashboard} from "./components/UserDashboard.jsx";
import UserList from "./components/UserList.jsx";

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/user-list" element={<UserList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
