import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import userApis from "../../Apis/userApis";
import "../../Assets/CSS/reset-password.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword } from "../../utils/validators";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No email found in local storage. Please try again.",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        navigate("/forgot-password");
      });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!password) {
      setPasswordError("Please enter a new password");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8+ chars, incl. capital, number, and symbol"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your new password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!isValid) {
      return;
    }

    const resetData = { email, password };

    try {
      setLoading(true);
      const response = await userApis.resetPassword(resetData);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful!",
          text: "You can now log in with your new password.",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          localStorage.removeItem("email");
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            response.data.message || "Password reset failed. Please try again later.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password reset failed. Please try again later.",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 reset-password-bg" id="resetPassword">
      <div className="container h-100 d-flex justify-content-center align-items-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card border-0 shadow-lg p-4">
            <div className="text-black w-100">
              <h2 className="text-center">Reset Password</h2>
              <form onSubmit={handleResetPassword}>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    className={`form-control ${
                      passwordError ? "is-invalid" : ""
                    }`}
                    placeholder=" "
                  />
                  <label className="form-label" htmlFor="password">
                    New Password
                  </label>
                  <span
                    className="password-toggle-icon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {passwordError && (
                    <span className="text-danger">{passwordError}</span>
                  )}
                </div>
                <div className="input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className={`form-control ${
                      confirmPasswordError ? "is-invalid" : ""
                    }`}
                    placeholder=" "
                  />
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <span
                    className="password-toggle-icon"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {confirmPasswordError && (
                    <span className="text-danger">
                      {confirmPasswordError}
                    </span>
                  )}
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-brown rounded-pill shadow"
                    disabled={loading}
                  >
                    {loading ? (
                      <BeatLoader
                        color="#FFFFFF"
                        loading={loading}
                        size={8}
                      />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
