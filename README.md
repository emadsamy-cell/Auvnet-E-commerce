# AUVNET Ecommerce

## Overview

AUVNET Ecommerce project is a mid- to large-scale system built using Node.js and MongoDB, designed to support multiple roles, including users, vendors, admins, and super admins. It features robust modules such as Product, Category, Collection, Coupon, Voucher, Review, Ads, Chat, Orders, Logs, and Notification. The project employs test-driven development with Jest and includes advanced functionalities like role-based access, filtering, and promotions. Deployed on AWS, it showcases a scalable and secure architecture tailored for modern e-commerce needs.

[![technologies](https://skillicons.dev/icons?i=nodejs,mongodb,git,github,postman,aws)](#backend)

## Table of Contents

- [Order Management System](#AUVNET-Ecommerce)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Schema Diagram for DB](#ERD-diagram-for-db)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Endpoints](#endpoints)
  - [Technology Stack](#technology-stack)
      - [Backend](#backend)
      - [Authentication](#Authentication)
      - [Validation](#Validation)
      - [Testing](#Testing)
      - [File_Management](#File_Management)
      - [Messaging](#Messaging)
      - [Security](#Security)
      - [Documentation](#documentation)
      - [Version Control](#version-control)
  - [How to Contribute](#how-to-contribute)

## [Schema Diagram for DB](https://drive.google.com/file/d/1VtA88Jorhjug6dyaPD1nqMWhF8NViY12/view?usp=sharing) 
![Database Design](https://github.com/user-attachments/assets/9b43d4b7-386e-4638-83bc-ddcad54315b4)


## Getting Started

### Prerequisites

Before getting started, ensure you have installed the following:

- Node.js and npm
- MongoDB

### Installation

1. Clone the repository: `$ git clone https://github.com/emadsamy-cell/Auvnet-E-commerce.git`
2. Install dependencies: `$ npm install`
3. Configure environment variables: Create a `.env` file in the root directory.
   - Copy the envExample.env file and rename it to .env in the root directory.
   - Fill in the required environment variables
4. Start the server:
      ```bash
    $ npm start
## Endpoints

You can check endpoints & documentation on Postman from [here](https://documenter.getpostman.com/view/40309622/2sAYJ1jMcB)

## Technology Stack

The **Auvnet-E-commerce** project utilizes the following technologies:

#### Backend

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building fast and scalable network applications.
- **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB:** A NoSQL database program that uses JSON-like documents with optional schemas, perfect for handling a flexible product catalog.
- **Redis:** An in-memory data store used for caching and real-time data processing.
  
#### Authentication

- **JWT:** A token-based authentication mechanism for securing APIs and user sessions.
- **OAuth2:** A standard protocol for secure third-party authentication and authorization.
- **bcrypt:** A library for hashing passwords securely.
  
#### Validation

- **Joi:** A validation library for ensuring data integrity in APIs.
  
#### Testing

- **Jest:** A JavaScript testing framework for ensuring code quality with test-driven development (TDD).

#### File_Management

- **Multer:** Middleware for handling file uploads in Node.js applications.
- **AWS S3 Bucket:** A cloud storage service for managing and delivering files efficiently.

#### Messaging

- **Nodemailer:** A module for sending emails with ease in Node.js.
- **UltraMsg** A platform for integrating WhatsApp-based communication into applications.

#### Security

- **CORS:** Middleware for managing cross-origin resource sharing securely.
- **Access Tokens** Short-lived tokens used for authenticating API requests.
- **Refresh Tokens** Long-lived tokens for renewing expired access tokens without re-login.

#### Documentation

- **Postman:** Used for documentation and to provide a collection for API requests.

#### Version Control

- **Git:** A distributed version control system.
- **GitHub:** A web-based platform for version control and collaboration.

## How to Contribute

If you'd like to contribute to the project or have suggestions for improvement, please do not hesitate to make pull request.
