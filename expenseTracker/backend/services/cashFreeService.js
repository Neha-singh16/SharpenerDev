const axios = require("axios");
const Order = require("../models/orderModel");

const buyPremium = async (user) => {
  try {
    const orderId = "ORDER_" + Date.now();
    const order = await Order.create({
      orderId: orderId,
      amount: 499,
      status: "Pending",
      UserId: user.id,
    });

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: 499,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id.toString(),
          customer_phone: "9999999999",
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "x-api-version": "2025-01-01",
          "Content-Type": "application/json",
        },
      },
    );

    return {
      order,
      paymentSessionId: response.data.payment_session_id,
      orderId: response.data.order_id,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Error creating order with Cashfree");
  }
};

// updateTransactionStatus(orderId)

const updateTransactionStatus = async (orderId, status) => {
  try {
    const order = await Order.findOne({
      where: {
        orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    if (status === "SUCCESSFUL") {
      const user = await order.getUser();

      user.isPremium = true;

      await user.save();
    }

    return {
      message: "Transaction Updated Successfully",
      order,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Error updating transaction status");
  }
};

// const updateTransactionStatus = async (orderId, status) => {
//   try {
//     const order = await Order.findOne({ where: { orderId: orderId } });
//     if (!order) {
//       throw new Error("Order not found");
//     }

//     const payment =
// await cashfree.PGOrderFetchPayments(orderId);

// if(payment.payment_status==="SUCCESS"){
//    order.status="SUCCESSFUL";

// await order.save();

// }
//     order.status = status;
//     await order.save();

//     if (status === "SUCCESSFUL") {
//       const user = await order.getUser();

//       user.isPremium = true;

//       await user.save();
//     }

//     return order;
//   } catch (err) {
//     console.log(err);
//     throw new Error("Error updating transaction status!!");
//   }
// };

module.exports = { buyPremium, updateTransactionStatus };
