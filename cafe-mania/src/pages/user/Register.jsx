import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import userApis from "../../Apis/userApis";
import "../../Assets/CSS/register.css";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { name, email, phone, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match!",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        const registerData = {
            name,
            email,
            phone,
            password,
        };

        try {
            setLoading(true);
            const response = await userApis.registerUser(registerData);

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "You have registered successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    navigate("/login");
                });
                setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to register!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to register!",
                showConfirmButton: false,
                timer: 1500,
            });
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vh-100 register-bg" id="userRegister">
            <div className="container h-100 d-flex justify-content-center align-items-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <div className="card border-0 shadow-lg p-4">
                        <div className="text-black w-100">
                            <h2 className="text-center">Register</h2>
                            <p className="text-center mb-4 text-muted">Join us today</p>
                            <form onSubmit={handleRegister}>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <label className="form-label" htmlFor="name">
                                        Name
                                    </label>
                                </div>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <label className="form-label" htmlFor="email">
                                        Email address
                                    </label>
                                </div>
                                <div className="input-container">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <label className="form-label" htmlFor="phone">
                                        Phone Number
                                    </label>
                                </div>
                                <div className="input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <label className="form-label" htmlFor="password">
                                        Password
                                    </label>
                                    <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <div className="input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <label className="form-label" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-brown rounded-pill shadow"
                                    >
                                        {loading ? (
                                            <BeatLoader
                                                color="#FFFFFF"
                                                loading={loading}
                                                size={8}
                                            />
                                        ) : (
                                            "Register"
                                        )}
                                    </button>
                                </div>
                                <p className="hrline">or</p>
                                <div className="text-center">
                                    <div className="mt-3">
                                        <Link to={"/login"} className="text-decoration-none">
                                            Already have an account? Login
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
