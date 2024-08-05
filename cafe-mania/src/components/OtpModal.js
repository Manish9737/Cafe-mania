import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const OtpModal = ({ show, handleClose, handleVerify }) => {
    const [otp, setOtp] = useState("");

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = () => {
        handleVerify(otp);
    };

    return (
        <Modal show={show} centered onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Enter OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='text-muted'>Please enter the OTP that was sent to your email for verification.</p>
                <input
                    type="text"
                    value={otp}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter OTP"
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="brown" onClick={handleSubmit}>
                    Verify OTP
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OtpModal;
