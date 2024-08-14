import {handleLogout} from '../../utils/authUtils';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from 'axios';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/users');
                setUsers(response.data);
                setFilteredUsers(response.data); // Устанавливаем фильтрованные пользователи такими же, как и все
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/admin/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setFilteredUsers(filteredUsers.filter(user => user.id !== userId)); // Обновляем и фильтрованные данные
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const handleSearch = async () => {
        const query = searchQuery.trim();

        if (!query) {
            setFilteredUsers(users);
            return;
        }

        const searchById = !isNaN(query); // Проверяем, является ли запрос числом (поиск по ID)
        let filtered = [];

        if (searchById) {
            try {
                console.log(`Searching for user by ID: ${query}`); // Логирование
                const response = await axios.get(`/api/admin/users/${query}`);
                console.log('User found:', response.data); // Логирование
                filtered = [response.data]; // Поскольку поиск по ID, результатом будет один пользователь
            } catch (error) {
                console.error('User not found', error);
                filtered = []; // Очищаем результаты, если пользователь не найден
            }
        } else {
            filtered = users.filter(user =>
                user.login.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };

    return (
        <div className="container">
            <div className="">
                <h2>Admin Dashboard </h2>
                <button className={"button"} onClick={() => handleLogout(navigate)}>Logout</button>
            </div>

            <div className="search-block">
                <p>Поиск по id пользователя</p>
                <div className={`search-panel`}>
                    <input
                        className={"search-panel__input"}
                        type="text"
                        placeholder="Search by login or ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className={`search-panel__button`} onClick={handleSearch}>Search</button>
                </div>
            </div>


            <ul>
                {filteredUsers.map(user => (
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
