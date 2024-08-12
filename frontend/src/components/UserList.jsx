import axios from 'axios';
import {useEffect, useState} from "react";

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Загрузка списка пользователей с backend
        axios.get('/api/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.login} - {user.email} - {user.password}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
