import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            error: null
        };
    }

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = () => {
        axios.get('http://127.0.0.1:5000/customers')
             .then(response => {
                 this.setState({ customers: response.data });
             })
             .catch(error => {
                 console.error('Error fetching data:', error);
                 this.setState({ error: 'Error fetching customers. Please try again later.' });
             });
    }

    deleteCustomer = (customerId) => {
        axios.delete(`http://127.0.0.1:5000/customers/${customerId}`)
             .then(() => {
                 this.fetchCustomers(); 
             })
             .catch(error => {
                 console.error('Error deleting customer:', error);
                 this.setState({ error: 'Error deleting customer. Please try again.' });
             });
    }

    render() {

        const { error, customers } = this.state;

        return (
            <>
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
            <h5>Customers</h5>
            <ListGroup>
                {customers.map(customer => (
                    <ListGroup.Item key={customer.id} className="shadow-sm p-3 mb-3 bg-white rounded">
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="text-primary">
                                    <Link to={`/edit-customers/${customer.id}`}>{customer.name}</Link>
                                </div>
                                <div>{customer.email}</div>
                                <div>{customer.phone}</div>
                            </div>
                            <div>
                                <Link to={`/edit-customers/${customer.id}`}>
                                    <Button variant="outline-primary" size="sm" className="me-2">
                                        Edit
                                    </Button>
                                </Link>
                            <Button variant="outline-danger" size="sm"  
                                onClick={() => this.deleteCustomer(customer.id)}>
                                Delete
                            </Button>
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            </Container>
            </>
        );
    }
}

export default CustomerList;