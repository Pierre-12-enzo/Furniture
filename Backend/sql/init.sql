// sql/init.sql
CREATE DATABASE IF NOT EXISTS tectona_inventory;
USE tectona_inventory;

CREATE TABLE Users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE Categories (
  categoryId INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE Products (
  productId INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  categoryId INT,
  price DECIMAL(10, 2) NOT NULL,
  minimumStock INT NOT NULL,
  imageUrl VARCHAR(255),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES Categories(categoryId)
);

CREATE TABLE Inventory (
  inventoryId INT AUTO_INCREMENT PRIMARY KEY,
  productId INT,
  quantity INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (productId) REFERENCES Products(productId)
);

CREATE TABLE StockMovements (
  movementId INT AUTO_INCREMENT PRIMARY KEY,
  productId INT,
  quantity INT NOT NULL,
  type ENUM('ADD', 'REMOVE') NOT NULL,
  notes TEXT,
  userId INT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (productId) REFERENCES Products(productId),
  FOREIGN KEY (userId) REFERENCES Users(userId)
);