export default function AddGoalForm({ goalData, handleAddGoal, handleCancel }) {
    const { newGoal, setNewGoal } = goalData;

    return (
        <div className="goalFormContainer">
            <input
                className={"goalFormInput"}
                type="text"
                placeholder="Название цели"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <input
                className={"goalFormInput"}
                type="text"
                placeholder="Описание цели"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <div className="goalFormButtonGroup">
                <button className="goalFormButton" onClick={handleAddGoal}>Сохранить цель</button>
                <button className="goalFormButtonDelete" onClick={handleCancel}>
                    Отменить
                </button>
            </div>

        </div>
    );
}
