// src/components/AddStepForm.jsx
export default function AddStepForm({ stepData, handleAddStep }) {
    const { newStep, setNewStep } = stepData;

    return (
        <>
            <input
                className={"stepFormInput"}
                type="text"
                placeholder="Название шага"
                value={newStep.title}
                onChange={(e) => setNewStep({ title: e.target.value })}
            />
            <button className="stepFormButton" onClick={handleAddStep}>
                Сохранить шаг
            </button>
        </>
    );
}

{/*<StepList*/}
{/*    goalId={goal.id}*/}
{/*    steps={goal.steps}*/}
{/*    stepHandlers={stepHandlers}*/}
{/*    stepStates={goalStates}*/}
{/*/>*/}