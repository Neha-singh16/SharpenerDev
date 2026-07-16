const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("message");

const BASE_URL = "http://localhost:3000/users";

loginForm.addEventListener("submit", loginUser);

async function loginUser(e) {
  e.preventDefault();

  const user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await axios.post(`${BASE_URL}/login`, user);
    console.log(res.data);
    localStorage.setItem("token", res.data.token);

    window.location.href = "expense.html";
    msg.innerHTML = "Login Successful!";

    msg.style.color = "green";

    loginForm.reset();
    // loadUsers();
  } catch (err) {
    console.log(err);
    msg.innerHTML = err.response.data.error || "Login failed!";

    msg.style.color = "red";
    loginForm.reset();
  }
}
