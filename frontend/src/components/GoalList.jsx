import GoalItem from "./GoalItem";

export default function GoalList({ goals, selectedGoalId, setSelectedGoalId, goalHandlers, goalStates, stepHandlers }) {
    return (
        <div className="goal-list">
            {goals.map(goal => (
                <GoalItem
                    key={goal.id}
                    goal={goal}
                    selectedGoalId={selectedGoalId}
                    setSelectedGoalId={setSelectedGoalId}
                    goalHandlers={goalHandlers}
                    goalStates={goalStates}
                    stepHandlers={stepHandlers}
                />
            ))}
        </div>
    );
}
