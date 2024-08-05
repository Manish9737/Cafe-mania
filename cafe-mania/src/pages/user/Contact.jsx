import React, { useState } from 'react'
import userApis from '../../Apis/userApis';
import Swal from 'sweetalert2';
import { BeatLoader } from 'react-spinners';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        const contactData = new FormData();
        contactData.append('name', name);
        contactData.append('email', email);
        contactData.append('message', message);

        try {
            setLoading(true);
            const response = await userApis.contact({ name, email, message });
            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Successful!",
                    text: "Contact message sent successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong !",
                showConfirmButton: false,
                timer: 1500,
            })
            console.log("Internal server error", error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="position-relative">
                <img
                    src={require("../../images/cafe.jpg")}
                    alt="about"
                    className="img-fluid w-100 h-50"
                    style={{
                        minHeight: "60vh",
                        aspectRatio: "16/3",
                        objectFit: "cover",
                        filter: "brightness(50%)",
                    }}
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center ">
                    <h1
                        className="text-white text-lg text-sm text-xs responsive-text animate__animated animate__fadeInDown"
                        style={{ fontSize: "60px", fontFamily: "satisfya" }}
                    >
                        Get in Touch
                    </h1>
                    <p className="text-white mt-4 animate__animated animate__fadeInDown">
                        We'd love to hear from you!
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 justify-content-center">
                        <img
                            src={require("../../images/illustrations/contact.png")}
                            alt="contact"
                            className='img-fluid'
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center mt-3'>Contact Us</h1>
                        <div className="row mt-5 mb-5 justify-content-center rounded-5 bg-brown">
                            <div className="col-md-10">
                                <div className="row mt-5">
                                    <div className="col-md-6  mb-4">
                                        <iframe
                                            title="Cafe Location"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.017020769745!2d144.95592631571616!3d-37.81720997975137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df0f12f67%3A0x5045675218ce6e0!2sCafe!5e0!3m2!1sen!2sau!4v1634530989481!5m2!1sen!2sau"
                                            width="100%"
                                            height="350"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <p className="text-center mb-4 text-white">
                                            Contact us using the form below or book a table at our cafe.
                                        </p>
                                        <form className="contact-form" onSubmit={handleContactSubmit}>
                                            <div className="input-container">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=" "
                                                />
                                                <label className="form-label" htmlFor="name">
                                                    Name
                                                </label>
                                            </div>
                                            <div className="input-container">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder=" "
                                                />
                                                <label className="form-label" htmlFor="email">
                                                    Email
                                                </label>
                                            </div>
                                            <div className="input-container">
                                                <textarea
                                                    className="form-control"
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    required
                                                    placeholder=" "
                                                ></textarea>
                                                <label className="form-label" htmlFor="message">
                                                    Message
                                                </label>
                                            </div>
                                            <div className="text-center">
                                                <button type="submit" className="btn btn-warning">
                                                    {loading ? (
                                                        <BeatLoader
                                                            color="#FFFFFF"
                                                            loading={loading}
                                                            size={8}
                                                        />
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="mt-3 p-5">
                                    <ul>
                                        <li className="text-start mb-4 text-light">
                                            Welcome to Cafe Mania! We are thrilled to serve you with our
                                            delicious food and beverages in a cozy atmosphere. Whether you're
                                            looking for a quick bite or a place to relax and unwind, our cafe
                                            is the perfect spot for you.
                                        </li>
                                        <li className="text-start mb-4 text-light">
                                            Feel free to contact us using the form below for any inquiries,
                                            feedback, or reservation requests. Our team will be happy to
                                            assist you. You can also book a table at our cafe by filling out
                                            the form or giving us a call.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact
