const BASE_URL = "http://localhost:3000/users";

const signupform = document.getElementById("signupform");
const msg = document.getElementById("message");
if (signupform) {
    signupform.addEventListener("submit", signupUser);
}


async function signupUser(e) {
  e.preventDefault();

  const user = {
    username: document.getElementById("userName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await axios.post(`${BASE_URL}/signup`, user);
    console.log(res.data);
    msg.innerHTML = "Signup Successful!";

    msg.style.color = "green";

    signupform.reset();
    // loadUsers();
  } catch (err) {
    console.log(err);
    msg.innerHTML = err.response.data.error || "Signup failed!";

    msg.style.color = "red";
    signupform.reset();
  }
}
