
CREATE DATABASE MVP2;
USE MVP2;
CREATE TABLE clients (
cl_id  VARCHAR(100)  PRIMARY KEY,
cl_name VARCHAR(255) NOT NULL,
cl_email VARCHAR(100)  ,
cl_phno VARCHAR(20)  ,
cl_addr TEXT,
cl_map_url TEXT,
cl_type VARCHAR(50),
cl_notes TEXT,
created_by VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by VARCHAR(255),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

	CREATE TABLE contacts (
	co_id  VARCHAR(100)  PRIMARY KEY,
	cl_id  VARCHAR(100)  REFERENCES clients(cl_id),
	co_name VARCHAR(255) NOT NULL,
	co_position_hr VARCHAR(100),
	co_email VARCHAR(100) UNIQUE NOT NULL,
	co_phno VARCHAR(20) UNIQUE NOT NULL,
	created_by VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_by VARCHAR(255),
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);
    
    
    
    CREATE TABLE requirements (
rq_id VARCHAR(100)  PRIMARY KEY ,
cl_id  VARCHAR(100)  REFERENCES clients(cl_id),
rq_name VARCHAR(255) NOT NULL,
rq_loc VARCHAR(255) NOT NULL,
rq_no_pos INT NOT NULL,
rq_qual VARCHAR(255),
rq_skills TEXT NOT NULL,
rq_exp INT NOT NULL,
rq_budget DECIMAL(10, 2),
rq_work_mode VARCHAR(50),
rq_start_date DATE,
rq_no_of_days INT,
rq_notes TEXT,
created_by VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by VARCHAR(255),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



CREATE TABLE candidates (
cd_id  VARCHAR(100)  PRIMARY KEY,
rq_id VARCHAR(100) REFERENCES requirements(rq_id),
cd_first_name VARCHAR(255) NOT NULL,
cd_last_name VARCHAR(255),
cd_email VARCHAR(100) NOT NULL UNIQUE,
cd_phno VARCHAR(20) NOT NULL UNIQUE,
cd_qual VARCHAR(255) NOT NULL,
cd_total_exp INT NOT NULL,
cd_related_exp INT,
cd_loc VARCHAR(255) NOT NULL,
cd_cur_ctc DECIMAL(10, 2)  NOT NULL,
cd_exp_ctc DECIMAL(10, 2) NOT NULL,
cd_notice VARCHAR(50) NOT NULL,
cd_work_mode VARCHAR(50) NOT NULL,
cd_valid_passport BOOLEAN,
created_by VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_by VARCHAR(255),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT * from  clients;
SELECT * from  contacts;
SELECT * from  requirements;
SELECT * from  candidates;
