import './App.scss';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { AuthPage } from "./page/AuthPage/AuthPage.jsx";
import { UserDashboardPage } from "./page/UserDashboardPage/UserDashboardPage.jsx";
import { RegisterPage } from "./page/RegistrationPage/RegisterPage.jsx";
import AdminDashboardPage from "./page/AdminDashboardPage/AdminDashboardPage.jsx";
import {UserProvider} from "./context/UserContext.jsx";



function App() {
    return (
        <UserProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<Navigate to="/auth" />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/dashboard" element={<UserDashboardPage />} />
                        <Route path="/admin" element={<AdminDashboardPage />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
