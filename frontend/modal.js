document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.getElementById("registerModal");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const laterBtn = document.getElementById("later-btn");
    const openRegister = document.getElementById("open-register");
    const backToLogin = document.getElementById("back-to-login");

    if (!modal) return;

    // Check if user is already authenticated
    const isAuthenticated = await checkAuthStatus();

    if (!isAuthenticated && !sessionStorage.getItem("modalShown")) {
        modal.style.display = "flex";
    }

    /* "Увійти пізніше" */
    laterBtn.addEventListener("click", () => {
        modal.style.display = "none";
        sessionStorage.setItem("modalShown", "true");
    });

    /* Перехід до реєстрації */
    openRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = "none";
        signupForm.style.display = "block";
    });

    /* Назад до логіну */
    backToLogin.addEventListener("click", () => {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    });

    /* Вхід */
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');

        try {
            const response = await fetch('../backend/auth/login.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });

            const result = await response.json();

            if (result.success) {
                modal.style.display = "none";
                sessionStorage.setItem("modalShown", "true");
                alert(`Вітаємо, ${result.user.name}! Приємного перегляду!`);
                updateUIForLoggedInUser(result.user);
            } else {
                alert(result.error || 'Помилка входу');
            }
        } catch (error) {
            alert('Помилка з\'єднання з сервером: ' + error.message);
            console.error('Login error:', error);
        }
    });

    /* Реєстрація */
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = signupForm.querySelectorAll("input");
        const email = inputs[0].value;
        const password = inputs[1].value;
        const confirmPassword = inputs[2].value;
        const name = email.split('@')[0]; // Use email prefix as default name

        if (password !== confirmPassword) {
            alert("Паролі не співпадають!");
            return;
        }

        if (password.length < 8) {
            alert("Пароль має містити щонайменше 8 символів!");
            return;
        }

        try {
            const response = await fetch('../backend/auth/register.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name
                })
            });

            const result = await response.json();

            if (result.success) {
                modal.style.display = "none";
                sessionStorage.setItem("modalShown", "true");
                alert(`Дякуємо за реєстрацію, ${result.user.name}!`);
                updateUIForLoggedInUser(result.user);
            } else {
                alert(result.error || 'Помилка реєстрації');
            }
        } catch (error) {
            alert('Помилка з\'єднання з сервером');
        }
    });
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('../backend/auth/check.php', {
            credentials: 'include'
        });
        const result = await response.json();

        if (result.authenticated) {
            updateUIForLoggedInUser(result.user);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const headerBtn = document.querySelector('.theater-header__btn');
    if (headerBtn) {
        headerBtn.textContent = `${user.name}`;
        headerBtn.onclick = () => {
            window.location.href = '/frontend/cabinet.html';
        };
    }
}

// Logout function
async function logout() {
    try {
        await fetch('../backend/auth/logout.php', {
            method: 'POST',
            credentials: 'include'
        });
        sessionStorage.clear();
        location.reload();
    } catch (error) {
        console.error('Logout failed:', error);
    }
}