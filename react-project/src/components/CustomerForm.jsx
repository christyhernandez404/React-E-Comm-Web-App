import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Alert, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CustomerForm.css';

const CustomerForm = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (customerId) {
            fetchCustomerData(customerId);
        }
    }, [customerId]);

    const fetchCustomerData = (customerId) => {
        axios.get(`http://127.0.0.1:5000/customers/${customerId}`)
            .then(response => {
                const { name, email, phone } = response.data;
                setName(name);
                setEmail(email);
                setPhone(phone);
            })
            .catch(error => {
                setError('Error fetching customer data.');
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true);
            setErrors(null);

            const customerData = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim()
            };

            if (customerId) {
                // Update existing customer
                axios.put(`http://127.0.0.1:5000/customers/${customerId}`, customerData)
                    .then(() => {
                        console.log('Update successful');
                        setIsLoading(false);
                        setShowSuccessModal(true);
                    })
                    .catch(error => {
                        console.error('Error updating customer:', error);
                        setError(error.toString());
                        setIsLoading(false);
                    });
            } else {
                // Create new customer
                axios.post('http://127.0.0.1:5000/customers', customerData)
                    .then(() => {
                        setIsLoading(false);
                        setShowSuccessModal(true);
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                        setError(error.toString());
                        setIsLoading(false);
                    });
            }
        } else {
            setErrors(formErrors);
        }
    };

    const validateForm = () => {
        const formErrors = {};
        if (!name) formErrors.name = 'Name is required';
        if (!email) formErrors.email = 'Email is required';
        if (!phone) formErrors.phone = 'Phone is required';
        return formErrors;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'phone') setPhone(value);
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        setName('');
        setEmail('');
        setPhone('');
        setErrors({});
        navigate('/customers'); 
    };

    return (
        <Container className="form-container">
            {isLoading && <Alert variant="info">Submitting customer data...</Alert>}
            {error && <Alert variant="danger">Error submitting customer data: {error}</Alert>}
    
            <div className="form-content">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleChange}
                        />
                        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                    </Form.Group>
    
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                        />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                    </Form.Group>
    
                    <Form.Group controlId="formGroupPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                    </Form.Group>
    
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </div>
    
            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Customer data submitted successfully.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

    export default CustomerForm;
