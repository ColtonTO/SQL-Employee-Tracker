const db = require('../db/dbconnection.js')
const consoleTable = require('console.table')
const inquirer = require('inquirer')

const init = () => {
    inquirer.createPromptModule([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'toc',
            choices: ["View All Employees",
                      "Add Employee",
                      "Update Employee Role",
                      "View All Roles",
                      "View All Departments",
                      "Add Department",
                      "Update Employee's Manager",
                      "View employees by manager",
                      "View employees by department",
                      "Remove department",
                      "Remove a role",
                      "Remove an employee",
                      "Quit"]
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
}

init()