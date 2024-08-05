import React, { useState, useEffect } from 'react';
import userApis from '../../Apis/userApis';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaHome, FaBuilding, FaAngleDown, FaAddressBook, FaMinus, FaPlus } from 'react-icons/fa';
import Loader1 from '../../components/Loaders/Loader1';
import Swal from 'sweetalert2';
import "../../Assets/CSS/Cart.css";

const Cart = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userAddresses, setUserAddresses] = useState([]);

    useEffect(() => {
        getCart();
        userData();
    }, []);

    const userData = async () => {
        try {
            const response = await userApis.getProfile();
            setUserAddresses(response.data.user.addresses);
        } catch (error) {
            console.log(error);
        }
    };

    const getCart = async () => {
        try {
            const response = await userApis.getCart();
            setCartItems(response.data.products);
            setCartId(response.data._id);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        const SGST_RATE = 0.06; // 6%
        const CGST_RATE = 0.06; // 6%

        cartItems.forEach(item => {
            total += item.product.price * item.quantity;
        });

        const sgst = total * SGST_RATE;
        const cgst = total * CGST_RATE;
        const grandTotal = Math.round(total + sgst + cgst);

        return {
            total,
            sgst,
            cgst,
            grandTotal
        };
    };

    const { total, sgst, cgst, grandTotal } = calculateTotal();

    const handleProceedToCheckout = async () => {
        if (!selectedAddress) {
            Swal.fire({
                title: 'Error',
                text: 'Please select an address',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }
        // setShowModal(false);

        const paymentSuccess = await paymentHandler();

        setShowModal(false);

        if (paymentSuccess) {
            handleModalConfirm();
        } else {
            Swal.fire({
                title: 'Payment Failed',
                text: 'There was an issue with your payment. Please try again.',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        setIsDropdownOpen(false);
        // setShowModal(false);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalConfirm = async (paymentResponse) => {
        const orderData = {
            cart: cartId,
            totalAmount: grandTotal,
            paymentStatus: 'paid',
            orderStatus: 'processing',
            shippingAddress: selectedAddress,
            billingAddress: selectedAddress,
        };

        try {
            const response = await userApis.createOrder(orderData);
            const orderId = response.data._id;

            const payment = {
                userId: localStorage.getItem("userId"),
                orderId,
                amount: grandTotal,
                currency: "INR",
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature
            };

            await userApis.savePayment(payment);

            Swal.fire({
                title: 'Order Placed',
                text: 'Your order has been placed successfully',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            console.log("Order created successfully:", response.data);
            getCart();
        } catch (error) {
            console.log("Error creating order:", error);
        }
    };

    const handleAddItems = () => {
        navigate('/menu');
    };

    const paymentHandler = async () => {
        try {
            setLoading(true);
            const response = await userApis.createRazorpayOrder({
                amount: grandTotal * 100,
            });

            if (window.Razorpay) {
                const options = {
                    key: process.env.REACT_APP_RAZOR_PAY_KEY,
                    amount: grandTotal * 100,
                    currency: "INR",
                    description: "Pay for your order",
                    order_id: response.data.orderId,
                    callback_url: `${process.env.REACT_APP_baseUrl}/payment/paymentVerification`,
                    handler: async function (response) {
                        console.log("Payment success");
                        handleModalConfirm(response);
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                    },
                    notes: {
                        address: "Razorpay corporate office",
                    },
                    theme: {
                        color: "#4e342e",
                    },
                };

                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();

                return new Promise((resolve, reject) => {
                    razorpayInstance.on('payment.failed', (response) => {
                        reject(response.error);
                    });
                });
            } else {
                throw new Error("Razorpay SDK not available");
            }
        } catch (error) {
            console.error("Error initiating payment:", error);
            Swal.fire({
                title: 'Error',
                text: 'Error initiating payment',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        try {
            const updatedCartItems = cartItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCartItems(updatedCartItems);
            await userApis.updateCart({ id: cartId, productId, quantity: 1 });
            getCart();
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
            const updatedCartItems = cartItems.map(item =>
                item.product._id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            setCartItems(updatedCartItems);
            await userApis.updateCart({ id: cartId, productId, quantity: -1 });
            getCart();
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    return (
        <div className="container mt-4" id='cart'>
            <h2 className="mb-4 text-center title-gradient">Your Cart</h2>
            {loading ? (
                <div className="text-center">
                    <div className="row justify-content-center" style={{ minHeight: "30rem" }}>
                        <div className="col-md-10 d-flex flex-column justify-content-center align-items-center">
                            <Loader1 />
                        </div>
                    </div>
                </div>
            ) : (
                cartItems.length === 0 ? (
                    <div className="text-center">
                        <p>Your cart is empty.</p>
                        <button className="btn btn-brown" onClick={handleAddItems}>Add Items</button>
                    </div>
                ) : (
                    <div className="row g-3">
                        <div className="col-lg-8">
                            <div className="card shadow">
                                <div className="card-body">
                                    <div className="w-100">
                                        {cartItems.map((item, index) => (
                                            <div key={index} className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 mb-3 p-3 border rounded">
                                                <div className="d-flex align-items-center mb-3 mb-md-0">
                                                    <img src={`${process.env.REACT_APP_baseUrl}${item.product.image}`} className="me-3 rounded-circle" alt={item.product.name} style={{ maxWidth: '100px', maxHeight: '100px', aspectRatio: "1/1", objectFit: 'cover' }} />
                                                    <div>
                                                        <h5 className="mt-0">{item.product.name}</h5>
                                                        <p className="mb-1">Price: ₹{item.product.price}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <button className="btn btn-light btn-sm border me-2" onClick={() => handleDecreaseQuantity(item.product._id)}>
                                                        <FaMinus />
                                                    </button>
                                                    <span className="badge bg-light text-dark">{item.quantity}</span>
                                                    <button className="btn btn-light border btn-sm ms-2" onClick={() => handleIncreaseQuantity(item.product._id)}>
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Billing Summary</h5>
                                    <hr />
                                    <div>
                                        <p>Total Items: {cartItems.length}</p>
                                        <p>Total Amount: ₹{total.toFixed(2)}</p>
                                        <p>SGST (6%): ₹{sgst.toFixed(2)}</p>
                                        <p>CGST (6%): ₹{cgst.toFixed(2)}</p>
                                        <hr />
                                        <p><strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong></p>
                                    </div>
                                    <div className="row px-3">
                                        <button className="btn btn-brown btn-block" onClick={() => setShowModal(true)}>Proceed to Checkout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}

            <Modal show={showModal} centered onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Delivery Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="addressSelect">Address:</label>
                        <div className="select-wrapper">
                            <button type="button" onClick={handleDropdownToggle}>
                                {selectedAddress ? selectedAddress : "Select an address"}
                                <FaAngleDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown-list">
                                    {userAddresses.map(address => (
                                        <div
                                            key={address._id}
                                            className="custom-option"
                                            onClick={() => handleAddressSelect(address.address)}
                                        >
                                            {address.type === 'Home' && <FaHome className="custom-option-icon" />}
                                            {address.type === 'Office' && <FaBuilding className="custom-option-icon" />}
                                            {address.type === 'Other' && <FaAddressBook className="custom-option-icon" />}
                                            {address.address}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button variant="brown" onClick={handleProceedToCheckout}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Cart;
