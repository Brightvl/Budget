import React from 'react';
import AddStepForm from './AddStepForm';
import StepList from './StepList';

export default function GoalItem({
                                     goal,
                                     selectedGoalId,
                                     setSelectedGoalId,
                                     goalHandlers,
                                     goalStates,
                                     stepHandlers
                                 }) {
    const { handleUpdateGoal, handleDeleteGoal } = goalHandlers;  // Деструктурируем goalHandlers
    const { editingGoal, setEditingGoal } = goalStates;

    const completedSteps = (goal.steps || []).filter(step => step.completed).length;
    const totalSteps = goal.steps?.length || 0;
    const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
        <div
            className="goalItem"
            key={goal.id}
            onClick={() => {
                if (goal.id !== selectedGoalId) {
                    setSelectedGoalId(goal.id);
                }
            }}
            style={{ cursor: goal.id !== selectedGoalId ? 'pointer' : 'default' }}
        >
            <h2
                onClick={() => {
                    if (goal.id === selectedGoalId) {
                        setSelectedGoalId(null);
                    }
                }}
                style={{ cursor: goal.id === selectedGoalId ? 'pointer' : 'default' }}
            >
                {goal.title} ({completionPercentage.toFixed(0)}%)
            </h2>
            <p>Дата создания: {new Date(goal.startTime).toLocaleDateString()}</p>

            {selectedGoalId === goal.id && (
                <div className="goalItemDetails">
                    {editingGoal && editingGoal.id === goal.id ? (
                        <>
                            <input
                                type="text"
                                value={editingGoal.title}
                                onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                                placeholder="Название цели"
                            />
                            <input
                                type="text"
                                value={editingGoal.description}
                                onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
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
                        <div>
                            <h3 className="goalItemDescription"> Описание: {goal.description}</h3>
                            <div className="goalFormButtonGroup">
                                <button className="goalFormButton" onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingGoal(goal);
                                }}>
                                    Изменить цель
                                </button>
                                <button className="goalFormButtonDelete" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGoal(goal.id);
                                }}>
                                    Удалить цель
                                </button>
                            </div>
                        </div>
                    )}
                    <StepList
                        goalId={goal.id}
                        steps={goal.steps}
                        stepHandlers={stepHandlers}
                        stepStates={goalStates}
                    />
                </div>
            )}
        </div>
    );
}
