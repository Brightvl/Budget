export const validateEmail = (email) => {
    if (!email) {
        return 'Пожалуйста, введите email.';
    }
    if (!email.includes('@')) {
        return 'Email должен содержать символ @.';
    }
    const domainPart = email.split('@')[1];
    if (!domainPart || !domainPart.includes('.')) {
        return 'Email должен содержать домен (например, example.com).';
    }
    return null;
};

export const validatePassword = (password) => {
    if (password.length < 5) {
        return 'Пароль должен содержать не менее 5 символов.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Пароль должен содержать хотя бы одну заглавную букву.';
    }
    if (!/[0-9]/.test(password)) {
        return 'Пароль должен содержать хотя бы одну цифру.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Пароль должен содержать хотя бы один специальный символ.';
    }
    return null;
};

export const checkLoginExists = async (login, setIsLoginChecking) => {
    try {
        setIsLoginChecking(true);
        const response = await fetch(`/api/users/checkLogin?login=${login}`);
        setIsLoginChecking(false);
        if (response.status === 409) {
            return 'Логин уже занят. Пожалуйста, выберите другой.';
        }
        return null;
    } catch (error) {
        console.error('Ошибка при проверке логина:', error);
        setIsLoginChecking(false);
        return 'Произошла ошибка при проверке логина. Попробуйте позже.';
    }
};

export const checkEmailExists = async (email, setIsEmailChecking) => {
    try {
        setIsEmailChecking(true);
        const response = await fetch(`/api/users/checkEmail?email=${email}`);
        setIsEmailChecking(false);
        if (response.status === 409) {
            return 'Email уже занят. Пожалуйста, выберите другой.';
        }
        return null;
    } catch (error) {
        console.error('Ошибка при проверке email:', error);
        setIsEmailChecking(false);
        return 'Произошла ошибка при проверке email. Попробуйте позже.';
    }
};
