// src/components/Header.jsx
export default function Header({ username }) {
    return (
        <header className="header">
            <h2>Добро пожаловать, {username}!</h2>
        </header>
    );
}
