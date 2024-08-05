import React, { useState } from "react";
import adminApis from "../Apis/AdminApis";

const EmailForm = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await adminApis.sendEmail(emailData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          placeholder="to"
          type="email"
          className="form-control"
          id="to"
          name="to"
          value={emailData.to}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          placeholder="subject"
          type="text"
          className="form-control"
          id="subject"
          name="subject"
          value={emailData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          placeholder="message"
          className="form-control"
          id="message"
          name="message"
          value={emailData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-brown">
        Send Email
      </button>
    </form>
  );
};

export default EmailForm;
