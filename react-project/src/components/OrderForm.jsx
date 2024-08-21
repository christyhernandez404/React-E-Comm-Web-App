import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Container, Spinner } from 'react-bootstrap';

const OrderForm = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/products')
            .then(response => setProducts(response.data))
            .catch(error => {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again.');
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!selectedProduct) {
            setError('Please select a product.');
            setIsLoading(false);
            return;
        }

        if (!customerId) {
            setError('Please enter a customer ID.');
            setIsLoading(false);
            return;
        }

        const orderData = {
            customer_id: customerId,
            product_id: selectedProduct,
            order_date: orderDate || new Date().toISOString().split('T')[0], // Default to today's date
        };
        console.log(orderData);

        axios.post('http://127.0.0.1:5000/orders', orderData)
            .then(() => {
                setSuccess('Order placed successfully.');
                setIsLoading(false);
                // clear form fields
                setSelectedProduct('');
                setCustomerId('');
                setOrderDate('');
            })
            .catch(error => {
                console.error('Error placing order:', error);
                setError('Error placing order. Please try again.');
                setIsLoading(false);
            });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Container>
            <h5>Place Order</h5>
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form.Group>
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control
                        type="number"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        placeholder="Enter a valid customer ID"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Product</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">Select a product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.product_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={orderDate}
                        min={today}
                        onChange={(e) => setOrderDate(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Submit Order'}
                </Button>
            </Form>
        </Container>
    );
};

export default OrderForm;
