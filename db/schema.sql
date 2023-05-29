DROP DATABASE IF EXISTS employeeTrack_db;
CREATE DATABASE employeeTrack_db;
USE employeeTrack_db;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    departName VARCHAR(25)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(40),
  salary DECIMAL(10,2) NOT NULL,
  depart_id INT,
  FOREIGN KEY (depart_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(25),
  lastName VARCHAR(25),
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  manager_id INT
);