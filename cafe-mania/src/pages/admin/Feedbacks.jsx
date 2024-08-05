import React, { useEffect, useState } from 'react'
import adminApis from '../../Apis/AdminApis';
import Loader1 from '../../components/Loaders/Loader1';
import Swal from 'sweetalert2';

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await adminApis.getFeedbacks();
                setFeedbacks(response.data.Feedbacks)
                setLoading(false)
            } catch (error) {
                setLoading(false)
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
                console.log("Error in fetching feedback !", error)
            }
        }

        fetchFeedbacks()
    }, [])
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {loading ? (
                            <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                                <div className="col-md-1 text-center justify-content-center">
                                    <Loader1 />
                                </div>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 g-2">
                                {feedbacks.map((feedback, index) => (
                                    <div className="col" key={index}>
                                        <div className="card">
                                            <div className="card-body">
                                                <h4 className="card-title">{feedback.name}</h4>
                                                <p className="card-text">{feedback.email}</p>
                                                <p className="card-text">{feedback.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}

export default Feedbacks
