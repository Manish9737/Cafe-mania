import React, { useEffect, useState } from 'react';
import userApis from '../../Apis/userApis';
import "../../Assets/CSS/Order.css"

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await userApis.getUserOrders();
                setOrders(response.data.orders);
            } catch (error) {
                console.log(error);
            }
        }

        getOrders();
    }, []);

    const getStatusAlertClass = (status) => {
        switch (status) {
            case 'processing':
                return 'alert-primary';
            case 'out for delivery':
                return 'alert-warning';
            case 'delivered':
                return 'alert-success';
            default:
                return 'alert-secondary';
        }
    }

    const getStatusIndex = (status) => {
        const statusList = ['Order Placed', 'processing', 'out for delivery', 'delivered'];
        return statusList.indexOf(status);
    }

    return (
        <>
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card shadow">
                            <div className="card-body">
                                <h1 className="card-title title-gradient text-center">Orders</h1>
                                <div className="orders mt-5">
                                    {orders.map((order) => (
                                        <div className="card mb-3 shadow m-2" key={order._id}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="timeline">
                                                            <ul className="timeline-list">
                                                                {['Order Placed', 'Processing', 'Dispatched for Delivery', 'Delivered'].map((stage, index) => (
                                                                    <li key={index} className={`timeline-item ${index <= getStatusIndex(order.orderStatus) ? 'completed' : ''}`}>
                                                                        <span className="timeline-icon"></span>
                                                                        <span className="timeline-text">{stage}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <div className="d-flex justify-content-between">
                                                            <h6 className="card-text">ID: {order._id}</h6>
                                                            <h6 className="card-text">{`${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}`}</h6>
                                                        </div>
                                                        <h6 className="card-text text-muted">{`@${order.shippingAddress}`}</h6>
                                                        <hr/>
                                                        <h4 className="card-text">Products:</h4>
                                                        {order.cart.map((item, index) => (
                                                            <h6 key={index} className='card-text text-muted ms-3'>
                                                                {`${item.quantity} x ${item.product.name}`}
                                                            </h6>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <div className="d-flex justify-content-between">
                                                    <div className={`alert alert-sm ${getStatusAlertClass(order.orderStatus)} p-2 mb-0`}>
                                                        {order.orderStatus.toUpperCase()}
                                                    </div>
                                                    <h5 className="card-text me-2">₹ {order.totalAmount}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Orders;
