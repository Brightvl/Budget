import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();  // Очищаем localStorage при выходе
        navigate('/auth');     // Перенаправляем на страницу авторизации
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Административная панель</h1>
                <button onClick={handleLogout} className="button">Выйти</button>
            </header>
            <div className="dashboard-content">
                <p>Здесь можно управлять пользователями и просматривать статистику.</p>
                {

                }
            </div>
        </div>
    );
}

export default AdminDashboardPage;
