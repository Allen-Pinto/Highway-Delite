# 🚀 Highway Delite - Premium Experience Booking Platform

> A modern, full-stack booking platform for curating and booking premium travel experiences across India.

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)](https://highway-delite.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Live-blue?style=for-the-badge)](https://highway-delite-kehn.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 📖 Table of Contents

- [Live Demo](#-live-demo)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Live Demo

### Frontend (Vercel)
🔗 **Live Application:** [https://highway-delite.vercel.app](https://highway-delite.vercel.app)

### Backend (Render)
🔗 **API Base URL:** [https://highway-delite-kehn.onrender.com/api](https://highway-delite-kehn.onrender.com/api)

### API Health Check
```bash
curl https://highway-delite-kehn.onrender.com/api/health
```

---

## 🎯 Overview

**Highway Delite** is a production-ready booking platform showcasing India's most thrilling travel experiences. From river rafting in Rishikesh to houseboat cruises in Kerala, users can explore, book, and manage premium adventures with a seamless, professional experience.

**Production Features:**
- ✅ **Fully Deployed** - Frontend on Vercel, Backend on Render
- ✅ **Production Database** - MongoDB Atlas with 25+ experiences
- ✅ **Real Email Notifications** - Gmail SMTP integration
- ✅ **Professional UI/UX** - Smooth animations and responsive design
- ✅ **Secure & Scalable** - Rate limiting, CORS, and error handling

---

## ✨ Features

### 🎨 Frontend Excellence
- **Modern Landing Page** with gradient animations and 3D effects
- **Interactive Dashboard** with 25+ curated Indian experiences
- **Advanced Search & Filters** by category, location, and price range
- **Real-time Slot Management** with availability tracking
- **Dynamic Pricing** with promo code validation
- **Smooth Booking Flow** with step-by-step guidance
- **Mobile-First Responsive** design for all devices
- **Professional Animations** using Framer Motion

### ⚙️ Backend Reliability
- **RESTful API** with comprehensive endpoints
- **MongoDB Transactions** for booking integrity
- **Slot Management** with concurrent booking prevention
- **Promo Code System** with category-specific discounts
- **Email Notifications** for booking confirmations
- **Rate Limiting** and security middleware
- **Production-Ready** error handling and logging

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI library with hooks |
| **TypeScript** | Type safety and developer experience |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Smooth animations and transitions |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API communication |
| **React Hot Toast** | User notifications and feedback |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **TypeScript** | Type-safe backend development |
| **MongoDB** | NoSQL database for flexible data |
| **Mongoose** | MongoDB object modeling |
| **Nodemailer** | Email service integration |
| **Helmet** | Security middleware |
| **CORS** | Cross-origin resource sharing |

### Deployment & Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting and CDN |
| **Render** | Backend hosting and API deployment |
| **MongoDB Atlas** | Cloud database service |
| **Gmail SMTP** | Transactional email service |

---

## 🏗️ Architecture

```
┌─────────────────┐    REST API    ┌─────────────────┐    ┌─────────────────┐
│   React App     │ ◄───────────── │  Express API    │ ◄──│   MongoDB       │
│  (Vercel)       │    Axios       │  (Render)       │    │   Atlas         │
└─────────────────┘                └─────────────────┘    └─────────────────┘
         │                                │
         │                                │
         ▼                                ▼
┌─────────────────┐                ┌─────────────────┐
│   Tailwind CSS  │                │   Mongoose      │
│   Framer Motion │                │   Models        │
└─────────────────┘                └─────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Allen-Pinto/Highway-Delite.git
cd Highway-Delite
```

2. **Backend Setup**
```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Seed the database
npm run seed

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

---

## 📡 API Documentation

### Base URL
```
https://highway-delite-kehn.onrender.com/api
```

### Key Endpoints

#### Experiences
```http
GET    /api/experiences          # Get all experiences
GET    /api/experiences/:id      # Get specific experience
GET    /api/experiences/:id/slots # Get available slots
```

#### Bookings
```http
POST   /api/bookings             # Create new booking
GET    /api/bookings/:id         # Get booking details
PUT    /api/bookings/:id/cancel  # Cancel booking
```

#### Promo Codes
```http
POST   /api/promo/validate       # Validate promo code
GET    /api/promo/active         # Get active promo codes
```

#### Admin
```http
POST   /api/admin/seed           # Seed database (production)
GET    /api/admin/health         # Admin health check
```

### Example API Call
```bash
# Get all experiences
curl https://highway-delite-kehn.onrender.com/api/experiences

# Test health endpoint
curl https://highway-delite-kehn.onrender.com/api/health
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://highway-delite-kehn.onrender.com/api`
3. Automatic deployments on git push

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Configure environment variables

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Update connection string in environment variables

---

## 📂 Project Structure

```
Highway-Delite/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express TypeScript API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── seed.ts          # Database seeder
│   └── package.json
└── README.md
```

---

## 🌟 Key Features

### 🎯 Curated Experience Collection
- **25 Premium Experiences** across India
- **Multiple Categories**: Adventure, Trekking, Beach, Cruise, Trail
- **Regional Diversity**: South India, North India, West & East India
- **Professional Photography** from Unsplash

### 💰 Smart Pricing & Promotions
- **Dynamic Pricing** based on demand and availability
- **Promo Code System** with various discount types
- **Category-Specific Discounts** (Adventure, Beach, etc.)
- **First-Time User Bonuses**

### 📧 Professional Communication
- **Booking Confirmations** via email
- **Real-time Availability** updates
- **Reference ID Tracking** for all bookings
- **Professional Email Templates**

### 🛡️ Production Reliability
- **Error Boundaries** for graceful failure
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for security
- **Comprehensive Logging**

---

## 📸 Application Flow

1. **Landing Page** → Engaging introduction with statistics
2. **Dashboard** → Browse experiences with search and filters
3. **Experience Details** → View details, select dates & slots
4. **Checkout** → Enter details, apply promo codes
5. **Confirmation** → Receive booking confirmation and email

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Allen Pinto**
- 📧 Email: pinto.allen05@gmail.com
- 💼 LinkedIn: [Allen Pinto](https://linkedin.com/in/allen-pinto)
- 🐙 GitHub: [@Allen-Pinto](https://github.com/Allen-Pinto)

---

## 🙏 Acknowledgments

- **Unsplash** for high-quality experience images
- **Lucide React** for beautiful icons
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel & Render** for seamless deployment

---

<div align="center">

### ⭐ If you like this project, give it a star on GitHub!

**Built with ❤️ using Modern Web Technologies**

</div>
```
