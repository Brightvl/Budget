import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
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
