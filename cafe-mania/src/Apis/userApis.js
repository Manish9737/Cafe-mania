import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_baseUrl

// console.log(API_BASE_URL)

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem('userToken');
        if (userToken) {
            config.headers['Authorization'] = `Bearer ${userToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const userApis = {
    loginUser: (email, password) => axiosInstance.post('/users/login', email, password),
    registerUser: (name, email, phone, password) => axiosInstance.post('/users/', name, email, phone, password),
    getProfile: () => axiosInstance.get(`/users/profileData`),
    updateUser: (id, updates) => axiosInstance.patch(`/users/${id}`, updates, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
    forgotPassword: (email) => axiosInstance.post('/users/forgot-password', email),
    verifyOtp: (email, otp) => axiosInstance.post('/users/verifyOtp', email, otp),
    resetPassword: (email, password) => axiosInstance.post('/users/reset-password', email, password),

    contact: (name, email, message) => axiosInstance.post('/users/contact', name, email, message),

    getProducts:() => axiosInstance.get('/products/'),
    getProduct:(id) => axiosInstance.get(`/products/${id}`),
    addRatings:(id, rating) => axiosInstance.post(`/products/ratings/${id}`, rating),

    getCart: () => axiosInstance.get('/cart/'),
    addToCart: ( productId, quantity ) => axiosInstance.post('/cart/add', productId, quantity),
    updateCart: ( productId, quantity ) => axiosInstance.patch(`/cart/`, productId, quantity),

    getUserOrders: () => axiosInstance.get(`/order/user`),

    createOrder: ( orderData ) => axiosInstance.post(`/order/`, orderData),
    createRazorpayOrder : (amount) => axiosInstance.post('/payment/createOrder', amount),
    savePayment : (paymentData) => axiosInstance.post('/payment/verification', paymentData),

}

export default userApis;