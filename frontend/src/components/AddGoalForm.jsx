// src/components/AddGoalForm.jsx
export default function AddGoalForm({ goalData, handleAddGoal }) {
    const { newGoal, setNewGoal } = goalData;

    return (
        <div className="add-goal-form">
            <input
                type="text"
                placeholder="Название цели"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Описание цели"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <button className="button" onClick={handleAddGoal}>Сохранить цель</button>
        </div>
    );
}