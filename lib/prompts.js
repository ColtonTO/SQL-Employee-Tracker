const db = require('../db/dbconnection.js')
const consoleTable = require('console.table')
const inquirer = require('inquirer')

// Main function to initialize app
const init = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'toc',
            choices: [
                      "View All Employees",
                      "Add Employee",
                      "Update Employee Role",
                      "View All Roles",
                      "View All Departments",
                      "Add Department",
                      "Add role",
                      "Update Employee's Manager",
                      "View employees by manager",
                      "View employees by department",
                      "Remove department",
                      "Remove a role",
                      "Remove an employee",
                      "Quit"
            ]
        }
    ])
    .then(answers => {
        const nextPrompt = answers.toc;
        if (nextPrompt === "View All Employees") {
            viewEmployees();
        };

        if (nextPrompt === "Add Employee") {
            addEmployee();
        };

        if (nextPrompt === "Update Employee Role") {
            updateEmployee();
        };

        if (nextPrompt === "View All Roles") {
            viewRoles();
        };

        if (nextPrompt === "View All Departments") {
            viewDepartments();
        };

        if (nextPrompt === "Add Department") {
            addDepartment();
        };

        if (nextPrompt === "Add role") {
            addRole();
        }

        if (nextPrompt === "Update Employee's Manager") {
            updateManager();
        };
        
        if (nextPrompt === "View employees by manager") {
            empManager();
        };

        if (nextPrompt === "View employees by department") {
            empDepartment();
        };

        if (nextPrompt === "Remove department") {
            removeDepartment();
        };

        if (nextPrompt === "Remove a role") {
            removeRole();
        };

        if (nextPrompt === "Remove an employee") {
            removeEmployee();
        };

        if (nextPrompt === "Quit") {
            quit();
        };
    })
};

// When "View All Employees" is selected this function is invoked
// Below function pulls up a lot of information. It includes: ID, First_Name, Last_Name, Title, Salary, Department, and Employee's Manager. 
const viewEmployees = () => {
const sql = `SELECT employees.id,
        employees.first_name,
        employees.last_name,
        roles.title AS title,
        roles.salary AS salary,
        departments.name AS department,
        CONCAT (mngr.first_name, " ", mngr.last_name) AS manager
    FROM employees
    LEFT JOIN roles on employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees mngr ON employees.manager_id = mngr.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.log("\n")
        console.table(rows);
        return init();
    })
}

// When "View All Departments" is selected this function is invoked. Pulls all data from departments table. 
const viewDepartments = () => {
    const sql = `SELECT * FROM departments`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.log("\n")
        console.table(rows)
        return init();
    })
}

// When "View All Roles" is selected this function is invoked. Pulls all data from roles table. 
const viewRoles = () => {
    const sql = `SELECT * FROM roles`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        }
        console.log("\n")
        console.table(rows);
        return init();
    })
}
// When "Add Employee" is selected this function is invoked. 
// You input first and last names, role_id, and manager_id. Your answers will then be imported into the db. 
const addEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is your employee's first name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a name");
                    return false;
                };
            }
        },
        {
        type: 'input',
        name: 'lastName',
        message: "What is your employee's last name?",
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log("Please enter a name");
                return false;
            };
        }
        },
    ])
    .then (answer => {
        const params = [answer.firstName, answer.lastName];
        const sql = ` SELECT * FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const roles = rows.map(({title, id}) => ({name: title, value: id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of this employee?',
                    choices: roles
                }
            ])
            .then(roleAnswer => {
                const role = roleAnswer.role;
                params.push(role);
                const sql = `SELECT * FROM employees`;
                db.query(sql, (err, rows) => {
                    if (err) {
                        throw err
                    }
                    const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                    managers.push({name: "No manager", value: null});
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is this employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerAnswer => {
                        const manager = managerAnswer.manager;
                        params.push(manager);
                        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES (?,?,?,?)`;
                        db.query(sql, params, (err) => {
                            if (err) {
                                throw err
                            }
                            console.log("Employee Added");
                            return viewEmployees();
                        });
                    });
                });
            });
        });
    });
};
// When "Add Department" is selected this function is invoked. 
// Basically all this function is doing is inserting a department name from your response. 
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your new department?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a name");
                    return false;
                };
            }
        }
    ])
    .then(answer => {
        const sql= `INSERT INTO departments (name)
        VALUES (?)`;
        const params = answer.name;
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log("Department added!");
            return viewDepartments();
        })
    })
}
// When "Add Role" is selected this function is invoked.
// Add Role takes in 3 inputs, title, salary, department_id. Inputted data will be sent to the DB when prompts are finished. 
const addRole = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the type of role you would like to add?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a name");
                    return false;
                };
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: salaryInput => {
                if (isNaN(salaryInput)) {
                    console.log("Please enter valid salary");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
    .then (answer => {
        const params = [answer.title, answer.salary];
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const departments = rows.map(({name, id}) => ({name: name, value: id}))
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: "What department is this role in?",
                    choices: departments
                }
            ])
            .then(departmentAnswer => {
                const department = departmentAnswer.department;
                params.push(department);
                const sql = `INSERT INTO ROLES (title, salary, department_id)
                VALUES (?,?,?)`;
                db.query(sql, params, (err) => {
                    if (err) {
                        throw err
                    }
                    console.log('Role added');
                    return viewRoles();
                });
            });
        });
    });
};
// When "Update Employee Role" is selected this function is invoked. 
// You select an employee from the DB, then an update command is used to set a role_id. 
const updateEmployee = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's role do you want to update?",
                choices: employees
            }
        ])
        .then(employeeAnswer => {
            const employee = employeeAnswer.employee;
            const params = [employee];
            const sql = `SELECT title, id FROM roles`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                const roles = rows.map(({title, id}) => ({name: title, value: id}));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the new role of this employee?",
                        choices: roles
                    }
                ])
                .then(rolesAnswer => {
                    const role = rolesAnswer.role;
                    params.unshift(role);
                    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`
                    db.query(sql, params, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("Employee has been updated");
                        return viewEmployees();
                    })
                })
            })
        })
    })
}
// When "Update Employee Manager" is selected this function is invoked.
// This function takes in an employee from the DB, then uses an update command to set a manager_id to an employee. 
const updateManager = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
        .then(employeeAnswer => {
            const employee = employeeAnswer.employee;
            const params = [employee];
            const sql = `SELECT first_name, last_name, id FROM employees`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err
                }
                const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                managers.push({name: "No manager", value: null});
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is this employee's new manager?",
                        choices: managers
                    }
                ])
                .then(managerAnswer => {
                    const manager = managerAnswer.manager;
                    params.unshift(manager);
                    const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`
                    db.query(sql, params, (err) => {
                        if (err) {
                            throw err
                        }
                        console.log("Employee updated");
                        return viewEmployees();
                    })
                })
            })
        })
    })
}
// Function that quits the application
const quit = () => {
    return process.exit();
}
// Last 5 functions not yet implemented. 
const empDepartment = () => {
    console.log("\x1b[31m")
    console.log("|------------------------------------------------------------------|")
    console.log(" This feature has not yet been implemented! Returning to homebase????")
    console.log("|------------------------------------------------------------------|")
    return init();
}

const empManager = () => {
    console.log("\x1b[31m")
    console.log("|------------------------------------------------------------------|")
    console.log(" This feature has not yet been implemented! Returning to homebase????")
    console.log("|------------------------------------------------------------------|")
    return init();
}

const removeDepartment = () => {
    console.log("\x1b[31m")
    console.log("|------------------------------------------------------------------|")
    console.log(" This feature has not yet been implemented! Returning to homebase????")
    console.log("|------------------------------------------------------------------|")
    return init();
}

const removeEmployee = () => {
    console.log("\x1b[31m")
    console.log("|------------------------------------------------------------------|")
    console.log(" This feature has not yet been implemented! Returning to homebase????")
    console.log("|------------------------------------------------------------------|")
    return init();
}

const removeRole = () => {
    console.log("\x1b[31m")
    console.log("|------------------------------------------------------------------|")
    console.log(" This feature has not yet been implemented! Returning to homebase????")
    console.log("|------------------------------------------------------------------|")
    return init();
}
module.exports = init;