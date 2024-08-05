import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import userApis from '../../Apis/userApis';
import StarRatings from 'react-star-ratings';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaCartPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [ratingMessage, setRatingMessage] = useState('');
    const [buttonAnimation, setButtonAnimation] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await userApis.getProduct(id);
                setProduct(response.data.Product);
            } catch (error) {
                console.log(error);
            }
        };

        const getCart = async () => {
            try {
                const response = await userApis.getCart();
                const cartData = response.data || {};
                const products = cartData.products || [];

                const cartItem = products.find(item => item.product._id === id);

                if (cartItem) {
                    setQuantity(cartItem.quantity);
                } else {
                    setQuantity(0);
                }
            } catch (error) {
                console.log(error);
                setQuantity(0);
            }
        };

        getProduct();
        getCart();
    }, [id]);

    const handleRatingChange = async (newRating) => {
        setUserRating(newRating);

        let message = '';
        switch (newRating) {
            case 1:
                message = 'Very Bad';
                break;
            case 2:
                message = 'Bad';
                break;
            case 3:
                message = 'Average';
                break;
            case 4:
                message = 'Good';
                break;
            case 5:
                message = 'Excellent';
                break;
            default:
                message = '';
        }
        setRatingMessage(message);

        try {
            const response = await userApis.addRatings(id, {rating: newRating});
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Rating Submitted',
                    text: 'Thank you for your rating!',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                showConfirmButton: false,
                timer: 1000,
            });
            console.log(error);
        }
    };

    const handleAddToCart = async () => {
        setButtonAnimation('animate__animated animate__bounceIn');
        setTimeout(async () => {
            setButtonAnimation('');
            setQuantity(1);
            try {
                const response = await userApis.addToCart({productId: id, quantity: 1 });
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Added to Cart',
                        text: 'Product added to your cart successfully!',
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    showConfirmButton: false,
                    timer: 1000,
                });
                console.log(error);
            }
        }, 1000);
    };

    const handleIncreaseQuantity = async () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        try {
            await userApis.updateCart(id, { quantity: newQuantity });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDecreaseQuantity = async () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            try {
                await userApis.updateCart(id, { quantity: newQuantity });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
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
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <h1
                        className="text-white text-lg text-sm text-xs responsive-text animate__animated animate__fadeInDown"
                        style={{ fontSize: "60px", fontFamily: "satisfya" }}
                    >
                        CAfe-Mania<br /> Products
                    </h1>
                </div>
            </div>

            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-9">
                        <div className="card p-3 shadow-lg">
                            <div className="card-body">
                                <div className="text-start">
                                    <Button variant='transparent' onClick={handleBack} >
                                        <FaArrowLeft className='fs-5' />
                                    </Button>
                                </div>
                                <div className="row g-2">
                                    <div className="col-md-5 d-flex justify-content-center align-items-center">
                                        <img
                                            src={`${process.env.REACT_APP_baseUrl}${product.image}`}
                                            alt={product.name}
                                            className="img-fluid rounded-circle border border-secondary"
                                            style={{
                                                aspectRatio: "1/1",
                                                objectFit: "cover",
                                                maxWidth: "300px",
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-7 d-flex flex-column justify-content-center">
                                        <h1 className='text-center card-title'>{product.name}</h1>

                                        <div className="details mt-2">
                                            <h5 className="card-text text-center mb-4">{product.subcategory} [ {product.category} ]</h5>
                                            <p className="card-text">{product.description}</p>
                                            <h5 className="card-text">Ratings: {product.averageRating}+</h5>
                                            <h4 className="card-text">Price: {product.price} ₹</h4>
                                            <div className="row">
                                                {quantity === null ? (
                                                    <div>Loading...</div>
                                                ) : (
                                                    quantity === 0 ? (
                                                        <Button
                                                            className={`btn btn-brown mt-3 mb-3 ${buttonAnimation}`}
                                                            onClick={handleAddToCart}
                                                        >
                                                            <FaCartPlus className='fs-4 me-2' />
                                                            <span>Add to cart</span>
                                                        </Button>
                                                    ) : (
                                                        <div className="d-flex align-items-center justify-content-center mt-3 mb-3">
                                                            <Button
                                                                className="btn btn-secondary"
                                                                onClick={handleDecreaseQuantity}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="mx-3">{quantity}</span>
                                                            <Button
                                                                className="btn btn-secondary"
                                                                onClick={handleIncreaseQuantity}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div className="text-center mt-4 mb-4">
                                                <h5 className="text-dark">
                                                    How would you rate this product?
                                                </h5>
                                                <p className="text-muted">
                                                    Your feedback helps us improve our offerings. Please rate the product based on your experience.
                                                </p>
                                                <StarRatings
                                                    rating={userRating}
                                                    starRatedColor="#f39c12"
                                                    starEmptyColor="gray"
                                                    numberOfStars={5}
                                                    starDimension="30px"
                                                    starSpacing="2px"
                                                    changeRating={handleRatingChange}
                                                    name="userRating"
                                                />
                                                {ratingMessage && (
                                                    <div className="mt-2">
                                                        <span className="text-dark">{ratingMessage}</span>
                                                    </div>
                                                )}
                                            </div>
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

export default Product;
