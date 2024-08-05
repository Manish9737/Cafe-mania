import React, { useContext, useEffect, useState } from 'react';
import '../../Assets/CSS/signIn.css';
import { useNavigate } from 'react-router-dom';
import adminApis from '../../Apis/AdminApis';
import Swal from 'sweetalert2';
import { AdminContext } from '../../context/AdminContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useContext(AdminContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  })

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await adminApis.signIn({ email, password });
      if (response.data.success) {
        // sessionStorage.setItem('adminToken', response.data.token);
        login(response.data.token);
        navigate('/admin');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'Please check your email and password',
        });
      }
    } catch (error) {
      console.error("Error in sign in.", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while signing in',
      });
    }
  };

  return (
    <>
      <section className="text-center text-lg-start">
        <style>
          {`
          .cascading-right {
              margin-right: -50px;
          }

          @media (max-width: 991.98px) {
              .cascading-right {
                  margin-right: 0;
              }
          }

          .image-container {
              height: 100%;
              overflow: hidden;
          }

          .image-container img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
          `}
        </style>

        <div className="container py-4 vh-100" id='adminSignIn'>
          <div className="row g-0 align-items-center justify-content-center h-100">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <div
                className="card shadow-lg cascading-right bg-body-tertiary"
                style={{
                  backdropFilter: 'blur(30px)',
                }}
              >
                <div className="card-body p-5 shadow-5 text-center">
                  <h2 className="fw-bold">Cafe-Mania</h2>
                  <h6 className="text-muted mb-3">Sign in Now</h6>
                  <form onSubmit={handleSubmit}>
                    <div className="input-container mb-4">
                      <input
                        type="email"
                        id="form3Example3"
                        placeholder=""
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        className="form-label"
                        htmlFor="form3Example3"
                      >
                        Email address
                      </label>
                    </div>

                    <div className="input-container mb-4">
                      <input
                        type="password"
                        id="form3Example4"
                        placeholder=""
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        className="form-label"
                        htmlFor="form3Example4"
                      >
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-brown mb-4"
                    >
                      Sign up
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0 image-container">
              <img
                src="https://luxebook.in/wp-content/uploads/2022/11/Cafe-Panama-Interior-tequila-lounge-image-min-1-1-scaled.jpg"
                className="rounded-4 shadow-4"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
