import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function CategoryList({ userId }) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null); // Для хранения ошибки

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`/api/categories/user/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length === 0) {
                        setError('No categories found'); // Если нет категорий
                    } else {
                        setCategories(data);
                        setError(null); // Если категории есть, убираем ошибку
                    }
                } else {
                    setError('Failed to fetch categories');
                    console.error('Failed to fetch categories');
                }
            } catch (err) {
                setError('An error occurred while fetching categories');
                console.error('An error occurred:', err);
            }
        };

        fetchCategories();
    }, [userId]);

    return (
        <div className="category-list">
            <h3>Your Categories</h3>
            {error ? (
                <p>{error}</p> // Отображаем сообщение об ошибке
            ) : (
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

CategoryList.propTypes = {
    userId: PropTypes.number.isRequired,
};

export default CategoryList;
