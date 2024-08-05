import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import CustomTable from '../../components/CustomTable';
import adminApis from '../../Apis/AdminApis';
import Loader1 from '../../components/Loaders/Loader1';
import "../../Assets/CSS/customModal.css";
import CustomModal from '../../components/CustomModal';
import { MdAdd } from 'react-icons/md';
import Swal from 'sweetalert2';

const cols = [
    { title: 'ID', field: 'id', render: (item) => item.id },
    { title: 'Image', field: 'image', render: (item) => <img src={item.image ? `${process.env.REACT_APP_baseUrl}${item.image}` : require("../../images/Avatar.png")} alt="User" className='rounded-circle' style={{ width: "50px", height: "50px", aspectRatio: "1/1", objectFit: "cover" }} /> },
    { title: 'Name', field: 'name', render: (item) => item.name },
    { title: 'Email', field: 'email', render: (item) => item.email },
    { title: 'Phone', field: 'phone', render: (item) => item.phone },
];

const Users = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await adminApis.getAllUsers();
                setData(response.data.Users);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
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

        fetchData();
    }, []);

    const handleShowModal = async (data = {}) => {
        if (data.id) {
            try {
                const response = await adminApis.getUser(data._id);
                setEditData(response.data.user);
                setIsEditing(true);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            setEditData({});
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditData({});
        setIsEditing(false);
    };

    const handleAddUser = async () => {
        try {
            console.log(editData)
            const response = await adminApis.addUser(editData);
            setData([...data, response.data.User]);
            handleCloseModal();
            Swal.fire({
                icon: 'success',
                // title: 'Error',
                text: 'User added successfully!',
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
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            await adminApis.updateUser(editData._id, editData);
            setData(prevData =>
                prevData.map(user => (user.id === editData.id ? { ...user, ...editData } : user))
            );
            handleCloseModal();
            Swal.fire({
                icon: 'success',
                // title: 'Error',
                text: 'User updated successfully !',
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
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async (_id) => {
        try {
            await adminApis.deleteUser(_id);
            setData(prevData => prevData.filter(user => user._id !== _id));
            Swal.fire({
                icon: 'success',
                // title: 'Error',
                text: 'User deleted !',
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
            console.error('Error deleting user:', error);
        }
    };

    const handleChange = (id, value) => {
        setEditData({ ...editData, [id]: value });
    };

    const inputs = [
        { id: 'name', type: 'text', value: editData.name || '', placeholder: 'Enter name' },
        { id: 'email', type: 'email', value: editData.email || '', placeholder: 'Enter email' },
        { id: 'phone', type: 'text', value: editData.phone || '', placeholder: 'Enter phone' },
        { id: 'password', type: 'text', value: editData.password || '', placeholder: 'Enter password' },
    ];

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
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Users</h4>
                <Button variant="brown" onClick={() => handleShowModal()}><MdAdd /> Add User</Button>
                <CustomTable cols={cols} data={data} onUpdate={handleShowModal} onDelete={handleDelete} />
            </div>
            <CustomModal
                show={showModal}
                handleClose={handleCloseModal}
                title={isEditing ? 'Edit User' : 'Add User'}
                inputs={inputs}
                handleChange={handleChange}
                handleSubmit={isEditing ? handleUpdateUser : handleAddUser}
            />
        </div>
    );
};

export default Users;
