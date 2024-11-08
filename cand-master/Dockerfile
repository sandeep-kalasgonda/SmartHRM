# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn httpx

# Expose the port that the FastAPI app will be running on
EXPOSE 8003

# Define the command to run the FastAPI app using uvicorn
CMD ["uvicorn", "main:intermediate_app", "--host", "0.0.0.0", "--port", "8003"]
