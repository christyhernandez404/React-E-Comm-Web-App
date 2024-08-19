import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Alert, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CustomerForm.css';

const ProductForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product_name, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchProductData(productId);
        }
    }, [productId]);

    const fetchProductData = (productId) => {
        axios.get(`http://127.0.0.1:5000/products/${productId}`)
            .then(response => {
                const { product_name, price } = response.data;
                setProductName(product_name);
                setPrice(price);
            })
            .catch(error => {
                setError('Error fetching product data.');
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true);
            setErrors({});

            const productData = {
                product_name: product_name.trim(),
                price: price.trim()
            };

            if (productId) {
                axios.put(`http://127.0.0.1:5000/products/${productId}`, productData)
                    .then(() => {
                        setIsLoading(false);
                        setShowSuccessModal(true);
                    })
                    .catch(error => {
                        console.error('Error updating product:', error);
                        setError(error.toString());
                        setIsLoading(false);
                    });
            } else {
                axios.post('http://127.0.0.1:5000/products', productData)
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
        if (!product_name) formErrors.product_name = 'Product Name is required';
        if (!price) formErrors.price = 'Price is required';
        return formErrors;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'product_name') setProductName(value);
        if (name === 'price') setPrice(value);
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        setProductName('');
        setPrice('');
        setErrors({});
        navigate('/products');
    }; 

    return (
        <Container className="form-container">
            {isLoading && <Alert variant="info">Submitting product data...</Alert>}
            {error && <Alert variant="danger">Error submitting product data: {error}</Alert>}

            <div className="form-content">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formGroupProductName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="product_name"
                            value={product_name}
                            onChange={handleChange}
                        />
                        {errors.product_name && <div style={{ color: 'red' }}>{errors.product_name}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={price}
                            onChange={handleChange}
                        />
                        {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
                    </Form.Group><br></br>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </div>

            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Product data submitted successfully.
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

export default ProductForm;
