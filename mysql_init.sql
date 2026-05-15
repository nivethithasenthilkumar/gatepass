-- Full MySQL Initialization Script for Gate Pass System
-- Run this in your MySQL Workbench or terminal

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS gatepass;
USE gatepass;

-- 2. Drop existing tables to ensure clean state (Optional)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS approvals;
DROP TABLE IF EXISTS scan_logs;
DROP TABLE IF EXISTS gate_passes;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Create 'users' table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(50),
    student_year VARCHAR(50),
    hostel VARCHAR(50),
    room_no VARCHAR(50),
    floor_no VARCHAR(50),
    parent_phone VARCHAR(10),
    photo LONGTEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- 4. Create 'gate_passes' table
CREATE TABLE gate_passes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    purpose TEXT NOT NULL,
    native_place VARCHAR(255) NOT NULL,
    out_date_time DATETIME NOT NULL,
    in_date_time DATETIME NOT NULL,
    pass_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    qr_code TEXT,
    scanned_out DATETIME,
    scanned_in DATETIME,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Create 'approvals' table
CREATE TABLE approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gate_pass_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    comment TEXT,
    FOREIGN KEY (gate_pass_id) REFERENCES gate_passes(id) ON DELETE CASCADE
);

-- 6. Create 'scan_logs' table
CREATE TABLE scan_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pass_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    security_id BIGINT NOT NULL
);

-- 7. Insert Sample Data
-- All passwords below are: password123 (BCrypt encoded)

INSERT INTO users (roll_no, name, password, role, department, student_year, hostel, room_no, parent_phone, created_at, updated_at)
VALUES ('root', 'Root User', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'STUDENT', 'CSE', 'THIRD', 'BH1', '101', '9876543210', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, department, created_at, updated_at)
VALUES ('ADV001', 'Dr. Sarah Wilson', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'ADVISOR', 'CSE', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, department, created_at, updated_at)
VALUES ('HOD001', 'Dr. Michael Chen', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'HOD', 'CSE', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, hostel, created_at, updated_at)
VALUES ('WAR001', 'Dr. Mary Johnson', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'WARDEN', 'BH1', NOW(), NOW());

INSERT INTO users (roll_no, name, password, role, created_at, updated_at)
VALUES ('SEC001', 'Security Guard 1', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqRzVHTYv6.pXvSQR0e7H.o.V8uO', 'SECURITY', NOW(), NOW());
