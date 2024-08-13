import {useEffect, useState} from "react";


function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`/api/admin/users`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setUsers(users.filter(user => user.id !== userId));
        } else {
            console.error('Failed to delete user');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.login} - {user.email}
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
