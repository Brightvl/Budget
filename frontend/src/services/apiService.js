export const fetchData = async (url, user, setData, setLoading) => {
    try {
        const response = await fetch(`${url}${user.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            setData(data);
            console.log(data)
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
};

export const postData = async (url, user, body, callback) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            const data = await response.json();
            callback(data);
        }
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

export const putData = async (url, user, body, callback) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            const data = await response.json();
            callback(data);
        } else {
            console.error('Failed to update data:', response.status);
        }
    } catch (error) {
        console.error('Error updating data:', error);
    }
};

export const deleteData = async (url, user, callback) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            callback();
        }
    } catch (error) {
        console.error('Error deleting data:', error);
    }
};
export const updateUser = async (userId, user, token) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return response.json(); // Возвращаем обновленные данные пользователя
};
export const deleteUser = async (userId, token) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};
export async function fetchUserData(token) {
    const response = await fetch('/api/users/current', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch user data');
    }
}

export const validateToken = async (token) => {
    try {
        const response = await fetch('/api/token/validate', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};
export const fetchUserByLogin = async (login, token) => {
    const response = await fetch(`/api/admin/users/login/${login}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user by login');
    }

    return response.json();
};
export const resetPassword = async (userId, newPassword, token) => {
    const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
    });

    if (!response.ok) {
        throw new Error('Failed to reset password');
    }
};
