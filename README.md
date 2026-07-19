# 📈 SB Stocks – Full Stack Paper Trading Platform

A full-stack stock market simulation platform that enables users to practice trading with virtual funds in a realistic market environment. Users can buy and sell stocks, track portfolio performance, analyze market trends, manage transactions, and gain hands-on trading experience through an interactive dashboard.

## 🌐 Live Demo

**Frontend:** https://sb-stocks-sigma.vercel.app

**Backend API:** https://sb-stocks-production.up.railway.app

---

# 🚀 Key Features

## 👤 User Features

* Secure User Registration & Login
* JWT Authentication & Protected Routes
* Password Encryption using Bcrypt
* Virtual Wallet Management
* Deposit & Withdrawal Simulator
* Buy & Sell Stock Orders
* Portfolio Tracking
* Transaction History
* Watchlist Management
* Interactive Dashboard
* Real-Time Stock Price Simulation
* Historical Price Visualization

## 📊 Market Simulation

* Dynamic Stock Price Fluctuations
* Multiple US Stock Listings
* Historical Price Tracking
* Live Market Updates
* Portfolio Valuation Monitoring
* Profit & Loss Analysis

## 🔐 Security

* JWT-Based Authentication
* Protected API Routes
* Secure Password Hashing
* Role-Based Authorization
* Secure User Session Management

## 🛠️ Admin Features

* User Management
* Order Monitoring
* Transaction Tracking
* Stock Management
* Administrative Analytics Dashboard

---

# 🏗️ Technology Stack

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Chart.js
* React Toastify
* Context API
* CSS3

## Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt.js

## Database

* MongoDB Atlas
* Mongoose ODM

## Deployment

* Frontend: Vercel
* Backend: Railway
* Database: MongoDB Atlas

---

# 📂 Project Structure

```bash
sb-stocks/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── verify_server.js
│
└── README.md
```

---

# 📸 Application Modules

### Landing Page

* Platform Introduction
* Feature Overview

### Authentication

* User Registration
* User Login
* Secure Access Control

### Dashboard

* Market Overview
* Trending Stocks
* Watchlist
* Portfolio Summary

### Stock Details

* Real-Time Price Data
* Historical Performance Charts
* Market Statistics

### Trading Interface

* Buy Orders
* Sell Orders
* Order Processing

### Portfolio Management

* Holdings Overview
* Profit & Loss Tracking
* Portfolio Valuation

### Transactions

* Deposit Funds
* Withdraw Funds
* Transaction History

### Admin Dashboard

* User Management
* Order Monitoring
* Transaction Analytics

---

# ⚡ Installation & Setup

## Prerequisites

* Node.js (v16 or above)
* MongoDB Atlas Account (or Local MongoDB)
* Git

## Clone Repository

```bash
git clone https://github.com/IllaVenkatesh/sb-stocks.git
cd sb-stocks
```

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:

```bash
npm run dev
```

Server URL:

```bash
http://localhost:5000
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend URL:

```bash
http://localhost:3000
```

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/users/register
POST /api/users/login
```

## Stocks

```http
GET /api/stocks/list
GET /api/stocks/trending
GET /api/stocks/:symbol
```

## Orders

```http
POST /api/orders/buy
POST /api/orders/sell
GET /api/orders/history
```

## Transactions

```http
GET /api/transactions
POST /api/transactions/deposit
POST /api/transactions/withdraw
```

---

# 📈 Future Enhancements

* Real Stock Market API Integration
* Candlestick Chart Support
* AI-Based Stock Recommendations
* Advanced Portfolio Analytics
* Email Notifications
* Multi-Currency Support
* Watchlist Personalization
* Dark Mode
* Mobile Application

---

# 👨‍💻 Developer

**Venkatesh Illa**

GitHub: https://github.com/IllaVenkatesh

LinkedIn: https://www.linkedin.com/in/illa-venkatesh/

---

# ⭐ Project Highlights

* Full-Stack MERN Application
* JWT Authentication & Authorization
* MongoDB Atlas Integration
* Railway Backend Deployment
* Vercel Frontend Deployment
* Responsive User Interface
* Real-Time Stock Market Simulation Engine
* Portfolio & Transaction Management System
