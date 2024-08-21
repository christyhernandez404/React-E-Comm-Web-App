import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Container, Table } from 'react-bootstrap';

const OrderDetailsForm = () => {
    const [customerId, setCustomerId] = useState('');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = () => {
        setIsLoading(true);
        setError(null);

        axios.get(`http://127.0.0.1:5000/orders/${customerId}`)
            .then(response => {
                setOrders(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setError('Error fetching orders. Please try again.');
                setIsLoading(false);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!customerId) {
            setError('Please enter a customer ID.');
            return;
        }
        fetchOrders();
    };

    const calculateExpectedDeliveryDate = (orderDate) => {
        const date = new Date(orderDate);
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    return (
        <Container>
            <h5>Get Order Details</h5>
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group>
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control
                        type="number"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Get Orders'}
                </Button>
            </Form>

            {orders.length > 0 && (
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Customer ID</th>
                            <th>Expected Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.order_date}</td>
                                <td>{order.customer_id}</td>
                                <td>{calculateExpectedDeliveryDate(order.order_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default OrderDetailsForm;