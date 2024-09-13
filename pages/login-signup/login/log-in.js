const logInForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');

logInForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    const storedUser = localStorage.getItem(email);

    if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.password === password) {

            // Запазване на емейла на логнатия юзър в localStorage
            localStorage.setItem('loggedInUser', email);

            // Препраща към login
            window.location.href = "../../booksCatalogue/booksCatalogue.html";
        } else {
            alert("Incorrect password!");
            return;
        }
    } else {
        alert("User with this Email doesn't exist!");
        return;
    }
});
