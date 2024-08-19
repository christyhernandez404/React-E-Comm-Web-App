import React from 'react';
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/ePay.png'; 
import blender from '../images/blender.jpg'; 
import earbuds from '../images/earbuds.jpg';
import laptopbag from '../images/laptopbag.jpg';


const Home = () => {
    return (
        <Container className="text-center my-5">
          <Row className="mb-4">
            <Col>
              <Image src={logo} alt="ePay" fluid className="mb-3" style={{ maxWidth: '400px' }} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={blender}
                    alt="GourmetPro Blender"
                    style = {{borderRadius: "50px"}}
                  />
                  <Carousel.Caption style={{ color: 'black'}}>
                    <h3>GourmetPro Blender</h3>
                    <p>High-performance blender for all your culinary needs.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={earbuds}
                    alt="EchoSmart Wireless Earbuds"
                    style = {{borderRadius: "50px"}}
                  />
                  <Carousel.Caption style={{ color: 'black'}}>
                    <h3>EchoSmart Wireless Earbuds</h3>
                    <p>Enjoy superior sound quality and comfort.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={laptopbag}
                    alt="LuxeLeather Laptop Bag"
                    style = {{borderRadius: "50px"}}
                  />
                  <Carousel.Caption style={{ color: 'black'}}>
                    <h3>LuxeLeather Laptop Bag</h3>
                    <p>Elegant and durable, perfect for carrying your laptop.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      );
  };
  
  export default Home;