import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            error: null
        };
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
        axios.get('http://127.0.0.1:5000/products')
             .then(response => {
                 this.setState({ products: response.data });
             })
             .catch(error => {
                 console.error('Error fetching data:', error);
                 this.setState({ error: 'Error fetching products. Please try again later.' });
             });
    }

    updateProduct = (productId, updatedData) => {
        axios.put(`http://127.0.0.1:5000/products/${productId}`, updatedData)
        .then(() => {
            this.fetchProducts();
        })
        .catch(error => {
            console.error('Error updating product:', error);
            this.setState({error: 'Error updating product. Please try again.'});
        });
    }


    deleteProduct = (productId) => {
        axios.delete(`http://127.0.0.1:5000/products/${productId}`)
            .then(() => {
                console.log(`Product with id ${productId} deleted successfully`);
                this.fetchProducts(); 
                })
            .catch(error => {
                 console.error('Error deleting product:', error);
                 this.setState({ error: 'Error deleting product. Please try again.' });
             });
    }

    render() {

        const { error, products } = this.state;

        return (
            <>
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
            <h3>Products</h3>
            <ListGroup>
                {products.map(product => (
                    <ListGroup.Item key={product.id} className="shadow-sm p-3 mb-3 bg-white rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="text-primary">
                                    {product.product_name}
                                </div>
                                <div>${product.price}</div>
                            </div>
                            <div>
                                 <Link to={`/edit-product/${product.id}`}>
                                     <Button variant="outline-primary" size="sm" className="me-2">
                                         Edit
                                     </Button>
                                 </Link>
                                 <Button 
                                     variant="outline-danger" 
                                     size="sm" 
                                     onClick={() => this.deleteProduct(product.id)}>
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

export default ProductList;