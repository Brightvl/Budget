import React, { useState, useEffect } from "react";

export function UserDashboard() {
    const [userName, setUserName] = useState('');
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // Предполагаем, что у тебя есть userId после аутентификации
    const userId = 1;

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch(`/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserName(data.login);
                // Предположим, что баланс передается в поле "balance"
                setBalance(data.balance);
            } else {
                console.error('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSaveTransaction = async () => {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                category,
                description,
                userId,
            }),
        });

        if (response.ok) {
            console.log('Transaction saved successfully');
            setAmount('');
            setCategory('');
            setDescription('');

            // После сохранения транзакции обновляем баланс пользователя
            const updatedBalance = balance - parseFloat(amount);
            setBalance(updatedBalance);
        } else {
            console.error('Failed to save transaction');
        }
    };

    return (
        <div className="dashboard-container">
            <h2>User Dashboard</h2>
            <div className="user-info">
                <h3>Welcome, {userName}!</h3>
                <p>Current Balance: ${balance.toFixed(2)}</p>
            </div>
            <div className="transaction-form">
                <h3>Record a Transaction</h3>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select Category</option>
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="entertainment">Entertainment</option>
                    {/* Можно добавить больше категорий */}
                </select>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleSaveTransaction}>Save Transaction</button>
            </div>
        </div>
    );
}
