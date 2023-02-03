const db = require('../db/dbconnection.sql')
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
                      "Add Department",
                      "View All Employees",
                      "Update an employee role",
                      "Update an employee's manager",
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
        if (nextPrompt === "View all departments") {
            viewDepartments();
        };
    })
}

init()