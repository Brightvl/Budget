import React from 'react';
import EditableStepField from './EditableStepField.jsx';
import CheckIcon from '../../../assets/svg/CheckIcon.jsx';
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
        const updatedStep = { ...step, [field]: value };
        return handleUpdateStep(goalId, step.id, updatedStep);
    };

    return (
        <div className="stepItem">
            {!isSelected ? (
                <div className="stepItemHeader" onClick={onToggleSelect}>
                    <h3>{step.title}</h3>
                </div>
            ) : (
                <div className="stepItemDetails">
                    <div className="stepItemActionsBox">
                        <CheckIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStepCompletion(goalId, step.id);
                            }}
                            completed={step.completed} // передаем состояние completed
                        />
                        <div className="">
                            <MinusIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSelect();
                                }}
                            />
                            <TrashIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStep(goalId, step.id);
                                }}
                            />
                        </div>
                    </div>
                    <div className="stepItemInfo">
                        <EditableStepField
                            value={step.title}
                            onSave={(value) => saveField('title', value)}
                        />
                        <EditableStepField
                            value={step.description || ''}
                            onSave={(value) => saveField('description', value)}
                        />
                        <p>Дата создания шага: {new Date(step.startTime).toLocaleDateString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
