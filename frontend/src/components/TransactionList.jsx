
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function TransactionList({ userId }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch(`/api/transactions/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            } else {
                console.error('Failed to fetch transactions');
            }
        };

        fetchTransactions();
    }, [userId]);

    return (
        <div className="transaction-list">
            <h3>Your Transactions</h3>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        {transaction.description}: ${transaction.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Валидация пропсов
TransactionList.propTypes = {
    userId: PropTypes.number.isRequired, // userId должен быть числом и обязательным
};

export default TransactionList;
