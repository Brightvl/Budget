import React from 'react';
import CheckIcon from '../../../assets/svg/CheckIcon.jsx';

export default function AddStepForm({ stepData, handleAddStep }) {
    const { newStep, setNewStep } = stepData;

    return (
        <div className="stepAddBox">
            <input
                className="stepFormInput"
                type="text"
                placeholder="Название шага"
                value={newStep.title}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
            />
            <input
                className="stepFormInput"
                type="text"
                placeholder="Описание шага"
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}

            />
            <CheckIcon onClick={handleAddStep} />

        </div>
    );
}
