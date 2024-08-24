import React from 'react';
import CheckIcon from '../../../assets/svg/CheckIcon.jsx';
import XIcon from "../../../assets/svg/XIcon.jsx";

export default function AddStepForm({ stepData, handleAddStep, handleCancel}) {
    const { newStep, setNewStep } = stepData;

    return (
        <div className="stepAddBox">
            <div className="stepAddBoxInputBox"><p>Название</p>
                <input
                    className="stepFormInput"
                    type="text"
                    placeholder="Название шага"
                    value={newStep.title}
                    onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                /></div>
            <div className="stepAddBoxInputBox">
                <p>Описание</p>
                <input
                    className="stepFormInput"
                    type="text"
                    placeholder="Описание шага"
                    value={newStep.description}
                    onChange={(e) => setNewStep({...newStep, description: e.target.value})}

                />
            </div>
<div className="stepAddBoxInputBox">
    <CheckIcon onClick={handleAddStep}/>
    <XIcon onClick={handleCancel}/>
</div>

        </div>
    );
}
