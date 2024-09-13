const signupForm = document.querySelector('.login-signup-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const reEnterPasswordInput = document.getElementById('re-enter-pass');

// Функция за справяне при регистрация
signupForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Спира дефолтното поведение на формата (да се събмитва)

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const reEnterPassword = reEnterPasswordInput.value.trim();

    // Валидира дали паролите са еднакви
    if (password !== reEnterPassword) {
        alert("Both passwords don't match!");
        return;
    }

    // Проверка дали потребителят вече съществува в localStorage
    if (localStorage.getItem(email)) {
        alert("Account with this email already exists.");
        return;
    }

    // Запазване на данните на потребителя в localStorage
    const user = {
        email: email,
        password: password 
    };
    localStorage.setItem(email, JSON.stringify(user));

    alert("Account created successfully!");
    // Препращане към логин след успешна регистрация
    window.location.href = '../login/log-in.html';
});
