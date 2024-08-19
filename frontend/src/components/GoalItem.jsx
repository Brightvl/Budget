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
            key={goal.id}
            className="goal-item"
            onClick={() => {
                if (goal.id !== selectedGoalId) {
                    setSelectedGoalId(goal.id);
                }
            }}
            style={{ cursor: goal.id !== selectedGoalId ? 'pointer' : 'default' }}
        >
            <h3
                onClick={() => {
                    if (goal.id === selectedGoalId) {
                        setSelectedGoalId(null);
                    }
                }}
                style={{ cursor: goal.id === selectedGoalId ? 'pointer' : 'default' }}
            >
                {goal.title} ({completionPercentage.toFixed(0)}%)
            </h3>
            <p>Дата создания: {new Date(goal.startTime).toLocaleString()}</p>

            {selectedGoalId === goal.id && (
                <div className="goal-details">
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
                        <>
                            <p className="goal-details-description">{goal.description}</p>
                            <button className="button" onClick={(e) => {
                                e.stopPropagation();
                                setEditingGoal(goal);
                            }}>
                                Изменить цель
                            </button>

                            <StepList
                                goalId={goal.id}
                                steps={goal.steps}
                                stepHandlers={stepHandlers}
                                stepStates={goalStates}  // Используем goalStates для шагов
                            />
                        </>
                    )}
                    <button className="button" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(goal.id);
                    }}>
                        Удалить цель
                    </button>
                </div>
            )}
        </div>
    );
}
