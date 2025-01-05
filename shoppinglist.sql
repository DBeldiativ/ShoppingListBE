-- Create Tables
CREATE TABLE User (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255)
);

CREATE TABLE ShoppingList (
    list_id SERIAL PRIMARY KEY,
    list_name VARCHAR(100),
    owner_id INT REFERENCES User(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Item (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100),
    quantity INT,
    list_id INT REFERENCES ShoppingList(list_id),
    is_completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE ListMember (
    list_id INT REFERENCES ShoppingList(list_id),
    user_id INT REFERENCES User(user_id),
    role VARCHAR(20),
    PRIMARY KEY (list_id, user_id)
);

-- Insert Sample Data
INSERT INTO User (username, email, password_hash) VALUES ('jiri_movak', 'jiri@mail.com', 'hash123');
INSERT INTO ShoppingList (list_name, owner_id) VALUES ('Weekly Groceries', 1);
INSERT INTO Item (item_name, quantity, list_id, is_completed) VALUES ('Milk', 2, 1, FALSE);
INSERT INTO ListMember (list_id, user_id, role) VALUES (1, 1, 'owner');

-- Queries
-- 1. Select items in a list
SELECT item_name, quantity FROM Item WHERE list_id = 1;

-- 2. List all shopping lists with owner info
SELECT sl.list_name, u.username FROM ShoppingList sl
JOIN User u ON sl.owner_id = u.user_id;

-- 3. Aggregate: Count items per list
SELECT list_id, COUNT(*) as item_count FROM Item GROUP BY list_id;