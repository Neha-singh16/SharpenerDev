const BASE_URL = "http://localhost:3000/users";
const premiumBtn = document.getElementById("buyPremiumBtn");
// const logoutBtn = document.getElementById("logoutBtn");

// const submitBtn = document.getElementById("submitBtn");
premiumBtn.addEventListener("click", buyPremium);


const cashfree = Cashfree({
  mode: "sandbox",
});


// const token = localStorage.getItem("token");

// if (!token) {
//   window.location.href = "login.html";
// }

async function buyPremium() {
  try {
   
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/purchase/buy-premium`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    
    // console.log(res.data);

    openCashfree(res.data.paymentSessionId, res.data.orderId);
  } catch (err) {
    console.log(err);
  }
}

async function openCashfree(paymentSessionId, orderId) {
  try {
    const result = await cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_modal",
    });

    // console.log(result);
    console.log("Checkout Result:", result);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/purchase/update-transaction-status`,

      {
        orderId,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    
    console.log(res.data);

    // alert("Payment Verified!");
    alert("You are now a Premium User!");

    location.reload();
  } catch (err) {
    console.log(err);
  }
}