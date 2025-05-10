# JustHome Property Marketplace - Backend

JustHome is a marketplace that enables users to browse thousands of properties across various locations, list properties for sale or rent in just a few clicks, and filter listings based on location, price, type, and other criteria.

## 🚀 Features

- **Property CRUD Operations**: Add, update, delete, and retrieve property listings.
- **User Authentication**: Secure user registration, login, and token-based authentication using JWT.
- **Search & Filtering API**: Allows clients to query properties based on multiple filters such as location, price range, and type.

## 🛠️ Tech Stack

- **Node.js & Express.js**: For handling HTTP requests and routing.
- **MongoDB**: NoSQL database for storing user and property data.
- **Mongoose**: ODM (Object Data Modeling) library for interacting with MongoDB.
- **Docker**: Used to containerize the application for consistent deployment across environments.
- **GitHub Actions**: For implementing CI/CD workflows such as running tests, linting, and deploying the Docker image automatically.

## 📝 Postman Documentation

Explore API Documentation: [JustHome Property Marketplace - API Docs](https://documenter.getpostman.com/view/28117952/2sB2j98Unb)

## 🌐 Live Application

Explore the live project here: [JustHome Property Marketplace](https://just-home-property-marketplace.vercel.app/)

> **Note:** You may experience a slight delay on initially loading the api due to the Render free tier, which causes the server to sleep after inactivity.