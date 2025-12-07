document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("registerModal");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const laterBtn = document.getElementById("later-btn");
  const openRegister = document.getElementById("open-register");
  const backToLogin = document.getElementById("back-to-login");

  if (!modal) return;

  if (!sessionStorage.getItem("modalShown")) {
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
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    modal.style.display = "none";
    sessionStorage.setItem("modalShown", "true");
    alert("Приємного перегляду!");
  });

  /* Реєстрація */
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = signupForm.querySelectorAll("input");
    const pass1 = inputs[1].value;
    const pass2 = inputs[2].value;

    if (pass1 !== pass2) {
      alert("Паролі не співпадають!");
      return;
    }

    if (pass1.length < 8) {
      alert("Пароль має містити щонайменше 8 символів!");
      return;
    }

    modal.style.display = "none";
    sessionStorage.setItem("modalShown", "true");
    alert("Дякуємо за реєстрацію!");
  });
});
