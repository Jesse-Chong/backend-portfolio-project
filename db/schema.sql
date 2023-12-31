DROP DATABASE IF EXISTS priorities_db;
CREATE DATABASE priorities_db;
\c priorities_db;

CREATE TABLE checklist_tb (
    id SERIAL PRIMARY KEY,
    checklist_description TEXT NOT NULL,
    checklist_istrue BOOLEAN DEFAULT FALSE,
    todo_id INTEGER REFERENCES todo_tb(id)
    ON DELETE CASCADE
);

CREATE TABLE todo_tb (
    id SERIAL PRIMARY KEY,
    todo_title TEXT NOT NULL,
    todo_description VARCHAR NOT NULL, 
    todo_date DATE NOT NULL,
    todo_istrue BOOLEAN DEFAULT FALSE,
    todo_category VARCHAR
);