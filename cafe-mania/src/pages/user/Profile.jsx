import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaPlus, FaPencilAlt, FaTrash, FaAddressBook, FaBuilding } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import userApis from '../../Apis/userApis';

const Profile = () => {
    const [profileImage, setProfileImage] = useState(require("../../images/Cafe-mania.png"));
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({ type: '', address: '' });
    const [selectedImage, setSelectedImage] = useState(null); // Track the image file
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const response = await userApis.getProfile();
                setUserData(response.data.user);
                if (response.data.user.image) {
                    setProfileImage(`${process.env.REACT_APP_baseUrl}${response.data.user.image}`);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getProfileData();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'Home':
                return <FaHome />;
            case 'Office':
                return <FaBuilding />;
            case 'Other':
                return <FaAddressBook />;
            default:
                return null;
        }
    };

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file); 
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const addNewAddress = () => {
        const updatedAddresses = [...(userData.addresses || []), currentAddress];
        setUserData({ ...userData, addresses: updatedAddresses });
        setCurrentAddress({ type: '', address: '' });
        setShowModal(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('email', userData.email);
            formData.append('addresses', JSON.stringify(userData.addresses));
            if (selectedImage) {
                formData.append('image', selectedImage);
            }
            const response = await userApis.updateUser(userData._id, formData);
            setUserData(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowModal = (address = { type: '', address: '' }) => {
        setCurrentAddress(address);
        setShowModal(true);
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setCurrentAddress({ ...currentAddress, [name]: value });
    };

    const saveAddress = () => {
        const updatedAddresses = userData.addresses.map(addr =>
            addr._id === currentAddress._id ? currentAddress : addr);
        setUserData({ ...userData, addresses: updatedAddresses });
        setShowModal(false);
    };

    const handleRemoveAddress = (index) => {
        const updatedAddresses = userData.addresses.filter((_, i) => i !== index);
        setUserData({ ...userData, addresses: updatedAddresses });
    };

    return (
        <>
            <div className="bg-cafeMania vh-100 p-md-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 text-center">
                            <div className="card h-100 bg-brown shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title title-gradient">Profile</h3>
                                    <div className="row text-start">
                                        <div className="col-md-6 d-flex justify-content-center align-items-center flex-column">
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="card-img-top rounded-circle"
                                                style={{ aspectRatio: "1/1", objectFit: "cover", height: "20rem", width: "20rem", cursor: isEditing ? 'pointer' : 'default' }}
                                                onClick={handleImageClick}
                                            />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <div className="col-md-6 text-left text-white">
                                            <div className="form-group mt-4">
                                                <label><b>Name:</b></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={userData.name ?? ''}
                                                    readOnly={!isEditing}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label><b>Phone:</b></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="phone"
                                                    value={userData.phone ?? ''}
                                                    readOnly={!isEditing}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label><b>Email:</b></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="email"
                                                    value={userData.email ?? ''}
                                                    readOnly={!isEditing}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="mt-4 mb-3">
                                                <h5>Addresses:</h5>
                                                {userData.addresses && userData.addresses.length > 0 ? userData.addresses.map((addr, index) => (
                                                    <div key={index} className="mt-2 d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <span className="me-2">{getIcon(addr.type)}</span>
                                                            <div>
                                                                <b>{addr.type}:</b>
                                                                <p className="mb-0">{addr.address}</p>
                                                            </div>
                                                        </div>
                                                        {isEditing && (
                                                            <div>
                                                                <Button variant="link" className='bg-light rounded-circle me-2' onClick={() => handleShowModal(addr)}>
                                                                    <FaPencilAlt className='text-primary '/>
                                                                </Button>
                                                                <Button variant="link" className="bg-light rounded-circle" onClick={() => handleRemoveAddress(index)}>
                                                                    <FaTrash className='text-danger'/>
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )) : (
                                                    <p className="mb-0">No addresses available</p>
                                                )}
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <div className="text-end mt-3">
                                                <Button variant="primary" className='rounded-pill' onClick={() => handleShowModal()}>
                                                    <FaPlus /> Address
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-end me-4">
                                    <button className="btn btn-light mb-3" onClick={handleEditToggle}>
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                    {isEditing && (
                                        <button className="btn btn-success mb-3 ms-3" onClick={handleUpdateProfile}>
                                            Update
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentAddress._id ? 'Edit Address' : 'Add Address'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formAddressType">
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={currentAddress.type}
                                    onChange={handleModalChange}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formAddress" className="mt-3">
                                <Form.Control
                                    placeholder='Address'
                                    type="text"
                                    name="address"
                                    value={currentAddress.address}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={currentAddress._id ? saveAddress : addNewAddress}>
                            {currentAddress._id ? 'Save Changes' : 'Add Address'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Profile;
