// src/components/GoalList.jsx
import GoalItem from "./GoalItem";

export default function GoalList(props) {
    const {
        goals,
        selectedGoalId,
        setSelectedGoalId,
        handleUpdateGoal,
        handleDeleteGoal,
        handleAddStep,
        handleDeleteStep,
        editingGoal,
        setEditingGoal,
        isAddingStep,
        setIsAddingStep,
        newStep,
        setNewStep,
    } = props;

    return (
        <div className="goal-list">
            {goals.map(goal => (
                <GoalItem
                    key={goal.id}
                    goal={goal}
                    selectedGoalId={selectedGoalId}
                    setSelectedGoalId={setSelectedGoalId}
                    handleUpdateGoal={handleUpdateGoal}
                    handleDeleteGoal={handleDeleteGoal}
                    handleAddStep={handleAddStep}
                    handleDeleteStep={handleDeleteStep}
                    editingGoal={editingGoal}
                    setEditingGoal={setEditingGoal}
                    isAddingStep={isAddingStep}
                    setIsAddingStep={setIsAddingStep}
                    newStep={newStep}
                    setNewStep={setNewStep}
                />
            ))}
        </div>
    );
}
