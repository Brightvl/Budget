// code snippet from StepList.jsx
import React from 'react';
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
        <div className={"stepBox"}>
            <h1>Шаги</h1>
            <ul className="stepUl">
                {(steps || []).length > 0 ? (
                    steps.map(step => (
                        <li className="stepUlli" key={step.id}>
                            {editingStep && editingStep.id === step.id ? (
                                <div>
                                    <input
                                        className={"stepFormInput"}
                                        type="text"
                                        value={editingStep.title}
                                        onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                                        placeholder="Название шага"
                                    />
                                    <button className="stepFormButton" onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStep(goalId, step.id);
                                    }}>
                                        Сохранить
                                    </button>
                                    <button className="stepFormButton" onClick={() => setEditingStep(null)}>
                                        Отменить
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2>
                                        {step.title} - {step.completed ? "Завершено" : "В процессе"}
                                    </h2>
                                    <button className="stepFormButtonStatus" onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStepCompletion(goalId, step.id);
                                    }}>
                                        {step.completed ? "Отметить как невыполненный" : "Отметить как выполненный"}
                                    </button>
                                    <p>Время начала шага: {new Date(step.startTime).toLocaleDateString()}</p>

                                    <div className="stepFormButtonGroup">
                                        <button className="stepFormButton" onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingStep(step);
                                        }}>
                                            Редактировать шаг
                                        </button>
                                        <button className="stepFormButtonDelete" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteStep(goalId, step.id);
                                        }}>
                                            Удалить шаг
                                        </button>
                                    </div>

                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <div>
                        <p className="warning-text warning-text__bg">Вы ещё не добавили шагов для достижения этой
                            цели.</p>
                    </div>
                )}
            </ul>

            <div className="add-step-form">
                {!isAddingStep ? (
                    <button className="stepFormButton" onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingStep(goalId);  // Ошибка здесь
                    }}>
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
