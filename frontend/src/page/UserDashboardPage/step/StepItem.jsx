import React from 'react';
import EditableStepField from './EditableStepField.jsx';
import CheckBoxIcon from '../../../assets/svg/CheckBoxIcon.jsx';
import TrashIcon from '../../../assets/svg/TrashIcon.jsx';
import MinusIcon from '../../../assets/svg/MinusIcon.jsx';

export default function StepItem({
                                     step,
                                     goalId,
                                     isSelected,
                                     onToggleSelect,
                                     handleToggleStepCompletion,
                                     handleDeleteStep,
                                     handleUpdateStep
                                 }) {
    const saveField = (field, value) => {
        const updatedStep = {...step, [field]: value};
        return handleUpdateStep(goalId, step.id, updatedStep);
    };

    return (
        <div className="stepItem">
            {!isSelected ? (
                <div className="stepItemHeader" onClick={onToggleSelect}>
                    <h3>{step.title}</h3>
                    <CheckBoxIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStepCompletion(goalId, step.id);
                        }}
                        completionPercentage={step.completed ? 100 : 0}
                        isFailed={false}
                        isGoal={false} // указываем, что это не иконка цели, а шага
                    />
                </div>
            ) : (
                <div className="stepItemDetails">
                    <div className="stepItemActionsBox">
                        <div className="">
                            <TrashIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStep(goalId, step.id);
                                }}
                            />
                        </div>
                        <div className="">
                            <MinusIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSelect();
                                }}
                            />
                            <CheckBoxIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStepCompletion(goalId, step.id);
                                }}
                                completionPercentage={step.completed ? 100 : 0}
                                isFailed={false}
                                isGoal={false}
                            />
                        </div>
                    </div>
                    <div className="stepItemInfo">
                        <h5>Создан: {new Date(step.startTime).toLocaleDateString()}</h5>
                        <div className="">
                            <h5>Название шага</h5>
                            <EditableStepField
                                value={step.title}
                                onSave={(value) => saveField('title', value)}
                            />
                        </div>
                        <div className="">
                            <h5>Описание</h5>
                            <EditableStepField
                                value={step.description || ''}
                                onSave={(value) => saveField('description', value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
