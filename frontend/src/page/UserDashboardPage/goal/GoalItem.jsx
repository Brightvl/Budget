import React, {useContext, useEffect, useState} from 'react';
import StepList from '../step/StepList.jsx';
import EditableField from './EditableField.jsx';
import TrashIcon from '../../../assets/svg/TrashIcon.jsx';
import MinusIcon from '../../../assets/svg/MinusIcon.jsx';
import AddStepForm from '../step/AddStepForm.jsx';
import CheckBoxIcon from '../../../assets/svg/CheckBoxIcon.jsx';
import {UserContext} from '../../../context/UserContext.jsx';

export default function GoalItem({
                                     goal,
                                     selectedGoalId,
                                     setSelectedGoalId,
                                     goalHandlers,
                                     goalStates,
                                     stepHandlers
                                 }) {
    const {user} = useContext(UserContext);
    const {handleUpdateGoal, handleDeleteGoal} = goalHandlers;
    const {setStepsForGoal} = goalStates;
    const [stepsLoaded, setStepsLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [localGoal, setLocalGoal] = useState(goal);
    const [manualCompletion, setManualCompletion] = useState(goal.isCompleted && !goal.isFailed);

    const loadStepsForGoal = async (goalId) => {
        try {
            const response = await fetch(`/api/goals/${goalId}/steps`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            const steps = await response.json();
            setStepsForGoal(goalId, steps);
            setStepsLoaded(true);
        } catch (error) {
            console.error("Error loading steps:", error);
        }
    };

    useEffect(() => {
        if (selectedGoalId === goal.id && !stepsLoaded) {
            loadStepsForGoal(goal.id);
        }
    }, [selectedGoalId]);

    useEffect(() => {
        setLocalGoal(goal);
        if (goal.isCompleted && !goal.isFailed && completionPercentage < 100) {
            setManualCompletion(true);
        } else {
            setManualCompletion(false);
        }
    }, [goal]);

    const updateGoalState = async (updatedFields) => {
        const updatedGoal = {...localGoal, ...updatedFields};
        setLocalGoal(updatedGoal);
        await handleUpdateGoal(goal.id, updatedGoal);
    };

    const handleMarkAsCompleted = () => {
        updateGoalState({isCompleted: true, isFailed: false});
        setMenuOpen(false);
    };

    const handleMarkAsFailed = () => {
        updateGoalState({isCompleted: false, isFailed: true});
        setMenuOpen(false);
    };

    const handleResetStatus = () => {
        updateGoalState({isCompleted: false, isFailed: false});
        setMenuOpen(false);
    };

    const handleIconClick = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const completedSteps = (localGoal.steps || []).filter(step => step.completed).length;
    const totalSteps = localGoal.steps?.length || 0;
    const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
        <div
            className="goalItem"
            style={{cursor: localGoal.id !== selectedGoalId ? 'pointer' : 'default'}}
            onClick={() => setSelectedGoalId(localGoal.id)}
        >
            <div className="goalItemHeader">
                <h2>
                    {localGoal.title}
                </h2>
                <CheckBoxIcon
                    onClick={handleIconClick}
                    completionPercentage={completionPercentage}
                    isFailed={localGoal.isFailed}
                    manualCompletion={manualCompletion}
                    isGoal={true}
                />
            </div>

            {menuOpen && (
                <div className="goalStatusMenu">

                    <button onClick={handleMarkAsCompleted} disabled={localGoal.isCompleted}>
                        Отметить как выполнено
                    </button>
                    <button onClick={handleMarkAsFailed} disabled={localGoal.isFailed}>
                        Отметить как провалено
                    </button>
                    <button onClick={handleResetStatus} disabled={!localGoal.isCompleted && !localGoal.isFailed}>
                        Сбросить статус
                    </button>
                </div>
            )}

            {selectedGoalId === localGoal.id && (
                <>
                    <div className="goalItemDetails">
                        <div className="Actions">
                            <MinusIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGoalId(null);
                                }}
                            />
                            <TrashIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGoal(localGoal.id);
                                }}
                            />
                        </div>

                        <div className="goalItemInfo">
                            <div className="">
                                <h4>Прогресс выполнения шагов {completionPercentage.toFixed(0)}%</h4>
                            </div>
                            <h5>Создан: {new Date(localGoal.startTime).toLocaleDateString()}</h5>

                            <div className="">
                                <h4>Название</h4>
                                <EditableField
                                    value={localGoal.title}
                                    onSave={(value) => updateGoalState({title: value})}
                                />
                            </div>
                            <div className="">
                                <h4>Описание</h4>
                                <EditableField
                                    value={localGoal.description}
                                    onSave={(value) => updateGoalState({description: value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="goalItemSteps">
                        {localGoal.steps && localGoal.steps.length > 0 ? (
                            <StepList
                                goalId={localGoal.id}
                                steps={localGoal.steps}
                                stepHandlers={stepHandlers}
                            />
                        ) : (
                            <p>Шаги отсутствуют</p>
                        )}
                    </div>

                    <div className="add-step-form">
                        {!goalStates.isAddingStep ? (
                            <button className="goalFormButton" onClick={() => goalStates.setIsAddingStep(localGoal.id)}>
                                Добавить шаг
                            </button>
                        ) : (
                            <AddStepForm
                                stepData={{newStep: goalStates.newStep, setNewStep: goalStates.setNewStep}}
                                handleAddStep={() => stepHandlers.handleAddStep(localGoal.id)}
                                handleCancel={() => goalStates.setIsAddingStep(null)}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
