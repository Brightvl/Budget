import LogoutIcon from '../assets/svg/LogoutIcon.svg';

export default function LogoutButton({ handleLogout, showLogoutWarning, setShowLogoutWarning }) {
    return (
        <div className="logout-container">
            <img
                src={LogoutIcon}
                alt="Logout"
                onClick={handleLogout}
                onMouseEnter={() => setShowLogoutWarning(true)}
                onMouseLeave={() => setShowLogoutWarning(false)}
                className="logout-icon"
                style={{ cursor: 'pointer' }}
            />
            {showLogoutWarning && (
                <div className="logout-warning warning-text warning-text__bg">
                    Вы уверены, что хотите выйти?
                </div>
            )}
        </div>
    );
}
