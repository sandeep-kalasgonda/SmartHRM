
# FastAPI Requirements Management API

This API provides a FastAPI-based RESTful API to manage requirements associated with clients. The API supports creating, reading, updating, and deleting requirements, and integrates with a MySQL database for data storage.

## Features

- **Get all clients**: Retrieve all clients for use in dropdowns.
- **Create a new requirement**: Create a new requirement for a specific client.
- **Retrieve all requirements**: Fetch a list of all requirements.
- **Retrieve requirements by client**: Get all requirements for a specific client.
- **Retrieve a requirement by ID**: Get detailed information for a specific requirement.
- **Update a requirement**: Modify an existing requirement by its ID.
- **Delete a requirement**: Remove a requirement by its ID.

## Technologies Used

- **FastAPI**: A modern web framework for building APIs with Python 3.7+.
- **MySQL**: The database used for storing client and requirement data.
- **Pydantic**: Data validation and settings management using Python type annotations.
- **UUID**: Universally unique identifier generation for requirements.
- **Dotenv**: For managing environment variables from `.env` files.
- **CORS Middleware**: To handle Cross-Origin Resource Sharing (CORS) issues.

## Requirements

- Python 3.7+
- MySQL Database
- FastAPI
- mysql-connector-python
- Python-dotenv

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/fastapi-requirements-management.git
   cd fastapi-requirements-management
   ```

2. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn mysql-connector-python python-dotenv
   ```

3. **Configure MySQL connection**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DB=your_mysql_db
   ```

4. **Run the application**:
   Start the FastAPI server using `uvicorn`:
   ```bash
   uvicorn main:app --reload
   ```

5. **Access the API documentation**:
   Navigate to the following URL to explore the API endpoints:
   - OpenAPI Docs: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

## API Endpoints

### 1. Get all clients
- **URL**: `/clients`
- **Method**: `GET`
- **Response**: List of clients (ID and Name)

### 2. Create a new requirement for a specific client
- **URL**: `/requirements/{cl_id}`
- **Method**: `POST`
- **Body**: JSON object with requirement details
- **Response**: Confirmation message and requirement ID

### 3. Get all requirements
- **URL**: `/requirements`
- **Method**: `GET`
- **Response**: List of all requirements

### 4. Get requirements for a specific client
- **URL**: `/requirements/client/{cl_id}`
- **Method**: `GET`
- **Response**: List of requirements for the specified client

### 5. Get a specific requirement by ID
- **URL**: `/requirements/{rq_id}`
- **Method**: `GET`
- **Response**: Requirement details

### 6. Update a requirement by ID
- **URL**: `/requirements/{rq_id}`
- **Method**: `PUT`
- **Body**: JSON object with updated requirement details
- **Response**: Confirmation message

### 7. Delete a requirement by ID
- **URL**: `/requirements/{rq_id}`
- **Method**: `DELETE`
- **Response**: Confirmation message

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures, such as:
- `404 Not Found`: If the requested resource (client or requirement) is not found.
- `500 Internal Server Error`: For issues with database connections or queries.

## License

This project is licensed under the "....." License. See the [LICENSE](LICENSE) file for details.

## Contact

For any queries or support, please reach out to sandeeprajendra00@gmail.com
