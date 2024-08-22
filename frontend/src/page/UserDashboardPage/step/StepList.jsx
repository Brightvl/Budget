import React, { useState } from 'react';
import StepItem from './StepItem.jsx';

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
        handleUpdateStep
    } = stepHandlers;

    const handleToggleSelectStep = (stepId) => {
        setSelectedStepId(selectedStepId === stepId ? null : stepId);
    };

    return (
        <div className="stepBox">
            <ul className="stepList">
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
        </div>
    );
}
