import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import { fetchData, postData, putData, deleteData } from "../../services/apiService.js";
import Header from "../../components/Header.jsx";
import GoalList from "./goal/GoalList.jsx";
import LogoutButton from "../../components/LogoutButton.jsx";
import AddGoalForm from "./goal/AddGoalForm.jsx";
import { handleLogout } from "../../utils/authUtils.js";
import "./UserDashboardPage.scss";

export function UserDashboardPage() {
    const navigate = useNavigate();
    const { user, role, logoutUser } = useContext(UserContext);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', description: '' });
    const [editingGoal, setEditingGoal] = useState(null);
    const [newStep, setNewStep] = useState({ title: '', description: '' });
    const [editingStep, setEditingStep] = useState(null);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [isAddingStep, setIsAddingStep] = useState(null);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);

    // Новое состояние для хранения шагов
    const setStepsForGoal = (goalId, steps) => {
        setGoals(prevGoals =>
            prevGoals.map(goal =>
                goal.id === goalId ? { ...goal, steps } : goal
            )
        );
    };

    useEffect(() => {
        if (role !== 'USER') {
            navigate('/auth');
            return;
        }

        if (!user) {
            navigate('/auth');
            return;
        }

        fetchData(`/api/goals/`, user, setGoals, setIsLoading)
            .catch(() => {
                logoutUser();
                navigate('/auth');
            });
    }, [user, navigate]);

    const handleAddGoal = () => {
        const goal = {
            title: newGoal.title || 'Цель не указана',
            description: newGoal.description || 'Нет описания',
            startTime: new Date().toISOString(),
            steps: []
        };
        postData(`/api/goals/${user.id}`, user, goal, (goal) => {
            setGoals([...goals, goal]);
            setNewGoal({ title: '', description: '' });
            setIsAddingGoal(false);
        });
    };

    const handleCancelAddGoal = () => {
        setIsAddingGoal(false);
    };

    const handleUpdateGoal = (goalId, updatedGoal) => {
        return new Promise((resolve, reject) => {
            putData(`/api/goals/${user.id}/${goalId}`, user, updatedGoal, (updatedGoal) => {
                setGoals(goals.map(goal =>
                    goal.id === goalId ? updatedGoal : goal
                ));
                setEditingGoal(null);
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    };

    const handleAddStep = (goalId) => {
        const step = {
            title: newStep.title || 'Шаг не указан',
            description: newStep.description || 'Нет описания',
            startTime: new Date().toISOString(),
            completed: false
        };
        postData(`/api/goals/${goalId}/steps`, user, step, (step) => {
            setGoals(goals.map(goal =>
                goal.id === goalId ? {
                    ...goal, steps: goal.steps ? [...goal.steps, step] : [step]
                } : goal
            ));
            setNewStep({ title: '', description: '' });
            setIsAddingStep(null);
        });
    };

    const handleToggleStepCompletion = (goalId, stepId) => {
        const goal = goals.find(g => g.id === goalId);
        const step = goal.steps.find(s => s.id === stepId);

        const updatedStep = { ...step, completed: !step.completed };

        putData(`/api/goals/${goalId}/steps/${stepId}`, user, updatedStep, (updatedStep) => {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? {
                        ...goal,
                        steps: goal.steps.map(step => step.id === stepId ? updatedStep : step)
                    }
                    : goal
            ));
        });
    };

    const handleUpdateStep = (goalId, stepId, updatedStep) => {
        return putData(`/api/goals/${goalId}/steps/${stepId}`, user, updatedStep, (updatedStep) => {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? {
                        ...goal,
                        steps: goal.steps.map(step => step.id === stepId ? updatedStep : step)
                    }
                    : goal
            ));
            setEditingStep(null);
        });
    };

    const handleDeleteGoal = (goalId) => {
        deleteData(`/api/goals/${user.id}/${goalId}`, user, () => {
            setGoals(goals.filter(goal => goal.id !== goalId));
        });
    };

    const handleDeleteStep = (goalId, stepId) => {
        deleteData(`/api/goals/${goalId}/steps/${stepId}`, user, () => {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? { ...goal, steps: goal.steps.filter(step => step.id !== stepId) }
                    : goal
            ));
        });
    };

    const goalHandlers = {
        handleUpdateGoal,
        handleDeleteGoal,
    };

    const goalStates = {
        editingGoal,
        setEditingGoal,
        isAddingStep,
        setIsAddingStep,
        newStep,
        setNewStep,
        editingStep,
        setEditingStep,
        setStepsForGoal // Добавляем эту функцию в goalStates
    };

    const stepHandlers = {
        handleAddStep,
        handleDeleteStep,
        handleToggleStepCompletion,
        handleUpdateStep
    };

    return (
        <div className="container">
            <div className="dashboardBox">
                <LogoutButton
                    handleLogout={() => handleLogout(navigate, logoutUser)}
                    showLogoutWarning={showLogoutWarning}
                    setShowLogoutWarning={setShowLogoutWarning}
                />
                <Header name={user?.name} />

                {isLoading ? (
                    <p>Загрузка...</p>
                ) : (
                    <GoalList
                        goals={goals}
                        selectedGoalId={selectedGoalId}
                        setSelectedGoalId={setSelectedGoalId}
                        goalHandlers={goalHandlers}
                        goalStates={goalStates}
                        stepHandlers={stepHandlers}
                    />
                )}

                <div className="goalFormBox">
                    {!isAddingGoal && (
                        <button className="dashboardButton" onClick={() => setIsAddingGoal(!isAddingGoal)}>
                            Добавить цель
                        </button>
                    )}

                    {isAddingGoal && (
                        <AddGoalForm
                            goalData={{ newGoal, setNewGoal }}
                            handleAddGoal={handleAddGoal}
                            handleCancel={handleCancelAddGoal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
