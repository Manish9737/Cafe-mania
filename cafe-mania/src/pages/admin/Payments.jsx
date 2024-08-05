import React, { useEffect, useState } from 'react'
import adminApis from '../../Apis/AdminApis'
import Swal from 'sweetalert2'
import Loader1 from '../../components/Loaders/Loader1';
import CustomTable from '../../components/CustomTable';

const cols = [
    { title: 'ID', field: 'id', render: (item) => item.id },
    { title: 'Date', field: 'date', render: (item) => item.createdAt },
    { title: 'Currency', field: 'currency', render: (item) => item.currency },
    { title: 'User', field: 'user', render: (item) => item.userId.name },
    { title: 'Razor-Pay Id', field: 'razorPayId', render: (item) => item.razorpay_order_id },
    { title: 'Status', field: 'status', render: (item) => item.status },
];

const Payments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await adminApis.getAllPayments();
                setData(response.data);
                setLoading(false);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    // title: 'Error',
                    text: 'Something went wrong!',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                console.log(error)
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    if (loading) {
        return (
            <div className="container">
                <div className="row align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
                    <div className="col-md-12 d-flex justify-content-center">
                        <Loader1 />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Payments</h4>
                    <CustomTable cols={cols} data={data}  />
                </div>
            </div>
        </>
    )
}

export default Payments
