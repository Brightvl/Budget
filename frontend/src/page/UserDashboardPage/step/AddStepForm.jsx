import React from 'react';
import CheckIcon from '../../../assets/svg/CheckIcon.jsx';

export default function AddStepForm({ stepData, handleAddStep }) {
    const { newStep, setNewStep } = stepData;

    return (
        <div className="addStepForm">
            <input
                className={"stepFormInput"}
                type="text"
                placeholder="Название шага"
                value={newStep.title}
                onChange={(e) => setNewStep({ title: e.target.value })}
            />
            <CheckIcon onClick={handleAddStep} />
        </div>
    );
}
