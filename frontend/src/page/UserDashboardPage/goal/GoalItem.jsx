import React, { useEffect, useContext } from 'react';
import StepList from '../step/StepList.jsx';
import EditableField from './EditableField.jsx';
import TrashIcon from '../../../assets/svg/TrashIcon.jsx';
import MinusIcon from '../../../assets/svg/MinusIcon.jsx';
import AddStepForm from '../step/AddStepForm.jsx';
import { UserContext } from '../../../context/UserContext.jsx'; // Импортируем контекст пользователя

export default function GoalItem({
                                     goal,
                                     selectedGoalId,
                                     setSelectedGoalId,
                                     goalHandlers,
                                     goalStates,
                                     stepHandlers
                                 }) {
    const { user } = useContext(UserContext); // Достаем пользователя из контекста
    const { handleUpdateGoal, handleDeleteGoal } = goalHandlers;
    const { editingGoal, setEditingGoal, setStepsForGoal } = goalStates;

    // Функция для загрузки шагов при открытии цели
    const loadStepsForGoal = async (goalId) => {
        try {
            const response = await fetch(`/api/goals/${goalId}/steps`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`, // Используем токен из контекста пользователя
                    'Content-Type': 'application/json',
                },
            });
            const steps = await response.json();
            setStepsForGoal(goalId, steps); // Сохраняем шаги в состоянии
        } catch (error) {
            console.error("Error loading steps:", error);
        }
    };

    useEffect(() => {
        if (selectedGoalId === goal.id && (!goal.steps || goal.steps.length === 0)) {
            loadStepsForGoal(goal.id); // Загружаем шаги при первом открытии цели
        }
    }, [selectedGoalId, goal.steps]); // Добавляем зависимость от goal.steps


    const completedSteps = (goal.steps || []).filter(step => step.completed).length;
    const totalSteps = goal.steps?.length || 0;
    const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const saveField = (field, value) => {
        const updatedGoal = { ...goal, [field]: value };
        setEditingGoal(null);
        return handleUpdateGoal(goal.id, updatedGoal);
    };

    return (
        <div
            className="goalItem"
            style={{ cursor: goal.id !== selectedGoalId ? 'pointer' : 'default' }}
            onClick={() => setSelectedGoalId(goal.id)}
        >
            <div className="goalHeader">
                <h2>
                    {goal.title} ({completionPercentage.toFixed(0)}%)
                </h2>
            </div>

            {selectedGoalId === goal.id && (
                <>
                    <div className="goalItemDetails">
                        <div className="Actions">
                            <MinusIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGoalId(null);
                                }}
                            />
                            <TrashIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGoal(goal.id);
                                }}
                            />
                        </div>

                        <div className="goalItemInfo">
                            <EditableField
                                value={goal.title}
                                onSave={(value) => saveField('title', value)}
                            />
                            <EditableField
                                value={goal.description}
                                onSave={(value) => saveField('description', value)}
                            />
                            <p>Дата создания: {new Date(goal.startTime).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="goalItemSteps">
                        {goal.steps && goal.steps.length > 0 ? (
                            <StepList
                                goalId={goal.id}
                                steps={goal.steps}
                                stepHandlers={stepHandlers}
                            />
                        ) : (
                            <p>Шаги отсутствуют</p>
                        )}
                    </div>

                    <div className="add-step-form">
                        {!goalStates.isAddingStep ? (
                            <button className="goalFormButton" onClick={() => goalStates.setIsAddingStep(goal.id)}>
                                Добавить шаг
                            </button>
                        ) : (
                            <AddStepForm
                                stepData={{ newStep: goalStates.newStep, setNewStep: goalStates.setNewStep }}
                                handleAddStep={() => stepHandlers.handleAddStep(goal.id)}
                                handleCancel={() => goalStates.setIsAddingStep(null)}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
