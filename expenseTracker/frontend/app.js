const form = document.getElementById("signUpForm");
const list = document.getElementById('usersList');

const msg = document.getElementById("message");

const BASE_URL = "http://localhost:3000/users";

form.addEventListener("submit", signupUser);
// window.addEventListener("DOMContentLoaded", loadUsers);

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

    msg.style.color = "green";

    form.reset();
    // loadUsers();
  } catch (err) {
    console.log(err);
    msg.innerHTML = err.response.data.error || "Signup failed!";

    msg.style.color = "red";
    form.reset();
  }
}

// async function loadUsers() {
//   try {
//     const res = await axios.get(BASE_URL);
//     const users = res.data.users;

//     list.innerHTML = "";

//     users.forEach(user => {
//       const li = document.createElement("li");
//       li.textContent = `${user.name} - ${user.email}`;
//       list.appendChild(li);
//     });
//   } catch (err) {
//     console.log(err);
//     msg.innerHTML = "Failed to load users";
//     msg.style.color = "red";
//   }
// }