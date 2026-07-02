console.log("JS Loaded");

const form = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentsList");

const BASE_URL = "http://localhost:3000/appointment";

// window.addEventListener("DOMContentLoaded", loadAppointments);
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");
    loadAppointments();
});

form.addEventListener("submit", addAppointment);



async function loadAppointments(){
    try{
      const res = await axios.get(BASE_URL);
      console.log(res.data);
      appointmentList.innerHTML = "";
      res.data.forEach(displayAppointment);
    }catch(err){
        console.log(err);
    }
}


async function addAppointment(e){
    e.preventDefault();
    const appointment = {
        name : document.getElementById("name").value,
        phone : document.getElementById("phone").value
    };

    try{
        const res = await axios.post(BASE_URL, appointment);
        console.log(res.data);
        displayAppointment(res.data);
        form.reset();

    }catch(err){
        console.log(err);

    }
}


async function displayAppointment(appointment){
    const li = document.createElement("li");
    li.innerHTML = `<strong>${appointment.name}</strong>
    <br>
    ${appointment.phone} <br><br> 
    <button class="actionBtn" onclick="deleteAppointment(${appointment.id})">Delete</button>
`;
appointmentList.appendChild(li);
}



async function deleteAppointment(id){
    try{
    await axios.delete(`${BASE_URL}/${id}`);
    loadAppointments();
    }catch(err){
        console.log(err);

    }
}