import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_baseUrl || "http://localhost:1500";

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
        const adminToken = sessionStorage.getItem("adminToken");
        if (adminToken) {
            config.headers['Authorization'] = `Bearer ${adminToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const adminApis = {
    signIn: (email, password) => axiosInstance.post('/admin/signIn', email, password),
    sendEmail: (emailData) => axiosInstance.post('/admin/sendEmail', emailData),

    // Products
    addProduct: (productData) => axiosInstance.post(`/products/`, productData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    updateProduct: (id, productData) => axiosInstance.patch(`/products/${id}`, productData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
    allProducts: () => axiosInstance.get('/products/'),


    // Users
    getAllUsers: () => axiosInstance.get('/users/'),
    getUser: (id) => axiosInstance.get(`/users/${id}`),
    addUser: (name, email, phone) => axiosInstance.post(`/users/`, name, email, phone),
    updateUser: (id, updates) => axiosInstance.patch(`/users/${id}`, updates),
    deleteUser: (id) => axiosInstance.delete(`/users/${id}`),


    // Feedbacks
    getFeedbacks: () => axiosInstance.get('/feedback/'),

    // Order
    getAllOrders: () => axiosInstance.get(`/order/`),
    updateOrder: (id, updates) => axiosInstance.patch(`/order/${id}`, updates),

    getAllPayments: () => axiosInstance.get(`/payment/`),
}

export default adminApis;