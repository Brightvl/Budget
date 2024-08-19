// src/components/GoalList.jsx
import GoalItem from "./GoalItem";

export default function GoalList(props) {
    const {
        goals,
        selectedGoalId,
        setSelectedGoalId,
        handlers,
        formStates
    } = props;

    return (
        <div className="goal-list">
            {goals.map(goal => (
                <GoalItem
                    key={goal.id}
                    goal={goal}
                    selectedGoalId={selectedGoalId}
                    setSelectedGoalId={setSelectedGoalId}
                    handlers={handlers}
                    formStates={formStates}
                />
            ))}
        </div>
    );
}