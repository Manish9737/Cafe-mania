import React, { useEffect, useState } from 'react';
import adminApis from '../../Apis/AdminApis';
import Loader1 from '../../components/Loaders/Loader1';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import CustomModal from '../../components/CustomModal';
import ConfirmationBox from '../../components/ConfirmationBox';
import Swal from 'sweetalert2';

const Products = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        category: '',
        subcategory: '',
        description: '',
        price: '',
        image: null,
    });
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        subcategory: '',
        price: ''
    });

    const inputs = [
        { id: 'name', type: 'text', value: formData.name, placeholder: 'Enter product name' },
        { id: 'category', type: 'text', value: formData.category, placeholder: 'Enter category' },
        { id: 'subcategory', type: 'text', value: formData.subcategory, placeholder: 'Enter subcategory' },
        { id: 'description', type: 'text', value: formData.description, placeholder: 'Enter description' },
        { id: 'price', type: 'number', value: formData.price, placeholder: 'Enter price' },
        { id: 'image', type: 'file', value: '', placeholder: 'Select an image' },
    ];

    const filterInputs = [
        { id: 'name', type: 'text', value: filters.name, placeholder: 'Filter by name' },
        { id: 'category', type: 'text', value: filters.category, placeholder: 'Filter by category' },
        { id: 'subcategory', type: 'text', value: filters.subcategory, placeholder: 'Filter by subcategory' },
        { id: 'price', type: 'number', value: filters.price, placeholder: 'Filter by price' },
    ];

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await adminApis.allProducts();
                setData(response.data.Products);
                setFilteredData(response.data.Products);
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
                setLoading(false);
            }
        };

        getData();
    }, []);

    const handleOpenModal = () => {
        setShowModal(true);
        setIsEditing(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setFormData({
            _id: '',
            name: '',
            category: '',
            subcategory: '',
            description: '',
            price: '',
            image: null,
        });
    };

    const handleInputChange = (id, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleFileChange = (id, files) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: files[0],
        }));
    };

    const handleSubmit = async () => {
        const submissionFormData = new FormData();
        for (const key in formData) {
            submissionFormData.append(key, formData[key]);
        }

        try {
            if (isEditing) {
                await adminApis.updateProduct(formData._id, submissionFormData);

                Swal.fire({
                    icon: 'success',
                    // title: 'Error',
                    text: 'Product updated!',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                await adminApis.addProduct(submissionFormData);
                Swal.fire({
                    icon: 'success',
                    // title: 'Error',
                    text: 'Product added!',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }

            const response = await adminApis.allProducts();
            setData(response.data.Products);
            setFilteredData(response.data.Products);
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
            console.error("Error:", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleUpdate = (product) => {
        setIsEditing(true);
        setShowModal(true);
        setFormData({
            _id: product._id,
            name: product.name,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,   
            price: product.price,
            image: product.image,
        });
    };

    const handleDelete = async () => {
        try {
            const response = await adminApis.deleteProduct(deleteProductId);
            if (response.status === 200) {
                setData(data.filter(product => product._id !== deleteProductId));
                setFilteredData(data.filter(product => product._id !== deleteProductId));
            }
            Swal.fire({
                icon: 'success',
                // title: 'Error',
                text: 'Product deleted!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
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
            console.error("Error deleting product:", error);
        } finally {
            setShowConfirmation(false);
            setDeleteProductId(null);
        }
    };

    const handleDeleteClick = (productId) => {
        setDeleteProductId(productId);
        setShowConfirmation(true);
    };

    const handleFilterChange = (id, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
    };

    useEffect(() => {
        const filtered = data.filter(product => {
            return (
                (!filters.name || product.name.toLowerCase().includes(filters.name.toLowerCase())) &&
                (!filters.category || product.category.toLowerCase().includes(filters.category.toLowerCase())) &&
                (!filters.subcategory || product.subcategory.toLowerCase().includes(filters.subcategory.toLowerCase())) &&
                (!filters.price || product.price <= parseFloat(filters.price))
            );
        });
        setFilteredData(filtered);
    }, [filters, data]);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h3 className="card-title">Filter Products</h3>
                                <div className="row">
                                    {filterInputs.map(input => (
                                        <div className="col-md-3 mb-3" key={input.id}>
                                            <input
                                                type={input.type}
                                                className="form-control"
                                                placeholder={input.placeholder}
                                                value={input.value}
                                                onChange={(e) => handleFilterChange(input.id, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 justify-content-center">
                        <div className="card">
                            {loading ? (
                                <div className="row d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                                    <div className="col-md-1 text-center justify-content-center">
                                        <Loader1 />
                                    </div>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <button className="btn btn-brown mb-3" onClick={handleOpenModal}>
                                        <MdAdd /> Add
                                    </button>
                                    <h3 className="card-title">Products</h3>
                                    <div className="row row-cols-md-4 row-cols-1">
                                        {filteredData.map((item, index) => (
                                            <div className="col p-4" key={index}>
                                                <div className="card shadow">
                                                    <img
                                                        src={`${process.env.REACT_APP_baseUrl}${item.image}`}
                                                        className="card-img-top img-fluid"
                                                        alt={item.name}
                                                        style={{
                                                            aspectRatio: "3/3",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.name}</h5>
                                                        <small className="card-text">{item.category}</small>
                                                        <p className="card-text">{item.subcategory}</p>
                                                        <p className="card-text"><b>{item.price} ₹</b></p>
                                                    </div>
                                                    <div className="card-footer">
                                                        <div className="d-flex justify-content-between">
                                                            <button className="btn btn-outline-primary" onClick={() => handleUpdate(item)}>
                                                                <MdEdit /> Update
                                                            </button>
                                                            <button className="btn btn-outline-danger" onClick={() => handleDeleteClick(item._id)}>
                                                                <MdDelete /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                title={isEditing ? "Update Product" : "Add Product"}
                inputs={inputs}
                handleChange={(id, value) => id === 'image' ? handleFileChange(id, value) : handleInputChange(id, value)}
                handleSubmit={handleSubmit}
            />
            <ConfirmationBox
                show={showConfirmation}
                handleClose={() => setShowConfirmation(false)}
                handleConfirm={handleDelete}
                header="Are you sure ?"
                message="Are you sure you want to remove this product?"
            />
        </>
    );
};

export default Products;
