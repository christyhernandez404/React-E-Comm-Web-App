import mysql.connector
from mysql.connector import Error
from flask import Flask, jsonify, request
from flask_marshmallow import Marshmallow
from marshmallow import fields, ValidationError
from flask_cors import CORS #flask cors lets the communication happen between the back end and the front end


# Flask application setup
app = Flask(__name__)
ma = Marshmallow(app)
CORS(app)

# Define the Customer schema
class CustomerSchema(ma.Schema):
    id = fields.String(required=False)
    name = fields.String(required=True)
    email = fields.String(required=True)
    phone = fields.String(required=True)

    class Meta:
        fields = ("id", "name", "email", "phone")

class ProductSchema(ma.Schema):
    id = fields.Integer(required= False)
    product_name = fields.String(required= True)
    price = fields.Float(required= True)

    class Meta:
        fields = ('id', 'product_name', 'price')

class OrderSchema(ma.Schema):
    id = fields.Integer(required= False)
    order_date = fields.Date(required= False)
    customer_id = fields.Float(required= True)

    class Meta:
        fields = ('id', 'order_date', 'customer_id')

class OrderProductSchema(ma.Schema):
    order_id = fields.Integer(required= False)
    product_id = fields.Integer(required= False)

    class Meta:
        fields = ('order_id', 'product_id')


customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many= True)

order_schema = OrderSchema()
orders_schema = OrderSchema(many= True)

order_product_schema = OrderProductSchema()
order_product_schema = OrderProductSchema(many= True)


# Database connection parameters
db_name = "ecom"
user = "root"
password = "Tomatillo4!"
host = "localhost"

def get_db_connection():
    try:
        # Attempting to establish a connection
        conn = mysql.connector.connect(
            database=db_name,
            user=user,
            password=password,
            host=host
        )

        # Check if the connection is successful
        if conn.is_connected():
            print("Connected to MySQL database successfully")
            return conn

    except Error as e:
        # Handling any connection errors
        print(f"Error: {e}")
        return None

#=================CRUD for Customer=================================#

@app.route('/customers', methods=['GET'])
def get_customers():
    try:
        # Establishing connection to the database
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)

        # SQL query to fetch all customers
        query = "SELECT * FROM Customer"

        # Executing the query
        cursor.execute(query)

        # Fetching the results and preparing for JSON response
        customers = cursor.fetchall()

        # Use Marshmallow to format the JSON response
        return customers_schema.jsonify(customers)

    except Error as e:
        # Handling any errors that occur during the process
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    try:
        # Establishing connection to the database
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)

        # SQL query to fetch all customers
        customer_to_get = (id, )

        # Check if the customer exists in the database
        cursor.execute("SELECT * FROM Customer WHERE id = %s", customer_to_get)

        # Fetching the results and preparing for JSON response
        customer = cursor.fetchall()

        # Use Marshmallow to format the JSON response
        return customers_schema.jsonify(customer)

    except Error as e:
        # Handling any errors that occur during the process
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/customers', methods=['POST'])
def add_customer():
    try:
        # Validate and deserialize using Marshmallow input data sent by the client
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()

        # New customer details
        new_customer = (customer_data['name'], customer_data['email'], customer_data['phone'])

        # SQL query to add new customer
        query = "INSERT INTO Customer (name, email, phone) VALUES (%s, %s, %s)"

        # Executing the query
        cursor.execute(query, new_customer)
        conn.commit()

        # Successful addition of the new customer
        return jsonify({"message": "New customer added successfully"}), 201

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    try:
        # Validate and deserialize using Marshmallow input data sent by the client
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()

        # Updated customer details
        updated_customer = (customer_data['name'], customer_data['email'], customer_data['phone'], id)

        # SQL query to update the customer's details
        query = "UPDATE Customer SET name = %s, email = %s, phone = %s WHERE id = %s"

        # Executing the query
        cursor.execute(query, updated_customer)
        conn.commit()

        # Successful update of the new customer
        return jsonify({"message": "Customer details updated successfully"}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()
        customer_to_remove = (id, )

        # Check if the customer exists in the database
        cursor.execute("SELECT * FROM Customer WHERE id = %s", customer_to_remove)
        customer = cursor.fetchone()
        if not customer:
            return jsonify({"error": "Customer not found"}), 404

        # If customer exists, proceed to delete
        query = "DELETE FROM Customer WHERE id = %s"
        cursor.execute(query, customer_to_remove)
        conn.commit()

        # Successful delete of customer
        return jsonify({"message": "Customer removed successfully"}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

#===============CRUD for Product==========#

# get all products
@app.route("/products", methods=['GET'])
def get_products():
    try:
        # Establishing connection to the database
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)

        # SQL query to fetch all customers
        query = "SELECT * FROM products"

        # Executing the query
        cursor.execute(query)

        # Fetching the results and preparing for JSON response
        products = cursor.fetchall()

        # Use Marshmallow to format the JSON response
        return products_schema.jsonify(products)

    except Error as e:
        # Handling any errors that occur during the process
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# get a single product
@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        # Establishing connection to the database
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)

        # SQL query to fetch all customers
        product_to_get = (id, )

        # Check if the customer exists in the database
        cursor.execute("SELECT * FROM products WHERE id = %s", product_to_get)

        # Fetching the results and preparing for JSON response
        product = cursor.fetchall()

        # Use Marshmallow to format the JSON response
        return product_schema.jsonify(product)
    except Error as e:
            # Handling any errors that occur during the process
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


# add a product
@app.route('/products', methods=['POST'])
def add_product():
    try:
        # Validate and deserialize using Marshmallow input data sent by the client
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()

        # New customer details
        new_product = (product_data['product_name'], product_data['price'])

        # SQL query to add new customer
        query = "INSERT INTO products (product_name, price) VALUES (%s, %s)"

        # Executing the query
        cursor.execute(query, new_product)
        conn.commit()

        # Successful addition of the new customer
        return jsonify({"message": "New product added successfully"}), 201

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()



#update a product
@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()

        # Updated customer details
        updated_product = (product_data['product_name'], product_data['price'], id)

        # SQL query to update the customer's details
        query = "UPDATE products SET product_name = %s, price = %s WHERE id = %s"

        # Executing the query
        cursor.execute(query, updated_product)
        conn.commit()

        # Successful update of the new customer
        return jsonify({"message": "Product details updated successfully"}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()




#delete a product
@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()
        product_to_remove = (id, )

        # Check if the product exists in the database
        cursor.execute("SELECT * FROM products WHERE id = %s", product_to_remove)
        product = cursor.fetchone()
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # If customer exists, proceed to delete
        query = "DELETE FROM products WHERE id = %s"
        cursor.execute(query, product_to_remove)
        conn.commit()

        # Successful delete of customer
        return jsonify({"message": "Product removed successfully"}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        # Closing the database connection
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

#===============CRUD for Orders==========#

# get a single order
@app.route('/orders/<int:customer_id>', methods=['GET'])
def get_orders_by_customer(customer_id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM orders WHERE customer_id = %s"
        cursor.execute(query, (customer_id,))
        orders = cursor.fetchall()
        return jsonify(orders)
    
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


# add an order
@app.route('/orders', methods=['POST'])
def add_order():
    try:
        # Extract order-related data
        order_date = request.json.get('order_date', [])
        customer_id = request.json.get('customer_id', [])
        
        # Validate order data using OrderSchema
        order_data = order_schema.load({
            'order_date': order_date,
            'customer_id': customer_id
        })
        print("Order data", order_data)

        # Extract and validate product-related data
        product_ids = request.json.get('product_ids', [])
        order_products_data = [{'product_id': pid} for pid in product_ids]
        order_product_schema.load(order_products_data, many=True)
        print("Order product data", order_products_data)
 
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()

        # New order details
        new_order = (order_data['order_date'], order_data['customer_id'])

        # SQL query to add new order
        query = "INSERT INTO orders (order_date, customer_id) VALUES (%s, %s)"

        # Executing the query
        cursor.execute(query, new_order)
        order_id = cursor.lastrowid #retrieve id of newly inserted order

        for product_id in order_products_data:
            new_order_product = (order_id, product_id)
            query = "INSERT INTO order_products (order_id, product_id) VALUES (%s, %s)"
            cursor.execute(query, new_order_product)

        conn.commit()

        # Successful addition of the new order
        return jsonify({"message": "New order created successfully", "order_id": order_id}), 201

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()



if __name__ == '__main__':
    app.run(debug=True)

