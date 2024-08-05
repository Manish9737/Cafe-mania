const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/generateOtp");
const sendEmail = require("../utils/email");
require("dotenv").config();
const fs = require('fs');
const path = require('path')

const JWT_SECRET = process.env.SECRET_KEY;

exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }


    const lastUser = await User.findOne().sort({ id: -1 });
    const lastId = lastUser ? lastUser.id + 1 : 1;

    const newUser = new User({ id: lastId, name, email, phone, password });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, 
      // {expiresIn: "1h",}
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // maxAge: 3600000,
    });

    res.status(200).json({ success: true, message: "User registered." });
    console.log("User registered");

    const subject = "Congratulations! You have successfully registered.";
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4CAF50;
              color: #fff;
              padding: 10px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
            }
            .content {
              padding: 20px;
            }
            .content p {
              margin-bottom: 20px;
            }
            .greeting {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Our Community!</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${newUser.name}!</p>
              <p>We are thrilled to welcome you to our community! You have successfully registered with us.</p>
              <p>We hope you enjoy your time with us and take advantage of all the amazing features and opportunities we have to offer.</p>
              <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
              <p>Best regards,</p>
              <p><b>Cafe-Mania</b></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(newUser.email, subject, html)

  } catch (error) {
    // console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Internal server error.", error });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({ success: true, Users: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid credentials.", success: false });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // maxAge: 3600000,
    });

    res.status(200).json({ success: true, message: "Login successful", token });
    console.log("User logged in");
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
    console.log(error);
  }
};

exports.profileData = async(req, res) => {
  const id = req.user.id;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: true, message: "User not found"});

    res.status(200).json({ success: true, user });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error !"});
  }
}

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(422)
        .json({ success: false, message: "User id is missing." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found." });
    }

    res.status(201).json({ success: true, message: "User found", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email.' });
    }

    const otp = generateOTP();

    user.resetPasswordOtp = otp;
    await user.save();
    const subject = 'Password Reset OTP';
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP</title>
            <style>
                /* General styles */
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-align: center;
                    padding: 10px 0;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .header h2 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .content p {
                    margin-bottom: 10px;
                }
                .content strong {
                    font-weight: bold;
                    color: #4CAF50;
                }
                .footer {
                    text-align: center;
                    color: #888888;
                    padding-top: 20px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Password Reset OTP</h2>
                </div>
                <div class="content">
                    <p>Dear ${user.name || 'User'},</p>
                    <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                    <p>Please use this OTP to proceed with resetting your password.</p>
                </div>
                <div class="footer">
                    <p>This email was sent by Cafe-Mania. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(user.email, subject, htmlContent);


    return res.status(200).json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.VerifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    if (!otp || !email) return res.status(400).json({ success: false, message: 'Please provide OTP and email.' });


    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (otp != user.resetPasswordOtp) return res.status(400).json({ success: false, message: "Invalid otp." });

    res.status(200).json({ success: true, message: "Otp verified successfully !!!" })

    user.resetPasswordOtp = null;
    await user.save();
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal server error." })
  }
}

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ success: false, message: "Invalid credentials." });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found !" });

    if (await bcrypt.compare(password, user.password)) return res.status(400).json({ success: false, message: "New password should be different." });

    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: "Password reseted successfullly." })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error !" })
  }
}

exports.contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email) return res.status(400).json({ success: false, message: "Please fill all fields." })

    const recepient = "manishkumavat73@gmail.com";
    const subject = `Contact from ${name}.`;
    const html = `
    <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f1f1f1;
            color: #333333;
            padding: 10px;
            text-align: center;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Contact Form</h1>
        </div>
        <div class="content">
            <h2>Hello,</h2>
            <p>You have received a new message from the contact form on your website.</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    sendEmail(recepient, subject, html);

    res.status(200).json({ success: true, message: "Contact message sent successfully." })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.addresses) {
    updates.addresses = JSON.parse(updates.addresses);
}

  try {
    if (Object.keys(updates).length === 0) return res.status(400).json({ success: false, message: "Updates not provided." });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (req.file) {
      updates.image = `/images/${req.file ? req.file.filename : null}`;

      if (user.image) {
        const oldImagePath = path.join(__dirname, '..', 'public', user.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(`Failed to delete old image: ${oldImagePath}`, err);
          } else {
            console.log(`Successfully deleted old image: ${oldImagePath}`);
          }
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({ success: true, message: "User updated successfully.", user: updatedUser })
  } catch (error) {
    console.log(error)
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
    return res.json(500).json({ success: false, message: "Internal server error" })
  }
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ success: false, message: "User not found !" });

    res.status(200).json({ success: true, message: "User deleted successfully." })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}