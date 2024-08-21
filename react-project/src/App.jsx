import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import OrderForm from './components/OrderForm';
import GetOrderDetails from './components/GetOrderDetails';


function App() {

  return (
    <>
      <NavigationBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/edit-product/:productId" element={<ProductForm />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/add-customer" element={<CustomerForm />} />
        <Route path="/edit-customers/:customerId" element={<CustomerForm />} />
        <Route path="/create-order" element={<OrderForm />} />"
        <Route path="/retrieve-order" element={<GetOrderDetails />} />
      </Routes>
    </>
  )
}

export default App
