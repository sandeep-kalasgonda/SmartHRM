# Smart-HR-System - Master API

This project is a FastAPI-based intermediate API that consists of an intermediate service which forwards HTTP requests to multiple backend services (clients, requirements, and candidates master), along with the individual masters from their respective feature branch. The API acts as a gateway to these services, forwarding requests while handling errors and logging responses.

## Features

- Consists of 1 intermediate service, 3 master services for client candidate and requirement master and database schema
- Supports CRUD operations for clients, requirements, and candidates.
- Error handling with detailed logging.
- Asynchronous HTTP requests using `httpx`.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Logging](#logging)
- [License](#license)

## Installation

To run this project locally, you'll need to have Python 3.8+ installed.

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/intermediate-api.git
    cd intermediate-api
    ```

2. Create a virtual environment and activate it:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

## Environment Variables

This project uses environment variables to configure the backend service URLs and port. You can set these using an `.env` file or through your shell:

```bash
INTERMEDIATE_API_PORT=8000
```

You can also override the base backend URLs by modifying `BASE_BACKEND_URLS` in the code or using environment variables in your setup.

## API Endpoints

### Clients CRUD Operations

- **GET /clients**: List all clients.
- **GET /clients/{client_id}**: Get a specific client by ID.
- **POST /clients**: Create a new client.
- **PUT /clients/{client_id}**: Update an existing client.
- **DELETE /clients/{client_id}**: Delete a client by ID.

### Requirements CRUD Operations

- **GET /requirements**: List all requirements.
- **GET /requirements/client/{cl_id}**: Get all requirements for a specific client.
- **GET /requirements/{rq_id}**: Get a specific requirement by ID.
- **POST /requirements/{cl_id}**: Create a requirement for a specific client.
- **PUT /requirements/{rq_id}**: Update an existing requirement.
- **DELETE /requirements/{rq_id}**: Delete a requirement by ID.

### Candidates CRUD Operations

- **POST /candidates/{rq_id}**: Create a candidate for a specific requirement.
- **GET /candidates**: List all candidates.
- **GET /candidates/{cd_id}**: Get a specific candidate by ID.
- **PUT /candidates/{cd_id}**: Update an existing candidate.
- **DELETE /candidates/{cd_id}**: Delete a candidate by ID.

## Usage

1. Run the application using `uvicorn`:

    ```bash
    uvicorn intermediate_app:intermediate_app --host 0.0.0.0 --port 8000
    ```

    The API will be available at `http://localhost:8000`.

2. Use any API client (e.g., Postman, curl) to interact with the API. For example, to list all clients:

    ```bash
    curl http://localhost:8000/clients
    ```

## Logging

The application uses Python's built-in `logging` library to log important information. By default, it logs to the console with the `INFO` level. You can adjust the log level and output destination in the `logging.basicConfig()` configuration.

## License

This project is licensed under the "....." License. See the `LICENSE` file for more information.


## Contact

For any queries or support, please reach out to sandeeprajendra00@gmail.com
