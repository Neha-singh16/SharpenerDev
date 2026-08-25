// const { forgotPasswordService , updatePasswordService } = require("../services/passwordService");
// const ForgotPassword = require("../models/forgotPasswordModel");
// async function forgotPassword(req,res){
//     try{
//          const { email } = req.body;
//         const result = await forgotPasswordService(email);

//        res.status(200).json(result);

//     }catch(err){
//        res.status(500).json({
//     message: err.message
//     });
//     }
// }

// async function resetPassword(req, res) {
//   try {
//     const token = req.params.token;
//     // const { email } = req.body;
//     const forgotPasswordEntry = await ForgotPassword.findOne({
//       where: { id: token, active: true },
//     });
//     if (!forgotPasswordEntry) {
//       return res.status(400).send("Invalid Link");
//     }
//     //    const result = await forgotPasswordService(email);
//     //    res.status(200).json(result);
//     res.send(`

//     <html>

//     <body>

//         <form action="/users/password/updatepassword/${token}" method="POST">

//             <input
//                 type="password"
//                 name="password"
//                 placeholder="Enter New Password"
//             />

//             <button>

//                 Reset Password

//             </button>

//         </form>

//     </body>

//     </html>

//     `);
//   } catch (err) {
//     res.status(404).json({
//       message: err.message,
//     });
//   }
// }

// async function updatePassword(req, res) {
//   const token = req.params.token;
//   const { password } = req.body;
//   await updatePasswordService(token, password);
//   res.send("Password Updated Successfully");
// }

// module.exports = {
//     forgotPassword,
//   resetPassword,
//   updatePassword,
// };


const {
  forgotPasswordService,
  updatePasswordService,
} = require("../services/passwordService");

const ForgotPassword = require("../models/forgotPasswordModel");


async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}


async function resetPassword(req, res) {
  try {
    const token = req.params.token;

    // Check if this token exists and is still active
    const forgotPasswordEntry = await ForgotPassword.findOne({
      token: token,
      active: true,
    });

    // Invalid token
    if (!forgotPasswordEntry) {
      return res.status(400).send("Invalid or expired link");
    }

    // Show password reset form
    res.send(`
      <html>
        <body>

          <h2>Reset Password</h2>

          <form
            action="/users/password/updatepassword/${token}"
            method="POST"
          >

            <input
              type="password"
              name="password"
              placeholder="Enter New Password"
              required
            />

            <button type="submit">
              Reset Password
            </button>

          </form>

        </body>
      </html>
    `);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}


async function updatePassword(req, res) {
  try {
    const token = req.params.token;

    const { password } = req.body;

    const result = await updatePasswordService(
      token,
      password
    );

    res.status(200).send(
      result.message
    );

  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}


module.exports = {
  forgotPassword,
  resetPassword,
  updatePassword,
};