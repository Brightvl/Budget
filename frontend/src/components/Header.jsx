// src/components/Header.jsx
export default function Header({ username }) {
    return (
        <header className="header">
            <h1>Добро пожаловать, {username}!</h1>
        </header>
    );
}
