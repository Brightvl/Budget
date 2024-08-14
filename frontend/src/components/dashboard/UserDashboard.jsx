import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../utils/authUtils.js";
import BudgetList from "../BudgetList.jsx";
import CategoryList from "../CategoryList.jsx";
import TransactionList from "../TransactionList.jsx";
import { useEffect, useState } from "react";

export function UserDashboard() {
    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [balance, setBalance] = useState(0);
    const [activeTab, setActiveTab] = useState('budgets'); // активная вкладка
    const userId = localStorage.getItem('userId'); // Здесь можно использовать реальный userId после аутентификации

    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем, доступен ли userId и если нет, перенаправляем на страницу аутентификации
        if (!userId) {
            navigate('/auth');
            return;
        }

        // Получение данных пользователя
        const fetchUserData = async () => {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserName(data.login);
                // Убедитесь, что поле balance действительно присутствует в ответе от API
                setBalance(data.balance || 0); // Если balance может быть не определен
            } else {
                console.error('Failed to fetch user data');
                // Возможно, стоит добавить обработку ошибок или редирект на страницу ошибки
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    return (
        <div className="container">
            <h2>Бюджет пользователя {userName}</h2>
            <div className="user-info">

                <p>Текущий баланс: {balance.toFixed(2)} ₽</p>
            </div>
            <div className="button-group">
                <button className="button" onClick={() => setActiveTab('budgets')}>Budgets</button>
                <button className="button" onClick={() => setActiveTab('categories')}>Categories</button>
                <button className="button" onClick={() => setActiveTab('transactions')}>Transactions</button>
            </div>
            <div className="tab-content">
                {activeTab === 'budgets' && <BudgetList userId={userId} />}
                {activeTab === 'categories' && <CategoryList userId={userId} />}
                {activeTab === 'transactions' && <TransactionList userId={userId} />}
            </div>
            <button className="button" onClick={() => handleLogout(navigate)}>Logout</button>
        </div>
    );
}
