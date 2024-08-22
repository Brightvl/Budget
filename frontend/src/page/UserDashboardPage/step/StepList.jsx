import React from 'react';
import EditableStepField from './EditableStepField.jsx';
import CheckIcon from '../../../assets/svg/CheckIcon.jsx';
import TrashIcon from '../../../assets/svg/TrashIcon.jsx';
import AddStepForm from './AddStepForm.jsx';

export default function StepList({
                                     goalId,
                                     steps,
                                     stepHandlers,
                                     stepStates
                                 }) {
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
        setNewStep,
        editingStep,
        setEditingStep
    } = stepStates;

    return (
        <div className="stepBox">
            <h1>Шаги</h1>
            <ul className="stepUl">
                {(steps || []).length > 0 ? (
                    steps.map(step => (
                        <li className="stepUlli" key={step.id}>
                            {editingStep && editingStep.id === step.id ? (
                                <EditableStepField
                                    value={editingStep.title}
                                    onSave={(value) => handleUpdateStep(goalId, step.id, value)}
                                />
                            ) : (
                                <div className="stepItem">
                                    <h2>
                                        {step.title} - {step.completed ? "Завершено" : "В процессе"}
                                    </h2>
                                    <div className="stepActions">
                                        <CheckIcon onClick={() => handleToggleStepCompletion(goalId, step.id)} />
                                        <TrashIcon onClick={() => handleDeleteStep(goalId, step.id)} />
                                    </div>
                                    <p>Время начала шага: {new Date(step.startTime).toLocaleDateString()}</p>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <div>
                        <p className="warning-text warning-text__bg">Вы ещё не добавили шагов для достижения этой цели.</p>
                    </div>
                )}
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
