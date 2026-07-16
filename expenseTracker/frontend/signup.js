const signupform = document.getElementById("signUpForm");
// const loginForm =  document.getElementById("loginForm");
const list = document.getElementById('usersList');

const msg = document.getElementById("message");

const BASE_URL = "http://localhost:3000/users";

if (signupform) {
    signupform.addEventListener("submit", signupUser);
}

// if (loginForm) {
//     loginForm.addEventListener("submit", loginUser);
// }
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

    signupform.reset();
    // loadUsers();
  } catch (err) {
    console.log(err);
    msg.innerHTML = err.response.data.error || "Signup failed!";

    msg.style.color = "red";
    signupform.reset();
  }
}


// async function loginUser(e) {
//   e.preventDefault();

//   const user = {
//     email: document.getElementById("email").value,
//     password: document.getElementById("password").value,
//   };

//   try {
//     const res = await axios.post(`${BASE_URL}/login`, user);
//     console.log(res.data);
//     msg.innerHTML = "Login Successful!";

//     msg.style.color = "green";

//     loginForm.reset();
//     // loadUsers();
//   } catch (err) {
//     console.log(err);
//     msg.innerHTML = err.response.data.error || "Login failed!";

//     msg.style.color = "red";
//     loginForm.reset();
//   }
// }

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