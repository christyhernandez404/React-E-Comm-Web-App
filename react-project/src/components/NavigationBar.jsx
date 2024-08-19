import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import '../styles/NavigationBar.css';



function NavigationBar() {
  return (
    <Navbar bg="light" expand="xxl" className="w-100">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/" activeClassname="active">
                    Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/products" activeClassname="active">
                    Products
                </Nav.Link>
                <Nav.Link as={NavLink} to="/add-product" activeClassname="active">
                    Add Product
                </Nav.Link>
                <Nav.Link as={NavLink} to="/customers" activeClassname="active">
                    Customers
                </Nav.Link>
                <Nav.Link as={NavLink} to="/add-customer" activeClassname="active">
                    Add Customer
                </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  )
}

export default NavigationBar;