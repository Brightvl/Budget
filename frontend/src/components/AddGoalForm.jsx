export default function AddGoalForm({ goalData, handleAddGoal, handleCancel }) {
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
            <button className="button" onClick={handleCancel}>
                Отменить
            </button>
        </div>
    );
}
