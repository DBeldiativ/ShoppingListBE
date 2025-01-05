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
INSERT INTO User (username, email, password_hash) VALUES ('jiri_novak', 'jiri@mail.com', 'hash123');
INSERT INTO ShoppingList (list_name, owner_id) VALUES ('Weekly Groceries', 1);
INSERT INTO Item (item_name, list_id, is_completed) VALUES ('Milk', 1, FALSE);
INSERT INTO ListMember (list_id, user_id, role) VALUES (1, 1, 'owner');

-- Queries
-- 6. Insert new item into a list (all members)
INSERT INTO Item (item_name, list_id, is_completed)
VALUES ('Bread', 1, FALSE);

-- 7. Mark an item as completed (all members)
UPDATE Item
SET is_completed = TRUE
WHERE item_id = 2 AND list_id = 1;

-- 8. Delete an item from the list (all members)
DELETE FROM Item
WHERE item_id = 3 AND list_id = 1;

-- 9. Remove a member from the list (owner only)
DELETE FROM ListMember
WHERE user_id = 2 AND list_id = 1;
-- 1. Select items in a list
SELECT item_name, is_completed FROM Item WHERE list_id = 1;

-- 2. List all shopping lists with owner info
SELECT sl.list_name, u.username FROM ShoppingList sl
JOIN User u ON sl.owner_id = u.user_id;

-- 3. Aa- - 4. Subquery Example: List uncompleted items from lists owned by users with 'jiri' in their name
SELECT item_name FROM Item WHERE is_completed = FALSE AND list_id IN (
    SELECT list_id FROM ShoppingList WHERE owner_id IN (
        SELECT user_id FROM User WHERE username LIKE '%jiri%'
    )
);

-- 5. Subquery with Conditional Insert: Add a member only if they are not already in the list
INSERT INTO ListMember (list_id, user_id, role)
SELECT 1, user_id, 'member' FROM User
WHERE email = 'new_member@mail.com'
AND user_id NOT IN (
    SELECT user_id FROM ListMember WHERE list_id = 1
);