import GoalItem from "./GoalItem.jsx";

export default function GoalList({ goals, selectedGoalId, setSelectedGoalId, goalHandlers, goalStates, stepHandlers }) {
    return (
        <div className="goalList">
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
