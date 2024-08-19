import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        if (isLoggedIn) {
            if (userRole === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            navigate('/auth');
        }
    };

    return (
        <header className="container">
            <h1>Цели</h1>
            <div className="text">
                <p>Достигни поставленных целей</p>
                <p>Ставь себе задачи по силам</p>
            </div>
            <button className="button" onClick={handleGetStarted}>
                Начать
            </button>
        </header>
    );
}

export { WelcomePage };
