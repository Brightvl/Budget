import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function BudgetList({ userId }) {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            const response = await fetch(`/api/budgets/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setBudgets(data);
            } else {
                console.error('Failed to fetch budgets');
            }
        };

        fetchBudgets();
    }, [userId]);

    return (
        <div className="budget-list">
            <h3>Your Budgets</h3>
            <ul>
                {budgets.map(budget => (
                    <li key={budget.id}>
                        {budget.name}: ${budget.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Добавляем валидацию пропсов
BudgetList.propTypes = {
    userId: PropTypes.number.isRequired, // Указываем, что userId должен быть числом и обязательным
};

export default BudgetList;
