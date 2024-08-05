import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { FaEnvelope } from "react-icons/fa";
import userApis from "../../Apis/userApis";
import OtpModal from "../../components/OtpModal";
import "../../Assets/CSS/forgot-password.css";
import { validateEmail } from "../../utils/validators";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter your email address!",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        } else {
            setEmailError("");
        }

        const resetData = { email };

        try {
            setLoading(true);
            const response = await userApis.forgotPassword(resetData);

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Verification Successful!",
                    text: "Please check your email for instructions.",
                    showConfirmButton: false,
                    timer: 3000,
                });
                setShowOtpModal(true);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Verification failed. Please try again later.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Verification failed. Please try again later.",
                showConfirmButton: false,
                timer: 1500,
            });
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowOtpModal(false);
    };

    const handleVerifyOTP = async (otp) => {
        try {
            const otpVerificationData = { email, otp };

            setLoading(true);
            const response = await userApis.verifyOtp(otpVerificationData);

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Verified!",
                    text: "You can now reset your password.",
                    showConfirmButton: false,
                    timer: 3000,
                }).then(() => {
                    localStorage.setItem('email', email);
                    navigate("/reset-password");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "OTP verification failed. Please try again.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "OTP verification failed. Please try again.",
                showConfirmButton: false,
                timer: 1500,
            });
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
            setShowOtpModal(false);
        }
    };

    return (
        <div className="vh-100 forgot-password-bg" id="userForgotPassword">
            <div className="container h-100 d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <div className="card border-0 shadow-lg p-4">
                        <div className="text-black w-100">
                            <h2 className="text-center">Forgot Password</h2>
                            <p className="text-center mb-4 text-muted">
                                Enter your email to reset your password.
                            </p>
                            <form onSubmit={handleForgotPassword}>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={handleInputChange}
                                        className={`form-control ${emailError ? "is-invalid" : ""}`}
                                        placeholder=" "
                                    />
                                    <label className="form-label" htmlFor="email">
                                        Email address
                                    </label>
                                    <span className="input-icon">
                                        <FaEnvelope />
                                    </span>
                                    {emailError && (
                                        <div className="invalid-feedback">{emailError}</div>
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
                                <p className="hrline">or</p>
                                <div className="text-center">
                                    <div className="mt-3">
                                        <Link
                                            to={"/login"}
                                            className="text-decoration-none"
                                        >
                                            Remember your password? Log in
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showOtpModal && (
                <OtpModal
                    show={showOtpModal}
                    handleClose={handleCloseModal}
                    handleVerify={handleVerifyOTP}
                />
            )}
        </div>
    );
};

export default ForgotPassword;
