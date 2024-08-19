// src/page/UserDashboardPage.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { fetchData, postData, deleteData } from "../services/apiService";
import Header from "../components/Header";
import GoalList from "../components/GoalList";
import LogoutButton from "../components/LogoutButton";
import AddGoalForm from "../components/AddGoalForm";
import {handleLogout} from "../utils/authUtils.js";

export function UserDashboardPage() {
    const navigate = useNavigate();
    const { user, logoutUser } = useContext(UserContext);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState({ title: '', description: '' });
    const [editingGoal, setEditingGoal] = useState(null);
    const [newStep, setNewStep] = useState({ title: '' });
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
            description: newGoal.description || 'Нет описания'
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
        postData(`/api/goals/${user.id}/${goalId}`, user, updatedGoal, (updatedGoal) => {
            setGoals(goals.map(goal =>
                goal.id === goalId ? updatedGoal : goal
            ));
            setEditingGoal(null);
        });
    };

    const handleAddStep = (goalId) => {
        const step = {
            title: newStep.title || 'Шаг не указан'
        };
        postData(`/api/goals/${goalId}/steps`, user, step, (step) => {
            setGoals(goals.map(goal =>
                goal.id === goalId
                    ? { ...goal, steps: goal.steps ? [...goal.steps, step] : [step] }
                    : goal
            ));
            setNewStep({ title: '' });
            setIsAddingStep(null);
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
                            handleUpdateGoal={handleUpdateGoal}
                            handleDeleteGoal={handleDeleteGoal}
                            handleAddStep={handleAddStep}
                            handleDeleteStep={handleDeleteStep}
                            editingGoal={editingGoal}
                            setEditingGoal={setEditingGoal}
                            isAddingStep={isAddingStep}
                            setIsAddingStep={setIsAddingStep}
                            newStep={newStep}
                            setNewStep={setNewStep}
                        />
                    )}
                    <button className="button" onClick={() => setIsAddingGoal(!isAddingGoal)}>
                        {isAddingGoal ? 'Отменить' : 'Добавить цель'}
                    </button>
                    {isAddingGoal && (
                        <AddGoalForm
                            newGoal={newGoal}
                            setNewGoal={setNewGoal}
                            handleAddGoal={handleAddGoal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
