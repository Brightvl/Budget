import React from 'react';
import StepList from '../step/StepList.jsx';
import EditableField from './EditableField.jsx';
import TrashIcon from '../../../assets/svg/TrashIcon.jsx';
import MinusIcon from '../../../assets/svg/MinusIcon.jsx';

export default function GoalItem({
                                     goal,
                                     selectedGoalId,
                                     setSelectedGoalId,
                                     goalHandlers,
                                     goalStates,
                                     stepHandlers
                                 }) {
    const { handleUpdateGoal, handleDeleteGoal } = goalHandlers;
    const { editingGoal, setEditingGoal } = goalStates;

    const completedSteps = (goal.steps || []).filter(step => step.completed).length;
    const totalSteps = goal.steps?.length || 0;
    const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const saveField = (field, value) => {
        const updatedGoal = { ...goal, [field]: value };
        setEditingGoal(null); // Очищаем состояние редактирования
        return handleUpdateGoal(goal.id, updatedGoal); // Возвращаем Promise, чтобы отследить завершение сохранения
    };

    return (
        <div
            className="goalItem"
            style={{ cursor: goal.id !== selectedGoalId ? 'pointer' : 'default' }}
            onClick={() => {
                if (goal.id !== selectedGoalId) {
                    setSelectedGoalId(goal.id);
                }
            }}
        >
            {/* Свернутое состояние */}
            <div className="goalHeader">
                <h2>
                    {goal.title} ({completionPercentage.toFixed(0)}%)
                </h2>
            </div>

            {/* Развернутое состояние */}
            {selectedGoalId === goal.id && (
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
