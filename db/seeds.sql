USE company;
INSERT INTO departments (name)
VALUES 
("Engineering"),
("HR"),
("Economics"),
("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Lead Senior Engineer", 200000, 1),
("Lead Salesperson", 100000, 4),
("Salesperson", 60000, 4),
("Software Engineer", 125000, 1),
("HR Representative", 80000, 2),
("HR Lead", 110000, 2),
("Accountant", 120000, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES
("Vincent", "Vaga", 1),
("Jules", "Winnfield", 2),
("Marsellus", "Wallace", 3),
("Winston", "Wolfe", 4),
("Toby", "Turner", 5),
("Jennifer", "Watkins", 6),
("John", "Doe", 7),
("Quentin", "Tarantino", 5),
("Jonathan", "Doesworth", 4);