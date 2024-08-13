import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    return (
        <header className="container">
            <h1>Твой  бюджет</h1>
            <div className="text">
                <p>Возьмите под контроль свои финансы.</p>
                <p>С легкостью отслеживайте свои доходы, расходы и сбережения.</p>
            </div>
            <button className="button" onClick={handleGetStarted}>
                Начать
            </button>
        </header>
    );
}

export { Welcome };
