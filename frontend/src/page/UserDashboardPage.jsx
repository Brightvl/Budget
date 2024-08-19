import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { deleteData, fetchData, postData, putData } from "../services/apiService";
import Header from "../components/Header";
import GoalList from "../components/GoalList";
import LogoutButton from "../components/LogoutButton";
import AddGoalForm from "../components/AddGoalForm";
import { handleLogout } from "../utils/authUtils.js";

export function UserDashboardPage() {
    const navigate = useNavigate();
    const { user, logoutUser } = useContext(UserContext);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', description: '' });
    const [editingGoal, setEditingGoal] = useState(null);
    const [newStep, setNewStep] = useState({ title: '' });
    const [editingStep, setEditingStep] = useState(null);  // Добавлено состояние для редактирования шага
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [isAddingStep, setIsAddingStep] = useState(null);
    const [showLogoutWarning, setShowLogoutWarning] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        fetchData(`/api/goals/`, user, setGoals, setIsLoading);
    }, [user, navigate]);

    const handleAddGoal = () => {
        const goal = {
            title: newGoal.title || 'Цель не указана',
            description: newGoal.description || 'Нет описания',
            startTime: new Date().toISOString(),  // Добавляем время создания
            steps: []
        };
        postData(`/api/goals/${user.id}`, user, goal, (goal) => {
            setGoals([...goals, goal]);
            setNewGoal({ title: '', description: '' });
            setIsAddingGoal(false);
        });
    };

    const handleUpdateGoal = (goalId) => {
        const updatedGoal = {
            title: editingGoal.title || 'Цель не указана',
            description: editingGoal.description || 'Нет описания'
        };
        putData(`/api/goals/${user.id}/${goalId}`, user, updatedGoal, (updatedGoal) => {
            setGoals(goals.map(goal =>
                goal.id === goalId ? updatedGoal : goal
            ));
            setEditingGoal(null);
        });
    };

    const handleAddStep = (goalId) => {
        const step = {
            title: newStep.title || 'Шаг не указан',
            startTime: new Date().toISOString(),  // Добавляем время начала
            completed: false
        };
        postData(`/api/goals/${goalId}/steps`,
            user,
            step,
            (step) => {
                setGoals(goals.map(goal =>
                    goal.id === goalId ? {
                        ...goal, steps: goal.steps ? [...goal.steps, step] : [step]
                    } : goal
                ));

                setNewStep({ title: '' });
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

    const handleUpdateStep = (goalId, stepId) => {
        const goal = goals.find(g => g.id === goalId);
        const step = goal.steps.find(s => s.id === stepId);

        const updatedStep = { ...editingStep };

        putData(`/api/goals/${goalId}/steps/${stepId}`, user, updatedStep, (updatedStep) => {
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

    const formStates = {
        editingGoal,
        setEditingGoal,
        isAddingStep,
        setIsAddingStep,
        newStep,
        setNewStep,
        editingStep,  // Добавлено состояние для редактирования шага
        setEditingStep
    };

    const handlers = {
        handleUpdateGoal,
        handleDeleteGoal,
        handleAddStep,
        handleDeleteStep,
        handleToggleStepCompletion,
        handleUpdateStep
    };

    return (
        <div className="dashboard-box">
            <div className="container">
                <LogoutButton
                    handleLogout={handleLogout}
                    showLogoutWarning={showLogoutWarning}
                    setShowLogoutWarning={setShowLogoutWarning}
                />
                <Header username={user?.username} />
                <div className="goal-box">
                    {isLoading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <GoalList
                            goals={goals}
                            selectedGoalId={selectedGoalId}
                            setSelectedGoalId={setSelectedGoalId}
                            handlers={handlers}
                            formStates={formStates}
                        />
                    )}
                    <button className="button" onClick={() => setIsAddingGoal(!isAddingGoal)}>
                        {isAddingGoal ? 'Отменить' : 'Добавить цель'}
                    </button>
                    {isAddingGoal && (
                        <AddGoalForm
                            goalData={{ newGoal, setNewGoal }}
                            handleAddGoal={handleAddGoal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
