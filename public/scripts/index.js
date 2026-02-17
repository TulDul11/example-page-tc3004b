const params = new URLSearchParams(window.location.search);
const logInContainer = document.getElementById("log-in-container");
const registerContainer = document.getElementById("register-container");

// Asegurando que al refrescar la pagina, se quede en registrar si se estaba registrando previamente.
const mode = params.get("mode");

if (mode === "register") {
    logInContainer.style.display = 'none';
    registerContainer.style.display = 'block';
}

// Funcionalidad de boton para cambiar entre login y registro.
document.getElementById("to-register-button").addEventListener("click", () => {
    logInContainer.style.display = 'none';
    registerContainer.style.display = 'block';

    history.pushState(null, "", "?mode=register");
});
document.getElementById("to-login-button").addEventListener("click", () => {
    logInContainer.style.display = 'block';
    registerContainer.style.display = 'none';

    history.pushState(null, "", "?mode=login");
});

// Funcionalidad de botones para cambiar visibilidad de campos de contraseña.
function changePasswordVisibility(passwordInput) {
    if (passwordInput.type == 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

document.getElementById("eye-icon-1").addEventListener("click",() => {changePasswordVisibility(document.getElementById("log-in-password"))});
document.getElementById("eye-icon-2").addEventListener("click",() => {changePasswordVisibility(document.getElementById("register-password"))});
document.getElementById("eye-icon-3").addEventListener("click",() => {changePasswordVisibility(document.getElementById("register-confirm-password"))});

// Funcionalidad de login
const loginForm = document.getElementById("log-in-form");
const loginError = document.getElementById("log-in-error")

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    loginError.textContent = "";
    loginError.style.visibility = "hidden";

    if (username.trim() === "" || password.trim() === "") {
        loginError.textContent = "Usuario o contraseña faltantes";
        loginError.style.visibility = "visible";
    } else {
        loginError.textContent = "";
        loginError.style.visibility = "hidden";

        sessionStorage.setItem("username", username);

        window.location.href = "/home";
    }    
});

// Funcionalidad de registro
const registerForm = document.getElementById("register-form");
const registerError = document.getElementById("register-error")

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = registerForm.username.value;
    const password = registerForm.password.value;
    const passwordConfirm = registerForm.passwordconfirm.value;

    registerError.textContent = "";
    registerError.style.visibility = "hidden";

    if (username.trim() === "" || password.trim() === "" || passwordConfirm.trim() === "") {
        registerError.textContent = "Usuario o contraseña faltantes";
        registerError.style.visibility = "visible";
    } else if (password.trim() != passwordConfirm.trim()) {
        registerError.textContent = "Contraseñas no coinciden";
        registerError.style.visibility = "visible";
    } else {
        registerError.textContent = "";
        registerError.style.visibility = "hidden";

        sessionStorage.setItem("username", username);

        window.location.href = "/home";
    }    
});