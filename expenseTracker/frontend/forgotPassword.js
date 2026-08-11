const form = document.getElementById("forgotPasswordForm");

const message = document.getElementById("message");

const BASE_URL = "http://localhost:3000/users/password";

form.addEventListener("submit", sendResetEmail);

async function sendResetEmail(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const res = await axios.post(`${BASE_URL}/forgotpassword`, { email });
    console.log(res.data);
    message.innerHTML = res.data.message;
    message.style.color = "green";
    form.reset();
  } catch (err) {
    console.log(err);
    message.innerHTML =
      err.response.data.error || "Failed to send password reset email!";
    message.style.color = "red";
  }
}
