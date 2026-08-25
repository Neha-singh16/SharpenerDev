// // const axios = require("axios");
// const Order = require("../models/orderModel");

// const { Cashfree, CFEnvironment } = require("cashfree-pg");

// const cashfree = new Cashfree(
//   CFEnvironment.SANDBOX,
//   process.env.CASHFREE_CLIENT_ID,
//   process.env.CASHFREE_CLIENT_SECRET,
// );

// console.log("CLIENT_ID:", process.env.CASHFREE_CLIENT_ID);
// console.log("CLIENT_SECRET:", process.env.CASHFREE_CLIENT_SECRET);
// // console.log("Cashfree: ", cashfree);
// // console.log(Object.keys(cashfree));

// const buyPremium = async (user) => {
//   try {
//     if (user.isPremium) {
//       throw new Error("User is already a Premium Member");
//     }
//     const orderId = "ORDER_" + Date.now();
//     const order = await Order.create({
//       orderId: orderId,
//       amount: 499,
//       status: "PENDING",
//       // UserId: user.id,
//       userId: user._id,
//     });

//     const request = {
//       order_amount: 499,
//       order_currency: "INR",
//       order_id: orderId,
//       customer_details: {
//         customer_id: user.id.toString(),
//         customer_phone: "9999999999",
//         customer_email: user.email,
//       },
//     };

//     const response = await cashfree.PGCreateOrder(request);

//     return {
//       paymentSessionId: response.data.payment_session_id,
//       orderId: response.data.order_id,
//     };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Error creating order with Cashfree");
//   }
// };

// const verifyPayment = async (orderId) => {
//   try {
//     const response = await cashfree.PGOrderFetchPayments(orderId);

//     return response.data;
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     throw new Error("Unable to verify payment");
//   }
// };

// // updateTransactionStatus(orderId)

// const updateTransactionStatus = async (orderId) => {
//   try {
//     const payments = await verifyPayment(orderId);
//     if (!payments || payments.length === 0) {
//       return {
//         message: "Payment not completed yet",
//       };
//     }
//     const payment = payments[0];
//     console.log(payments);
//     const order = await Order.findOne({
//       where: {
//         orderId,
//       },
//     });

//     if (!order) {
//       throw new Error("Order not found");
//     }

//     // order.status = status;
//     // await order.save();

//     if (payment.payment_status === "SUCCESS") {
//       const user = await order.getUser();

//       user.isPremium = true;

//       await user.save();
//       order.status = "SUCCESSFUL";
//       await order.save();
//     } else if (payment.payment_status === "FAILED") {
//       order.status = "FAILED";
//       await order.save();
//     } else {
//       order.status = "PENDING";
//       await order.save();
//     }

//     return {
//       message: "Transaction Updated Successfully",
//       paymentStatus: payment.payment_status,
//       order,
//     };
//   } catch (err) {
//     // console.log(err);
//     console.log(err.response?.data || err.message);
//     throw new Error("Error updating transaction status");
//   }
// };

// module.exports = { buyPremium, updateTransactionStatus};

const Order = require("../models/orderModel");
const User = require("../models/userModel");

const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET,
);

// ==========================================
// BUY PREMIUM
// ==========================================

const buyPremium = async (user) => {
  try {
    // Check whether user is already premium
    if (user.isPremium) {
      throw new Error("User is already a Premium Member");
    }

    // Create a unique order ID
    const orderId = "ORDER_" + Date.now();

    // Save order in MongoDB
    await Order.create({
      orderId: orderId,
      amount: 499,
      status: "PENDING",
      userId: user._id,
    });

    // Request object required by Cashfree
    const request = {
      order_amount: 499,
      order_currency: "INR",
      order_id: orderId,

      customer_details: {
        customer_id: user._id.toString(),
        customer_phone: "9999999999",
        customer_email: user.email,
      },
    };

    // Create order on Cashfree
    const response = await cashfree.PGCreateOrder(request);

    // Send required details to frontend
    return {
      paymentSessionId: response.data.payment_session_id,
      orderId: response.data.order_id,
    };
  } catch (err) {
    console.error(
      "Error creating premium order:",
      err.response?.data || err.message,
    );

    throw err;
  }
};

// ==========================================
// VERIFY PAYMENT WITH CASHFREE
// ==========================================

const verifyPayment = async (orderId) => {
  try {
    // Ask Cashfree for payment details
    const response = await cashfree.PGOrderFetchPayments(orderId);

    return response.data;
  } catch (err) {
    console.error(
      "Payment verification failed:",
      err.response?.data || err.message,
    );

    throw new Error("Unable to verify payment");
  }
};

// ==========================================
// UPDATE TRANSACTION STATUS
// ==========================================

const updateTransactionStatus = async (orderId) => {
  try {
    // Step 1: Verify payment with Cashfree
    const payments = await verifyPayment(orderId);

    // No payment found yet
    if (!payments || payments.length === 0) {
      return {
        message: "Payment not completed yet",
      };
    }

    console.log("Cashfree payments:", payments);

    // Step 2: Find the order in MongoDB
    // MONGOOSE: No 'where'
    const order = await Order.findOne({
      orderId: orderId,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Find a successful payment if there are multiple attempts
    const successfulPayment = payments.find(
      (payment) => payment.payment_status === "SUCCESS",
    );

    // If payment is successful
    if (successfulPayment) {
      // Step 3: Find the user using MongoDB relationship
      const user = await User.findById(order.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Make user premium
      user.isPremium = true;

      await user.save();

      // Update order status
      order.status = "SUCCESSFUL";

      await order.save();

      return {
        message: "Transaction updated successfully",
        paymentStatus: "SUCCESS",
        order,
      };
    }

    // Check whether any payment has failed
    const failedPayment = payments.find(
      (payment) => payment.payment_status === "FAILED",
    );

    if (failedPayment) {
      order.status = "FAILED";

      await order.save();

      return {
        message: "Transaction updated successfully",
        paymentStatus: "FAILED",
        order,
      };
    }

    // Payment is still pending
    order.status = "PENDING";

    await order.save();

    return {
      message: "Payment is still pending",
      paymentStatus: "PENDING",
      order,
    };
  } catch (err) {
    console.error(
      "Transaction update error:",
      err.response?.data || err.message,
    );

    throw err;
  }
};

module.exports = {
  buyPremium,
  updateTransactionStatus,
};
