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
