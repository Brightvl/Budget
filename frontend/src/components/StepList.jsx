// code snippet from StepList.jsx
import React from 'react';
import AddStepForm from './AddStepForm';

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
        <div>
            <h1>Шаги</h1>
            <ul className="step-list">
                {(steps || []).length > 0 ? (
                    steps.map(step => (
                        <li className="li" key={step.id}>
                            {editingStep && editingStep.id === step.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingStep.title}
                                        onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                                        placeholder="Название шага"
                                    />
                                    <button className="button" onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStep(goalId, step.id);
                                    }}>
                                        Сохранить
                                    </button>
                                    <button className="button" onClick={() => setEditingStep(null)}>
                                        Отменить
                                    </button>
                                </>
                            ) : (
                                <>
                                    {step.title} - {step.completed ? "Завершено" : "В процессе"}
                                    <p>Время начала шага: {new Date(step.startTime).toLocaleString()}</p>
                                    <button className="button" onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStepCompletion(goalId, step.id);
                                    }}>
                                        {step.completed ? "Отметить как невыполненный" : "Отметить как выполненный"}
                                    </button>
                                    <button className="button" onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingStep(step);
                                    }}>
                                        Редактировать шаг
                                    </button>
                                    <button className="button" onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStep(goalId, step.id);
                                    }}>
                                        Удалить шаг
                                    </button>
                                </>
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
                    <button className="button" onClick={(e) => {
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
