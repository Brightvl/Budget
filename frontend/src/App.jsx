import './App.scss';
import { WelcomePage } from "./page/WelcomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthPage } from "./page/AuthPage.jsx";
import { UserDashboardPage } from "./page/UserDashboardPage.jsx";
import { RegisterPage } from "./page/RegisterPage.jsx";
import AdminDashboardPage from "./page/AdminDashboardPage.jsx";
import {UserProvider} from "./context/UserContext.jsx";



function App() {
    return (
        <UserProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
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
