import React, { useState } from 'react';
import StepItem from './StepItem.jsx';
import AddStepForm from './AddStepForm.jsx';

export default function StepList({
                                     goalId,
                                     steps,
                                     stepHandlers,
                                     stepStates
                                 }) {
    const [selectedStepId, setSelectedStepId] = useState(null);

    const {
        handleToggleStepCompletion,
        handleDeleteStep,
        handleUpdateStep,
        handleAddStep
    } = stepHandlers;

    const {
        isAddingStep,
        setIsAddingStep,
        newStep,
        setNewStep
    } = stepStates;

    const handleToggleSelectStep = (stepId) => {
        setSelectedStepId(selectedStepId === stepId ? null : stepId);
    };

    return (
        <div className="stepBox">
            <h1>Шаги</h1>
            <ul className="stepUl">
                {(steps || []).map(step => (
                    <StepItem
                        key={step.id}
                        step={step}
                        goalId={goalId}
                        isSelected={selectedStepId === step.id}
                        onToggleSelect={() => handleToggleSelectStep(step.id)}
                        handleToggleStepCompletion={handleToggleStepCompletion}
                        handleDeleteStep={handleDeleteStep}
                        handleUpdateStep={handleUpdateStep}
                    />
                ))}
            </ul>

            <div className="add-step-form">
                {!isAddingStep ? (
                    <button className="stepFormButton" onClick={() => setIsAddingStep(goalId)}>
                        Добавить шаг
                    </button>
                ) : (
                    <AddStepForm
                        stepData={{ newStep, setNewStep }}
                        handleAddStep={() => handleAddStep(goalId)}
                    />
                )}
            </div>
        </div>
    );
}
