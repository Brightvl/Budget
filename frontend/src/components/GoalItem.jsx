// src/components/GoalItem.jsx
import AddStepForm from "./AddStepForm";

export default function GoalItem({
                                     goal,
                                     handlers,
                                     formStates,
                                     selectedGoalId,
                                     setSelectedGoalId
                                 }) {
    const {
        handleUpdateGoal,
        handleDeleteGoal,
        handleAddStep,
        handleDeleteStep
    } = handlers;

    const {
        editingGoal,
        setEditingGoal,
        isAddingStep,
        setIsAddingStep,
        newStep,
        setNewStep
    } = formStates;

    return (
        <div
            key={goal.id}
            className="goal-item"
            onClick={() => {
                if (goal.id !== selectedGoalId) {
                    setSelectedGoalId(goal.id);
                }
            }}
            style={{ cursor: goal.id !== selectedGoalId ? 'pointer' : 'default' }}
        >
            <h3
                onClick={() => {
                    if (goal.id === selectedGoalId) {
                        setSelectedGoalId(null);
                    }
                }}
                style={{ cursor: goal.id === selectedGoalId ? 'pointer' : 'default' }}
            >
                {goal.title}
            </h3>

            {selectedGoalId === goal.id && (
                <div className="goal-details">
                    {editingGoal && editingGoal.id === goal.id ? (
                        <>
                            <input
                                type="text"
                                value={editingGoal.title}
                                onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                                placeholder="Название цели"
                            />
                            <input
                                type="text"
                                value={editingGoal.description}
                                onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                                placeholder="Описание цели"
                            />
                            <button className="button" onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateGoal(goal.id);
                            }}>
                                Сохранить изменения
                            </button>
                            <button className="button" onClick={() => setEditingGoal(null)}>
                                Отменить
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="goal-details-description">{goal.description}</p>
                            <button className="button" onClick={(e) => {
                                e.stopPropagation();
                                setEditingGoal(goal);
                            }}>
                                Изменить цель
                            </button>
                            <ul className="step-list">
                                {(goal.steps || []).length > 0 ? (
                                    goal.steps.map(step => (
                                        <li className="li" key={step.id}>
                                            {step.title}
                                            <button className="button" onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStep(goal.id, step.id);
                                            }}>
                                                Удалить шаг
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="warning-text warning-text__bg">Вы ещё не добавили шагов для достижения этой цели.</p>
                                )}
                            </ul>
                        </>
                    )}
                    <div className="add-step-form">
                        {!isAddingStep ? (
                            <button className="button" onClick={(e) => {
                                e.stopPropagation();
                                setIsAddingStep(goal.id);
                            }}>
                                Добавить шаг
                            </button>
                        ) : (
                            <AddStepForm
                                stepData={{ newStep, setNewStep }}
                                handleAddStep={() => handleAddStep(goal.id)}
                            />
                        )}
                        <button className="button" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goal.id);
                        }}>
                            Удалить цель
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}