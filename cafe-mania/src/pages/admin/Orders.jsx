import React, { useEffect, useState } from 'react';
import { Table, Dropdown, DropdownButton, FormControl, Button } from 'react-bootstrap';
import adminApis from '../../Apis/AdminApis';
import { FaDownload, FaSort } from 'react-icons/fa';
import Loader1 from '../../components/Loaders/Loader1';
import Swal from 'sweetalert2';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({});

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await adminApis.getAllOrders();
                setOrders(response.data.orders);
                setLoading(false);
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    text: 'Something went wrong!',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                setLoading(false);
            }
        };

        getOrders();
    }, []);

    const handleUpdateStatus = async (orderId, updates) => {
        try {
            await adminApis.updateOrder(orderId, updates);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, ...updates } : order
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handlePaymentStatusChange = (orderId, newStatus) => {
        handleUpdateStatus(orderId, { paymentStatus: newStatus });
    };

    const handleOrderStatusChange = (orderId, newStatus) => {
        handleUpdateStatus(orderId, { orderStatus: newStatus });
    };

    const handleFilterChange = (e, key) => {
        const value = e.target.value;
        setFilters({
            ...filters,
            [key]: value,
        });
    };

    const handleSortClick = (key) => {
        setSortConfig((prevState) => {
            const newDirection = prevState.key === key && prevState.direction === 'asc' ? 'desc' : 'asc';
            return { key, direction: newDirection };
        });
    };

    const filteredData = orders.filter(order => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            return order[key]?.toString().toLowerCase().includes(filters[key].toString().toLowerCase());
        });
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    const handleGeneratePDF = async (order) => {
        const name = order.user.name;
        const address = order.user.address;
        const items = order.cart;

        // Calculate totals for each item
        let subtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;

        items.forEach(item => {
            const itemTotal = item.quantity * item.product.price;
            const itemCgst = (itemTotal * 0.06);
            const itemSgst = (itemTotal * 0.06);

            subtotal += itemTotal;
            totalCgst += itemCgst;
            totalSgst += itemSgst;
        });

        const totalPayableValue = Math.round(subtotal + totalCgst + totalSgst);

        const invoiceHTML = `
            <div class="invoice container">
                <div class="header text-center">
                    <h1 class="mb-1">Cafe-Mania</h1>
                    <p>Nikol, Ahmedabad, India</p>
                    <p>Mobile No.: 9737982616</p><br/>
                    <h2 class="mt-4 mb-4">Invoice</h2>
                    <div class="invoice-details d-flex justify-content-between">
                        <p>Invoice No: ${order.id}</p>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                    <hr style="border-top: 2px dashed #000;">
                    <div class="customer-details text-left mt-3">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Address:</strong> ${address}</p>
                    </div>
                    <hr style="border-top: 2px dashed #000;">
                </div>
                <table class="table table-bordered mt-4">
                    <thead class="thead-dark">
                        <tr>
                            <th>Item Name</th>
                            <th>Qty.</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item, index) => `
                            <tr key=${index}>
                                <td>${item.product.name}</td>
                                <td>${item.quantity}</td>
                                <td>${item.product.price}</td>
                                <td>${(item.quantity * item.product.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Subtotal</td>
                            <td>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3">CGST (6%)</td>
                            <td>${totalCgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3">SGST (6%)</td>
                            <td>${totalSgst.toFixed(2)}</td>
                        </tr>
                        <tr class="total">
                            <td colspan="3"><strong>Total Payable Value</strong></td>
                            <td><strong>${totalPayableValue}.00</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <hr style="border-top: 2px dashed #000;">
                <p class="thank-you text-center mt-4">Thank You, Visit again!!!</p>
                <button class="print-button btn btn-success mt-3" onClick="window.print()">Print Invoice</button>
            </div>
        `;

        generateInvoicePDF(invoiceHTML);
    };

    const generateInvoicePDF = (invoiceHTML) => {
        const newWindow = window.open('', '_blank');
        newWindow.document.open();
        newWindow.document.write(`
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    .invoice {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        page-break-after: always;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .invoice-details {
                        display: flex;
                        justify-content: space-between;
                    }
                    .customer-details {
                        display: block;
                        text-align: left;
                        margin-top: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tfoot td {
                        font-weight: bold;
                    }
                    .total {
                        background-color: #f2f2f2;
                    }
                    .thank-you {
                        text-align: center;
                        margin-top: 20px;
                    }
                    .print-button {
                        display: block;
                        position: fixed;
                        bottom: 20px;
                        height: 50px;
                        width: 105px;
                        border-radius: 10px;
                        right: 20px;
                        z-index: 1000;
                    }
                    @media print {
                        @page {
                            margin: 0;
                        }
                        body {
                            margin: 0;
                        }
                        .print-button {
                            display: none;
                        }
                        header, footer {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                ${invoiceHTML}
            </body>
            </html>
        `);
        newWindow.document.close();
    };


    return (
        <div className="container mt-2 mb-2">
            <h2 className='mb-3'>Orders</h2>
            <div className="card">
                <div className="card-body">
                    {loading ? (
                        <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                            <div className="col-md-1 text-center justify-content-center">
                                <Loader1 />
                            </div>
                        </div>
                    ) : (
                        <Table hover className="table-hover border table-responsive">
                            <thead className="thead-dark">
                                <tr>
                                    {['id', 'createdAt', 'user', 'cart', 'totalAmount', 'paymentStatus', 'orderStatus', 'invoice'].map((header, index) => (
                                        <th key={index} className="header-cell p-3">
                                            <div className="header-content">
                                                {header.charAt(0).toUpperCase() + header.slice(1)}
                                                <Button variant="link" onClick={() => handleSortClick(header)} className="sort-button">
                                                    <FaSort />
                                                </Button>
                                            </div>
                                            <FormControl
                                                type="text"
                                                placeholder={`Filter ${header}`}
                                                onChange={(e) => handleFilterChange(e, header)}
                                                className="filter-input"
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map(order => (
                                    <tr key={order._id}>
                                        <td className='p-3'>{order.id}</td>
                                        <td className='p-3'>{new Date(order.createdAt).toDateString()}</td>
                                        <td className='p-3'>{order.user.name}</td>
                                        <td className='p-3'>
                                            {order.cart.map((item, index) => (
                                                <span key={item.product._id}>
                                                    {item.product.name} (Qty: {item.quantity})
                                                    {index < order.cart.length - 1 && ', '}
                                                </span>
                                            )) || "No Products available"}
                                        </td>
                                        <td className='p-3'>{order.totalAmount} ₹</td>
                                        <td className='p-3'>
                                            <DropdownButton
                                                title={order.paymentStatus}
                                                onSelect={(e) => handlePaymentStatusChange(order._id, e)}
                                                variant="secondary"
                                            >
                                                <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
                                                <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                        <td className='p-3'>
                                            <DropdownButton
                                                title={order.orderStatus}
                                                onSelect={(e) => handleOrderStatusChange(order._id, e)}
                                                variant="secondary"
                                            >
                                                <Dropdown.Item eventKey="pending">Pending</Dropdown.Item>
                                                <Dropdown.Item eventKey="out for delivery">Out for delivery</Dropdown.Item>
                                                <Dropdown.Item eventKey="delivered">Delivered</Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                        <td className='p-3'>
                                            <Button onClick={() => handleGeneratePDF(order)} variant="warning" size="sm">
                                                PDF <FaDownload />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
