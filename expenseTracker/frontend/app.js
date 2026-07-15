const form = document.getElementById("signUpForm");

const msg = document.getElementById("message");

const BASE_URL = "http://localhost:3000/user";

form.addEventListener("submit", signupUser);

async function signupUser(e) {
  e.preventDefault();

  const user = {
    name: document.getElementById("userName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await axios.post(BASE_URL, user);
    console.log(res.data);
    msg.innerHTML = "Signup Successful!";

    message.style.color = "green";

    form.reset();
  } catch (err) {
    console.log(err);
    message.innerHTML = "Signup Failed";

    message.style.color = "red";
  }
}
