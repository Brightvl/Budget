// src/components/AddStepForm.jsx
export default function AddStepForm({ newStep, setNewStep, handleAddStep }) {
    return (
        <>
            <input
                type="text"
                placeholder="Название шага"
                value={newStep.title}
                onChange={(e) => setNewStep({ title: e.target.value })}
            />
            <button className="button" onClick={handleAddStep}>
                Сохранить шаг
            </button>
        </>
    );
}
