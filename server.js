const inquirer = require('inquirer');
const mysql = require("mysql2");
require('dotenv').config();
//figlet creates cool ASCII Art
const figlet = require('figlet');

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((error) => {
  if (error) {
    console.error(`Error connecting to database:`, error);
  } else {
    console.log(`Connected to database.`);
    startEmployeeOrganizer();
  }
});

function startEmployeeOrganizer() {
  figlet('EMPLOYEE', (err, employeeArt) => {
    if (err) {
      console.log('Error generating ASCII art for "EMPLOYEE":', err);
    } else {
      figlet('ORGANIZER', (err, organizerArt) => {
        if (err) {
          console.log('Error generating ASCII art for "ORGANIZER":', err);
        } else {
          console.log(employeeArt + '\n' + organizerArt);

          inquirer
            .prompt({
              type: "list",
              name: "start",
              message: "What would you like to do?",
              loop: false,
              choices: [
                "Add A Department",
                "Add A Role",
                "Add An Employee",
                "Update Employee Role",
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Exit Employee Organizer",
              ],
            })
            .then((answer) => {
              switch (answer.start) {
                case "Add A Department": addDepartment();
                  break;
                case "Add A Role": addRole();
                  break;
                case "Add An Employee": addAnEmployee();
                  break;
                case "Update Employee Role": updateEmployeeRole();
                  break;
                case "View All Departments": viewAllDepartments();
                  break;
                case "View All Roles": viewAllRoles();
                  break;
                case "View All Employees": viewAllEmployees();
                  break;
                case "Exit Employee Organizer":
                  console.log("Exiting Employee Organizer");
                  db.end(function (err) {
                    if (err) {
                      console.error('Error Exiting Employee Organizer:', err);
                    } else {
                      console.log('Employee Organizer Exited Successfully.');
                    }
                  });
              }
            });
        }
      });
    }
  });
}


// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// Classwork 12-08 CRUD-Insert has info on INSERT INTO
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "Enter the new department name:",
    })
    .then((answer) => {
      const departmentName = answer.departmentName;
      const addDept = "INSERT INTO department (departName) VALUES (?)";

      db.query(addDept, [departmentName], (err, res) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log(`The department '${departmentName}' has been added to the database.`);
        }

        startEmployeeOrganizer();
      });
    });
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// Classwork 12-08 CRUD-Insert has info on INSERT INTO
function addRole() {

}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// Classwork 12-08 CRUD-Insert has info on INSERT INTO
function addAnEmployee() {

}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
// Classwork 12-10 CRUD-DELETE has info on UPDATE
function updateEmployeeRole() {

}

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
//
function viewAllDepartments() {
  
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
//
function viewAllRoles() {

}

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
//
function viewAllEmployees() {

}

