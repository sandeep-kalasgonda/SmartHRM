import pytest
from fastapi.testclient import TestClient
from main import app  # Adjust the import based on your file structure

client = TestClient(app)

@pytest.fixture(scope="module")
def test_data():
    # You can set up test data here if needed
    return {
        "candidate": {
            "cd_first_name": "John",
            "cd_last_name": "Doe",
            "cd_email": "john.doe@example.com",
            "cd_phno": "1234567890",
            "cd_qual": "Bachelor's",
            "cd_total_exp": 5,
            "cd_related_exp": 3,
            "cd_loc": "New York",
            "cd_cur_ctc": 70000.0,
            "cd_exp_ctc": 80000.0,
            "cd_notice": "30 days",
            "cd_work_mode": "Remote",
            "cd_valid_passport": True,
            "created_by": "admin"
        },
        "rq_id": "example_req_id",  # Use a valid requirement ID from your database
    }

# Test to get all clients
def test_get_clients():
    response = client.get("/clients")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Test to get all requirements
def test_get_requirements():
    response = client.get("/requirements")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Test to create a new candidate
def test_create_candidate(test_data):
    response = client.post(f"/candidates/{test_data['rq_id']}", json=test_data["candidate"])
    assert response.status_code == 200
    assert response.json()["message"] == "Candidate created successfully."

# Test to get all candidates
def test_get_candidates():
    response = client.get("/candidates")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Test to get a specific candidate
def test_get_candidate(test_data):
    # First create a candidate to ensure there is one to get
    create_response = client.post(f"/candidates/{test_data['rq_id']}", json=test_data["candidate"])
    candidate_id = create_response.json()["candidate_id"]
    
    response = client.get(f"/candidates/{candidate_id}")
    assert response.status_code == 200
    assert response.json()["cd_first_name"] == test_data["candidate"]["cd_first_name"]

# Test to update a candidate
def test_update_candidate(test_data):
    # First create a candidate to ensure there is one to update
    create_response = client.post(f"/candidates/{test_data['rq_id']}", json=test_data["candidate"])
    candidate_id = create_response.json()["candidate_id"]
    
    updated_data = {**test_data["candidate"], "cd_first_name": "Jane"}
    response = client.put(f"/candidates/{candidate_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["message"] == "Candidate updated successfully."

# Test to delete a candidate
def test_delete_candidate(test_data):
    # First create a candidate to ensure there is one to delete
    create_response = client.post(f"/candidates/{test_data['rq_id']}", json=test_data["candidate"])
    candidate_id = create_response.json()["candidate_id"]
    
    response = client.delete(f"/candidates/{candidate_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Candidate deleted successfully."

    # Attempt to get the deleted candidate
    response = client.get(f"/candidates/{candidate_id}")
    assert response.status_code == 404
