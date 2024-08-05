import React from 'react'
import { FaCartPlus, FaUser } from 'react-icons/fa'
import { MdFastfood } from 'react-icons/md'
import { Card } from 'react-bootstrap'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'
import EmailForm from '../../components/EmailForm'

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
)

const Dashboard = () => {
    const userData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Users',
                data: [65, 59, 80, 81, 56, 55, 40],
                // backgroundColor: 'rgba(75, 192, 192, 0.6)',
                backgroundColor: '#795548',
            },
        ],
    }

    const salesData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [45, 67, 58, 81, 65, 77, 89],
                // backgroundColor: 'rgba(153, 102, 255, 0.6)',
                backgroundColor: '#795548',
            },
        ],
    }

    return (
        <div className="container">
            <div className="row g-2">
                <div className="col-md-4">
                    <div className="card bg-brown" style={{ height: "100px", maxHeight: "100px" }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="me-5">
                                    <FaUser className='fs-3 text-white' />
                                </div>
                                <div>
                                    <h5 className="text-white">User</h5>
                                    <p className="text-white">Total Users: 100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-brown" style={{ height: "100px", maxHeight: "100px" }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="me-5">
                                    <MdFastfood className='fs-3 text-white' />
                                </div>
                                <div>
                                    <h5 className="text-white">Product</h5>
                                    <p className="text-white">Total Products: 100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card bg-brown" style={{ height: "100px", maxHeight: "100px" }}>
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="me-5">
                                    <FaCartPlus className='fs-3 text-white' />
                                </div>
                                <div>
                                    <h5 className="text-white">Order</h5>
                                    <p className="text-white">Total Orders: 100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3 m-1">
                <div className="card rounded-1">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <Card>
                                    <Card.Body>
                                        <h5>User Growth</h5>
                                        <div className="chart-container" style={{ height: '300px' }}>
                                            <Bar data={userData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="col-md-6">
                                <Card>
                                    <Card.Body>
                                        <h5>Sales Growth</h5>
                                        <div className="chart-container" style={{ height: '300px' }}>
                                            <Doughnut data={salesData} options={{ maintainAspectRatio: false }} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-12">
                    <Card className='p-2 m-1 h-100'>
                        <Card.Body>
                            <Card.Title>Email</Card.Title>
                            <EmailForm />
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
