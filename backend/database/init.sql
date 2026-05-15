-- Create Database if not exists
-- Run this in your MySQL Workbench or terminal
CREATE DATABASE IF NOT EXISTS gatepass;
USE gatepass;

-- The tables will be created automatically by the Spring Boot application on the first run.
-- You can use these insert statements to add sample data.
-- All passwords below are: password123

INSERT INTO users (roll_no, name, password, role, department, student_year, hostel, room_no, parent_phone, created_at, updated_at)
VALUES ('root', 'Root User', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'STUDENT', 'CSE', 'THIRD', 'BH1', '101', '9876543210', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, department, created_at, updated_at)
VALUES ('ADV001', 'Dr. Sarah Wilson', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'ADVISOR', 'CSE', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, department, created_at, updated_at)
VALUES ('HOD001', 'Dr. Michael Chen', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'HOD', 'CSE', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, hostel, created_at, updated_at)
VALUES ('WAR001', 'Dr. Mary Johnson', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'WARDEN', 'BH1', NOW(), NOW());
