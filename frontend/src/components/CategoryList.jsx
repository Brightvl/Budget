
import PropTypes from "prop-types";
import {useEffect, useState} from "react";

function CategoryList({ userId }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch(`/api/categories/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, [userId]);

    return (
        <div className="category-list">
            <h3>Your Categories</h3>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Валидация пропсов
CategoryList.propTypes = {
    userId: PropTypes.number.isRequired, // userId должен быть числом и обязательным
};

export default CategoryList;
