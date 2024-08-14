import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function BudgetList({ userId }) {
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState(null); // Для хранения ошибки

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await fetch(`/api/budgets/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        setError('No budgets found'); // Если нет бюджетов
                    } else {
                        setBudgets(data);
                        setError(null); // Если бюджеты есть, убираем ошибку
                    }
                } else {
                    setError('Failed to fetch budgets');
                    console.error('Failed to fetch budgets');
                }
            } catch (err) {
                setError('An error occurred while fetching budgets');
                console.error('An error occurred:', err);
            }
        };

        fetchBudgets();
    }, [userId]);

    return (
        <div className="budget-list">
            <h3>Your Budgets</h3>
            {error ? (
                <p>{error}</p> // Отображаем сообщение об ошибке
            ) : (
                <ul>
                    {budgets.map(budget => (
                        <li key={budget.id}>
                            Period: {budget.period}, Amount: ${budget.amount}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

BudgetList.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default BudgetList;
