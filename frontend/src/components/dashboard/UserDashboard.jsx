import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

export function UserDashboard() {
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', description: '' });
    const [newStep, setNewStep] = useState({ title: '' });
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token'); // Получаем токен из localStorage
            try {
                const response = await fetch(`/api/goals/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Используем токен в заголовке авторизации
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Goals fetched:', data);
                    setGoals(data);
                } else {
                    console.error('Failed to fetch goals:', response.status);
                }
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
            setIsLoading(false);
        };
        fetchGoals();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    const handleAddGoal = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/goals/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGoal),
        });

        if (response.ok) {
            const goal = await response.json();
            setGoals([...goals, goal]);
            setNewGoal({ title: '', description: '' });
        }
    };

    const handleAddStep = async (goalId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/goals/${goalId}/steps`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStep),
        });

        if (response.ok) {
            const step = await response.json();
            setGoals(goals.map(goal => goal.id === goalId ? { ...goal, steps: [...goal.steps, step] } : goal));
            setNewStep({ title: '' });
        }
    };

    const handleDeleteGoal = async (goalId) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/goals/${userId}/${goalId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setGoals(goals.filter(goal => goal.id !== goalId));
        }
    };

    const handleDeleteStep = async (goalId, stepId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/goals/${goalId}/steps/${stepId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? { ...goal, steps: goal.steps.filter(step => step.id !== stepId) }
                    : goal
            ));
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Добро пожаловать, {localStorage.getItem('userName')}!</h1>
                <button onClick={handleLogout} className="button">Выйти</button>
            </header>

            <div className="dashboard-content">
                <h2>Ваши цели</h2>
                {isLoading ? (
                    <p>Загрузка...</p>
                ) : goals.length > 0 ? (
                    <div className="goal-list">
                        {goals.map(goal => (
                            <div key={goal.id} className="goal-item">
                                <h3 onClick={() => setSelectedGoalId(goal.id === selectedGoalId ? null : goal.id)}>
                                    {goal.title}
                                </h3>
                                {selectedGoalId === goal.id && (
                                    <div className="goal-details">
                                        <p>{goal.description}</p>
                                        <ul className="step-list">
                                            {goal.steps.map(step => (
                                                <li key={step.id}>
                                                    {step.title}
                                                    <button onClick={() => handleDeleteStep(goal.id, step.id)}>Удалить шаг</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="add-step-form">
                                            <input
                                                type="text"
                                                placeholder="Название шага"
                                                value={newStep.title}
                                                onChange={(e) => setNewStep({ title: e.target.value })}
                                            />
                                            <button onClick={() => handleAddStep(goal.id)}>Добавить шаг</button>
                                        </div>
                                        <button onClick={() => handleDeleteGoal(goal.id)}>Удалить цель</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас ещё нет целей. Начните с добавления новой цели.</p>
                )}
                <div className="add-goal-form">
                    <input
                        type="text"
                        placeholder="Название цели"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Описание цели"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
                    <button onClick={handleAddGoal}>Добавить цель</button>
                </div>
            </div>
        </div>
    );
}
