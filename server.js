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
async function addRole() {
  try {
    const departments = await getDepartments();
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the new title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the new salary:",
        },
        {
          type: "list",
          name: "department",
          message: "Choose the department:",
          choices: departments.map((department) => department.departName),
        },
      ])
      .then((answers) => {
        const selectedDepartment = departments.find(
          (department) => department.departName === answers.department
        );
        const request = "INSERT INTO role SET ?";
        db.query(
          request,
          {
            title: answers.title,
            salary: answers.salary,
            depart_id: selectedDepartment.id,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`The role '${answers.title}' has been added to the database.`);
            startEmployeeOrganizer();
          }
        );
      });
  } catch (error) {
    console.error("Error retrieving departments:", error);
  }
}

function getDepartments() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM department";
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}



// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// Classwork 12-08 CRUD-Insert has info on INSERT INTO
async function addAnEmployee() {
  try {
    const roles = await getRoles();
    const managers = await getManagers();

    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter first name:",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter last name:",
        },
        {
          type: "list",
          name: "role_id",
          message: "Select role:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
        {
          type: "list",
          name: "manager_id",
          message: "Please choose a manager for this employee",
          choices: [{ name: "none", value: null }, ...managers.map((manager) => ({
            name: `${manager.firstName} ${manager.lastName}`,
            value: manager.id,
          }))],
        },
      ])
      .then((answers) => {
        const req = "INSERT INTO employee SET ?";
        db.query(
          req,
          {
            firstName: answers.firstName,
            lastName: answers.lastName,
            role_id: answers.role_id,
            manager_id: answers.manager_id,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`'${answers.firstName} ${answers.lastName}' has been added to the database.`);
            startEmployeeOrganizer();
          }
        );
      });
  } catch (error) {
    console.error("Error retrieving roles/managers:", error);
  }
}

function getRoles() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM role";
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getManagers() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM employee";
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
// Classwork 12-10 CRUD-DELETE has info on UPDATE
async function updateEmployeeRole() {
  const employees = await getEmployees();
  const roles = await getRoles();

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select employee:',
        choices: employees.map((employee) => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id,
        })),
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ])
    .then((answers) => {
      const employeeId = answers.employee_id;
      const roleId = answers.role_id;

      const req = 'UPDATE employee SET role_id = ? WHERE id = ?';
      db.query(req, [roleId, employeeId], (err, res) => {
        if (err) throw err;
        console.log(`Employee's role has been updated successfully.`);
        startEmployeeOrganizer();
      });
    });
}

async function getEmployees() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, firstName, lastName FROM employee';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function getRoles() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, title FROM role';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
//
function viewAllDepartments() {
  const req = `SELECT * FROM department;`;
    console.log("All Departments:");
  db.query(req, (err, res) => {
    if (err) throw err;
    console.table(res);
    startEmployeeOrganizer();
  });
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
//
function viewAllRoles() {
  const req = `SELECT role.id, role.title, department.departName, role.salary FROM role JOIN department ON role.depart_id = department.id;`;
  console.log("All Roles:");
  db.query(req, (err, res) => {
    if (err) throw err;
    console.table(res);
    startEmployeeOrganizer();
  });
}

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
//
function viewAllEmployees() {
  const req = `SELECT employee.id, employee.firstName, employee.lastName, role.title, department.departName FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.depart_id = department.id`;
  console.log("All Employees:");
  db.query(req, (err, res) => {
    if (err) throw err;
    console.table(res);
    startEmployeeOrganizer();
  });
}

