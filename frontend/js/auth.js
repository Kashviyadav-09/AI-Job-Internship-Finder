
const API_URL = "https://ai-job-internship-finder-1.onrender.com/api/auth";
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("registerMessage");
        const button = registerForm.querySelector("button[type='submit']");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        message.textContent = "Creating your account...";
        button.disabled = true;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed. Please check your details.");
            }

            message.textContent = "Registration successful! Redirecting to login...";
            message.style.color = "green";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

        } catch (error) {
            message.textContent =
                error.message.includes("Failed to fetch")
                    ? "Cannot connect to the backend. Make sure Spring Boot is running."
                    : error.message;

            message.style.color = "red";
        } finally {
            button.disabled = false;
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("loginMessage");
        const button = loginForm.querySelector("button[type='submit']");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        message.textContent = "Logging in...";
        button.disabled = true;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Invalid email or password.");
            }

            message.textContent = "Login successful! Welcome, " + data.name + ".";
            message.style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);

        } catch (error) {
            message.textContent =
                error.message.includes("Failed to fetch")
                    ? "Cannot connect to the backend. Check that Spring Boot is running and CORS is configured."
                    : error.message;

            message.style.color = "red";
        } finally {
            button.disabled = false;
        }
    });
}

