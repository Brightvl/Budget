import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

export function UserDashboard() {
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({title: '', description: ''});
    const [editingGoal, setEditingGoal] = useState(null); // Состояние для редактируемой цели
    const [newStep, setNewStep] = useState({title: ''});
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [isAddingStep, setIsAddingStep] = useState(null);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);


    useEffect(() => {
        fetchData('/api/goals/', setGoals, setIsLoading);
    }, []);

    const fetchData = async (url, setData, setLoading) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${url}${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setData(data);
            } else {
                console.error('Failed to fetch data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const postData = async (url, body, callback) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = await response.json();
                callback(data);
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    const handleUpdateGoal = (goalId) => {
        const updatedGoal = {
            title: editingGoal.title || 'Цель не указана',
            description: editingGoal.description || 'Нет описания'
        };
        postData(`/api/goals/${localStorage.getItem('userId')}/${goalId}`, updatedGoal, (updatedGoal) => {
            setGoals(goals.map(goal =>
                goal.id === goalId ? updatedGoal : goal
            ));
            setEditingGoal(null); // Закрыть режим редактирования после обновления
        });
    };

    const deleteData = async (url, callback) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                callback();
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/auth');
    };

    const handleAddGoal = () => {
        const goal = {
            title: newGoal.title || 'Цель не указана',
            description: newGoal.description || 'Нет описания'
        };
        postData(`/api/goals/${localStorage.getItem('userId')}`, goal, (goal) => {
            setGoals([...goals, goal]);
            setNewGoal({title: '', description: ''});
            setIsAddingGoal(false);
        });
    };

    const handleAddStep = (goalId) => {
        const step = {
            title: newStep.title || 'Шаг не указан'
        };
        postData(`/api/goals/${goalId}/steps`, step, (step) => {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? {...goal, steps: goal.steps ? [...goal.steps, step] : [step]}
                    : goal
            ));
            setNewStep({title: ''});
            setIsAddingStep(null); // Скрыть поле добавления шага после его добавления
        });
    };

    const handleDeleteGoal = (goalId) => {
        deleteData(`/api/goals/${localStorage.getItem('userId')}/${goalId}`, () => {
            setGoals(goals.filter(goal => goal.id !== goalId));
        });
    };

    const handleDeleteStep = (goalId, stepId) => {
        deleteData(`/api/goals/${goalId}/steps/${stepId}`, () => {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? {...goal, steps: goal.steps.filter(step => step.id !== stepId)}
                    : goal
            ));
        });
    };

    return (
        <div className="dashboard-box">
            <div className="container">
                <div className="logout-container">
                    <svg
                        onClick={handleLogout}
                        onMouseEnter={() => setShowLogoutWarning(true)}
                        onMouseLeave={() => setShowLogoutWarning(false)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="logout-icon"
                        style={{cursor: 'pointer'}}
                    >
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path fill="currentColor"
                              d="M18.36 6.64a1 1 0 0 1 0 1.41L13.41 12l4.95 4.95a1 1 0 1 1-1.41 1.41L12 13.41l-4.95 4.95a1 1 0 0 1-1.41-1.41L10.59 12 5.64 7.05a1 1 0 0 1 1.41-1.41L12 10.59l4.95-4.95a1 1 0 0 1 1.41 0z"/>
                    </svg>
                    {showLogoutWarning && (
                        <div className="logout-warning warning-text warning-text__bg">Вы уверены, что хотите
                            выйти?</div>
                    )}
                </div>


                <header className="header">
                    <h1>Добро пожаловать, {localStorage.getItem('userName')}!</h1>

                </header>


                <div className="goal-box">
                    {isLoading ? (<p>Загрузка...</p>) : goals.length > 0 ? (
                        <div className="goal-list">
                            {goals.map(goal => (
                                <div
                                    key={goal.id}
                                    className="goal-item"
                                    onClick={() => {
                                        if (goal.id !== selectedGoalId) {
                                            setSelectedGoalId(goal.id);
                                        }
                                    }}
                                    style={{cursor: goal.id !== selectedGoalId ? 'pointer' : 'default'}}
                                >
                                    <h3
                                        onClick={() => {
                                            if (goal.id === selectedGoalId) {
                                                setSelectedGoalId(null);
                                            }
                                        }}
                                        style={{cursor: goal.id === selectedGoalId ? 'pointer' : 'default'}}
                                    >
                                        {goal.title}
                                    </h3>

                                    {selectedGoalId === goal.id && (
                                        <div className="goal-details">
                                            {editingGoal && editingGoal.id === goal.id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editingGoal.title}
                                                        onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})}
                                                        placeholder="Название цели"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingGoal.description}
                                                        onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
                                                        placeholder="Описание цели"
                                                    />
                                                    <button className="button" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateGoal(goal.id);
                                                    }}>
                                                        Сохранить изменения
                                                    </button>
                                                    <button className="button" onClick={() => setEditingGoal(null)}>
                                                        Отменить
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="goal-details-description">{goal.description}</p>
                                                    <button className="button" onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingGoal(goal); // Включаем режим редактирования
                                                    }}>
                                                        Изменить цель
                                                    </button>
                                                    <ul className="step-list">
                                                        {(goal.steps || []).length > 0 ? (
                                                            goal.steps.map(step => (
                                                                <li className="li" key={step.id}>
                                                                    {step.title}
                                                                    <button className={`button`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteStep(goal.id, step.id);
                                                                        }}
                                                                    >
                                                                        Удалить шаг
                                                                    </button>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <p className="warning-text warning-text__bg">Вы ещё не добавили шагов для достижения этой цели.</p>
                                                        )}
                                                    </ul>
                                                </>
                                            )}
                                            <div className="add-step-form">
                                                {!isAddingStep ? (
                                                    <button className="button" onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsAddingStep(goal.id);
                                                    }}>
                                                        Добавить шаг
                                                    </button>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Название шага"
                                                            value={newStep.title}
                                                            onChange={(e) => setNewStep({ title: e.target.value })}
                                                        />
                                                        <button className="button" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddStep(goal.id);
                                                        }}>
                                                            Сохранить шаг
                                                        </button>
                                                    </>
                                                )}
                                                <button className="button" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteGoal(goal.id);
                                                }}>
                                                    Удалить цель
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p className={`warning-text warning-text__bg`}>У вас ещё нет целей. Начните с добавления новой
                            цели.</p>
                    )}

                    <button className="button" onClick={() => setIsAddingGoal(!isAddingGoal)}>
                        {isAddingGoal ? 'Отменить' : 'Добавить цель'}
                    </button>

                    {isAddingGoal && (
                        <div className="add-goal-form">
                            <input
                                type="text"
                                placeholder="Название цели"
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Описание цели"
                                value={newGoal.description}
                                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                            />
                            <button className="button" onClick={handleAddGoal}>Сохранить цель</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
