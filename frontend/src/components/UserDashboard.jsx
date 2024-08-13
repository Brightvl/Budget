import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/authUtils";
import BudgetList from "./BudgetList";
import CategoryList from "./CategoryList";
import TransactionList from "./TransactionList";
import {useEffect, useState} from "react";

export function UserDashboard() {
    const [userName, setUserName] = useState('');
    const [balance, setBalance] = useState(0);
    const [activeTab, setActiveTab] = useState('budgets'); // активная вкладка
    const userId = 1; // Здесь можно использовать реальный userId после аутентификации

    const navigate = useNavigate();

    useEffect(() => {
        // Получение данных пользователя
        const fetchUserData = async () => {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserName(data.login);
                setBalance(data.balance);
            } else {
                console.error('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <div className="dashboard-container">
            <h2>User Dashboard</h2>
            <div className="user-info">
                <h3>Welcome, {userName}!</h3>
                <p>Current Balance: ${balance.toFixed(2)}</p>
            </div>
            <div className="tabs">
                <button onClick={() => setActiveTab('budgets')}>Budgets</button>
                <button onClick={() => setActiveTab('categories')}>Categories</button>
                <button onClick={() => setActiveTab('transactions')}>Transactions</button>
            </div>
            <div className="tab-content">
                {activeTab === 'budgets' && <BudgetList userId={userId} />}
                {activeTab === 'categories' && <CategoryList userId={userId} />}
                {activeTab === 'transactions' && <TransactionList userId={userId} />}
            </div>
            <button onClick={() => handleLogout(navigate)}>Logout</button>
        </div>
    );
}
