import React, { useEffect, useContext, useState } from 'react';
import StepList from '../step/StepList.jsx';
import EditableField from './EditableField.jsx';
import TrashIcon from '../../../assets/svg/TrashIcon.jsx';
import MinusIcon from '../../../assets/svg/MinusIcon.jsx';
import AddStepForm from '../step/AddStepForm.jsx';
import { UserContext } from '../../../context/UserContext.jsx';

export default function GoalItem({
                                     goal,
                                     selectedGoalId,
                                     setSelectedGoalId,
                                     goalHandlers,
                                     goalStates,
                                     stepHandlers
                                 }) {
    const { user } = useContext(UserContext);
    const { handleUpdateGoal, handleDeleteGoal } = goalHandlers;
    const { setStepsForGoal } = goalStates;
    const [stepsLoaded, setStepsLoaded] = useState(false); // Новый стейт для отслеживания загрузки шагов

    const loadStepsForGoal = async (goalId) => {
        try {
            const response = await fetch(`/api/goals/${goalId}/steps`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            const steps = await response.json();
            setStepsForGoal(goalId, steps);
            setStepsLoaded(true); // Устанавливаем флаг, что шаги загружены
        } catch (error) {
            console.error("Error loading steps:", error);
        }
    };

    useEffect(() => {
        if (selectedGoalId === goal.id && !stepsLoaded) { // Загружаем шаги только если они еще не загружены
            loadStepsForGoal(goal.id);
        }
    }, [selectedGoalId]);

    const completedSteps = (goal.steps || []).filter(step => step.completed).length;
    const totalSteps = goal.steps?.length || 0;
    const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const saveField = (field, value) => {
        const updatedGoal = { ...goal, [field]: value };
        return handleUpdateGoal(goal.id, updatedGoal).then(() => {
            setStepsLoaded(false); // Сбрасываем флаг, чтобы шаги могли быть перезагружены после обновления цели
        });
    };

    return (
        <div
            className="goalItem"
            style={{ cursor: goal.id !== selectedGoalId ? 'pointer' : 'default' }}
            onClick={() => setSelectedGoalId(goal.id)}
        >
            <div className="goalItemHeader">
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
                            <div className="">
                                <h4>Название</h4>
                                <EditableField
                                    value={goal.title}
                                    onSave={(value) => saveField('title', value)}
                                />
                            </div>
                            <div className="">
                                <h4>Описание</h4>
                                <EditableField
                                    value={goal.description}
                                    onSave={(value) => saveField('description', value)}
                                />
                            </div>

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
