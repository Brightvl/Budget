import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function TransactionList({ userId }) {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null); // Для хранения ошибки

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`/api/transactions/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        setError('No transactions found'); // Если нет транзакций
                    } else {
                        setTransactions(data);
                        setError(null); // Если транзакции есть, убираем ошибку
                    }
                } else {
                    setError('Failed to fetch transactions');
                    console.error('Failed to fetch transactions');
                }
            } catch (err) {
                setError('An error occurred while fetching transactions');
                console.error('An error occurred:', err);
            }
        };

        fetchTransactions();// Обработчик завершения запроса
    }, [userId]);

    return (
        <div className="transaction-list">
            <h3>Your Transactions</h3>
            {error ? (
                <p>{error}</p> // Отображаем сообщение об ошибке
            ) : (
                <ul>
                    {transactions.map(transaction => (
                        <li key={transaction.id}>
                            {transaction.description}: ${transaction.amount}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

TransactionList.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default TransactionList;
