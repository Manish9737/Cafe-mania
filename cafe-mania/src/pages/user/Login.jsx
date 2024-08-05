import React, { useContext, useState } from "react";
import "../../Assets/CSS/login.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import userApis from "../../Apis/userApis";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { validateEmail, validatePassword } from "../../utils/validators";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext)
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Validate the form data
    const emailError = validateEmail(email) ? "" : "Invalid email address";
    const passwordError = validatePassword(password)
      ? ""
      : "Password must be 8+ chars, incl. capital, number, and symbol";

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    const loginData = new FormData();
    loginData.append("email", email);
    loginData.append("password", password);

    try {
      setLoading(true);
      const response = await userApis.loginUser({ email, password })
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "You are Loggedin Successfully!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          login(response.data.token)
          navigate("/");
        });
        setFormData({ email: "", password: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to login!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to login!",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="vh-100 login-bg">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-10">
              <div className="card border-0 shadow-lg">
                <div className="row g-0">
                  <div className="col-md-6" id="login-poster-container">
                    <img
                      src={require("../../images/coffee.jpg")}
                      alt="Coffee"
                      className="img-fluid h-100"
                      id="login-poster"
                    />
                    <h4 id="login-poster-heading">Cafe Mania</h4>
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="p-4 p-lg-5 text-black w-100">
                      <h2 className="text-center">LogIn</h2>
                      <p className="text-center mb-4 text-muted">
                        Welcome Back
                      </p>
                      <form onSubmit={handleLogin}>
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
                          {errors.email && (
                            <span className="text-danger">{errors.email}</span>
                          )}
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
                          {errors.password && (
                            <span className="text-danger">
                              {errors.password}
                            </span>
                          )}
                          <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                              "Login"
                            )}
                          </button>
                        </div>
                        <p className="hrline">or</p>
                        <div className="text-center">
                          <div className="mt-3">
                            <Link to={'/forgot-password'} className="text-decoration-none">
                              Forgot password?
                            </Link>
                          </div>
                          <div className="mt-3">
                            <Link to={"/register"} className="text-decoration-none">
                              Don't have an account? Register
                            </Link>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
