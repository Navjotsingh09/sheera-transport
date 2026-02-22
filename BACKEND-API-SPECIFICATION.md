# BACKEND API SPECIFICATION
## Seehra Transport - Delivery Management System

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Implementation

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack Recommendations](#technology-stack-recommendations)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Real-Time Features](#real-time-features)
7. [Third-Party Integrations](#third-party-integrations)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Deployment Checklist](#deployment-checklist)

---

## System Overview

### Architecture
```
Frontend (Static HTML/CSS/JS)
    ↓
API Gateway / Load Balancer
    ↓
Backend API Server(s)
    ↓
├── Database (PostgreSQL/MySQL)
├── Redis Cache
├── File Storage (S3/Cloud Storage)
└── WebSocket Server (Real-time)
```

### Key Features
- **Customer Portal**: Registration, login, order booking, tracking
- **Staff Dashboard**: Order management, driver assignment, real-time monitoring
- **Real-Time Tracking**: Live order status updates via WebSocket
- **Payment Processing**: Integration with Stripe/PayPal
- **Notifications**: Email (SendGrid) + SMS (Twilio)
- **Analytics**: Order statistics, driver performance, revenue tracking

---

## Technology Stack Recommendations

### Backend Framework Options
1. **Node.js + Express** (Recommended for real-time features)
   - Easy WebSocket integration
   - JavaScript throughout stack
   - Large ecosystem
   
2. **Python + FastAPI/Django**
   - Excellent for data analytics
   - Strong ML capabilities for route optimization
   - Django has built-in admin panel
   
3. **PHP + Laravel**
   - Mature ecosystem
   - Good for traditional web apps
   - Excellent ORM (Eloquent)

### Database
- **Primary**: PostgreSQL (recommended) or MySQL
- **Cache**: Redis
- **Search**: Elasticsearch (optional, for advanced search)

### Infrastructure
- **Hosting**: AWS, Google Cloud, or Azure
- **Static Files**: Vercel (frontend) + CDN
- **File Storage**: AWS S3 or Cloudinary
- **Email**: SendGrid or AWS SES
- **SMS**: Twilio
- **Payments**: Stripe or PayPal

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(200),
    role ENUM('customer', 'admin', 'dispatcher', 'driver') DEFAULT 'customer',
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    
    -- Collection Details
    collection_name VARCHAR(200) NOT NULL,
    collection_phone VARCHAR(20) NOT NULL,
    collection_email VARCHAR(255),
    collection_address TEXT NOT NULL,
    collection_city VARCHAR(100),
    collection_postcode VARCHAR(20),
    collection_date DATE NOT NULL,
    collection_time_start TIME,
    collection_time_end TIME,
    collection_instructions TEXT,
    
    -- Delivery Details
    delivery_name VARCHAR(200) NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_email VARCHAR(255),
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100),
    delivery_postcode VARCHAR(20),
    delivery_instructions TEXT,
    
    -- Package Details
    package_contents VARCHAR(500),
    package_value DECIMAL(10, 2),
    package_weight DECIMAL(10, 2),
    package_length DECIMAL(10, 2),
    package_width DECIMAL(10, 2),
    package_height DECIMAL(10, 2),
    package_fragile BOOLEAN DEFAULT FALSE,
    
    -- Service & Pricing
    service_type ENUM('standard', 'next-day', 'same-day', 'express') DEFAULT 'standard',
    base_price DECIMAL(10, 2) NOT NULL,
    insurance_cost DECIMAL(10, 2) DEFAULT 0.00,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Payment
    payment_method ENUM('card', 'paypal', 'account', 'cash') DEFAULT 'card',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_transaction_id VARCHAR(255),
    
    -- Status & Assignment
    status ENUM('pending', 'confirmed', 'assigned', 'collected', 'in-transit', 'out-for-delivery', 'delivered', 'failed', 'cancelled') DEFAULT 'pending',
    assigned_driver_id INT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    collected_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_driver_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_status (status),
    INDEX idx_collection_date (collection_date),
    INDEX idx_assigned_driver (assigned_driver_id),
    INDEX idx_created_at (created_at)
);
```

### Order Status History Table
```sql
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    updated_by_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_created_at (created_at)
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('van', 'truck', 'lorry', 'bike') DEFAULT 'van',
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    capacity_kg DECIMAL(10, 2),
    capacity_m3 DECIMAL(10, 2),
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    current_driver_id INT,
    last_service_date DATE,
    next_service_date DATE,
    insurance_expiry DATE,
    mot_expiry DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (current_driver_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_registration (registration_number),
    INDEX idx_status (status)
);
```

### Driver Locations Table (Real-time tracking)
```sql
CREATE TABLE driver_locations (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    accuracy DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_driver (driver_id),
    INDEX idx_timestamp (timestamp)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT,
    type ENUM('email', 'sms', 'push', 'in-app') NOT NULL,
    title VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_order (order_id),
    INDEX idx_status (status),
    INDEX idx_read_at (read_at)
);
```

### Payment Transactions Table
```sql
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    payment_method ENUM('card', 'paypal', 'account', 'cash') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GBP',
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    provider_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_transaction (transaction_id),
    INDEX idx_status (status)
);
```

### Driver Shifts Table
```sql
CREATE TABLE driver_shifts (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status ENUM('active', 'break', 'ended') DEFAULT 'active',
    total_orders INT DEFAULT 0,
    total_distance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_driver (driver_id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
);
```

### System Settings Table
```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key)
);
```

---

## API Endpoints

### Base URL
```
Production: https://api.seehratransport.co.uk/v1
Development: http://localhost:3000/api/v1
```

### Authentication Endpoints

#### POST /auth/register
Register a new customer account.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+44 7700 900000",
  "companyName": "ABC Corp" // optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": 123,
    "email": "customer@example.com",
    "verificationSent": true
  }
}
```

#### POST /auth/verify-email
Verify email address with token.

**Request Body:**
```json
{
  "token": "abc123xyz789"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### POST /auth/login
Login to customer/staff account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "rememberMe": true // optional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": 123,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "customer",
      "roles": ["customer"] // for staff with multiple roles
    }
  }
}
```

#### POST /auth/refresh-token
Refresh expired access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

#### POST /auth/logout
Logout (invalidate token).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Order Endpoints

#### POST /orders
Create a new order.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "collection": {
    "name": "John Smith",
    "phone": "+44 7700 900000",
    "email": "john@example.com",
    "address": "123 Collection Street",
    "city": "London",
    "postcode": "E1 7AA",
    "date": "2024-12-25",
    "timeStart": "09:00",
    "timeEnd": "12:00",
    "instructions": "Ring doorbell twice"
  },
  "delivery": {
    "name": "Jane Doe",
    "phone": "+44 7700 900001",
    "email": "jane@example.com",
    "address": "456 Delivery Avenue",
    "city": "Manchester",
    "postcode": "M1 1AA",
    "instructions": "Leave with neighbor if not home"
  },
  "package": {
    "contents": "Electronics",
    "value": 500.00,
    "weight": 5.2,
    "length": 40,
    "width": 30,
    "height": 20,
    "fragile": true
  },
  "serviceType": "standard",
  "paymentMethod": "card"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": 456,
    "orderNumber": "BK-20241220-1001",
    "trackingNumber": "ST1734701234GB",
    "status": "pending",
    "pricing": {
      "basePrice": 85.00,
      "insuranceCost": 10.00,
      "totalPrice": 95.00
    },
    "paymentUrl": "https://checkout.stripe.com/..." // for card payments
  }
}
```

#### GET /orders
Get all orders for current user (customer shows their orders, staff shows all).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?page=1
&limit=20
&status=in-transit
&sortBy=created_at
&sortOrder=desc
&search=BK-20241220
&dateFrom=2024-12-01
&dateTo=2024-12-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 456,
        "orderNumber": "BK-20241220-1001",
        "trackingNumber": "ST1734701234GB",
        "collectionCity": "London",
        "deliveryCity": "Manchester",
        "serviceType": "standard",
        "status": "in-transit",
        "totalPrice": 95.00,
        "createdAt": "2024-12-20T10:30:00Z",
        "collectionDate": "2024-12-25"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 324,
      "totalPages": 17
    }
  }
}
```

#### GET /orders/:id
Get single order details.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "orderNumber": "BK-20241220-1001",
    "trackingNumber": "ST1734701234GB",
    "status": "in-transit",
    "collection": {
      "name": "John Smith",
      "phone": "+44 7700 900000",
      "address": "123 Collection Street, London, E1 7AA",
      "date": "2024-12-25",
      "timeWindow": "09:00-12:00"
    },
    "delivery": {
      "name": "Jane Doe",
      "phone": "+44 7700 900001",
      "address": "456 Delivery Avenue, Manchester, M1 1AA"
    },
    "package": {
      "contents": "Electronics",
      "value": 500.00,
      "weight": 5.2,
      "dimensions": "40x30x20 cm",
      "fragile": true
    },
    "serviceType": "standard",
    "pricing": {
      "basePrice": 85.00,
      "insuranceCost": 10.00,
      "totalPrice": 95.00
    },
    "payment": {
      "method": "card",
      "status": "paid",
      "transactionId": "txn_abc123"
    },
    "assignedDriver": {
      "id": 789,
      "name": "Mike Williams",
      "phone": "+44 7700 900002",
      "vehicle": "VAN-123"
    },
    "statusHistory": [
      {
        "status": "pending",
        "description": "Order created",
        "timestamp": "2024-12-20T10:30:00Z"
      },
      {
        "status": "confirmed",
        "description": "Payment confirmed",
        "timestamp": "2024-12-20T10:31:00Z"
      },
      {
        "status": "assigned",
        "description": "Assigned to Mike Williams",
        "updatedBy": "Dispatcher Sarah",
        "timestamp": "2024-12-20T14:00:00Z"
      },
      {
        "status": "in-transit",
        "description": "Package in transit to destination",
        "location": "M6 Motorway",
        "timestamp": "2024-12-21T09:15:00Z"
      }
    ],
    "createdAt": "2024-12-20T10:30:00Z",
    "updatedAt": "2024-12-21T09:15:00Z"
  }
}
```

#### PATCH /orders/:id
Update order details (admin/dispatcher only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "status": "assigned",
  "assignedDriverId": 789,
  "collection": {
    "instructions": "Updated instructions"
  },
  "delivery": {
    "phone": "+44 7700 999999"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "orderId": 456,
    "updatedFields": ["status", "assignedDriverId"]
  }
}
```

#### DELETE /orders/:id
Cancel an order.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

#### POST /orders/:id/assign-driver
Assign driver to order (admin/dispatcher only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "driverId": 789
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Driver assigned successfully",
  "data": {
    "orderId": 456,
    "driver": {
      "id": 789,
      "name": "Mike Williams",
      "vehicle": "VAN-123"
    }
  }
}
```

#### POST /orders/:id/update-status
Update order status.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "delivered",
  "description": "Package delivered successfully",
  "location": "456 Delivery Avenue, Manchester",
  "latitude": 53.4808,
  "longitude": -2.2426,
  "proofOfDelivery": "signature_image_url_or_base64"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Status updated successfully"
}
```

---

### Tracking Endpoints

#### GET /tracking/:trackingNumber
Track order by tracking number (public endpoint).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trackingNumber": "ST1734701234GB",
    "status": "in-transit",
    "estimatedDelivery": "2024-12-25",
    "currentLocation": "M6 Motorway, near Birmingham",
    "statusHistory": [
      {
        "status": "pending",
        "description": "Order received",
        "timestamp": "2024-12-20T10:30:00Z"
      },
      {
        "status": "collected",
        "description": "Package collected from sender",
        "location": "London",
        "timestamp": "2024-12-21T08:00:00Z"
      },
      {
        "status": "in-transit",
        "description": "Package in transit",
        "location": "M6 Motorway",
        "timestamp": "2024-12-21T09:15:00Z"
      }
    ]
  }
}
```

#### GET /tracking/:trackingNumber/location
Get real-time driver location for order.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "driver": {
      "name": "Mike Williams",
      "vehicle": "VAN-123"
    },
    "location": {
      "latitude": 53.4808,
      "longitude": -2.2426,
      "accuracy": 10.5,
      "speed": 55.2,
      "heading": 180,
      "timestamp": "2024-12-21T09:30:00Z"
    },
    "estimatedArrival": "2024-12-21T12:45:00Z"
  }
}
```

---

### Driver Endpoints

#### GET /drivers
Get all drivers (admin/dispatcher only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?status=active
&available=true
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "id": 789,
        "name": "Mike Williams",
        "email": "mike@seehratransport.co.uk",
        "phone": "+44 7700 900002",
        "vehicle": {
          "id": 12,
          "registration": "VAN-123",
          "type": "van"
        },
        "status": "active",
        "currentShift": {
          "startTime": "2024-12-21T08:00:00Z",
          "totalOrders": 8,
          "totalDistance": 145.2
        },
        "currentLocation": {
          "latitude": 53.4808,
          "longitude": -2.2426,
          "timestamp": "2024-12-21T09:30:00Z"
        },
        "assignedOrders": 5
      }
    ]
  }
}
```

#### POST /drivers/:id/shift/start
Start driver shift.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shift started",
  "data": {
    "shiftId": 1234,
    "startTime": "2024-12-21T08:00:00Z"
  }
}
```

#### POST /drivers/:id/shift/end
End driver shift.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shift ended",
  "data": {
    "shiftId": 1234,
    "startTime": "2024-12-21T08:00:00Z",
    "endTime": "2024-12-21T18:00:00Z",
    "totalOrders": 15,
    "totalDistance": 245.7
  }
}
```

#### POST /drivers/:id/location
Update driver location (real-time tracking).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 53.4808,
  "longitude": -2.2426,
  "speed": 55.2,
  "heading": 180,
  "accuracy": 10.5,
  "timestamp": "2024-12-21T09:30:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Location updated"
}
```

---

### Payment Endpoints

#### POST /payments/create-intent
Create payment intent for Stripe.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": 456,
  "amount": 95.00,
  "currency": "GBP"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_abc123_secret_xyz789",
    "publishableKey": "pk_test_abc123"
  }
}
```

#### POST /payments/webhook
Stripe webhook handler (handles payment confirmation).

**Headers:**
```
Stripe-Signature: signature_here
Content-Type: application/json
```

**Request Body:** (sent by Stripe)
```json
{
  "id": "evt_abc123",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_abc123",
      "amount": 9500,
      "currency": "gbp",
      "metadata": {
        "orderId": "456"
      }
    }
  }
}
```

**Response (200 OK):**
```json
{
  "received": true
}
```

#### POST /payments/paypal/create
Create PayPal payment.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": 456,
  "amount": 95.00,
  "currency": "GBP",
  "returnUrl": "https://seehratransport.co.uk/confirmation.html",
  "cancelUrl": "https://seehratransport.co.uk/booking.html"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentId": "PAYID-ABC123",
    "approvalUrl": "https://www.paypal.com/checkoutnow?token=EC-ABC123"
  }
}
```

#### POST /payments/paypal/execute
Execute PayPal payment after approval.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "PAYID-ABC123",
  "payerId": "PAYER123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment completed",
  "data": {
    "transactionId": "txn_paypal_abc123"
  }
}
```

---

### Quote/Pricing Endpoints

#### POST /quote
Calculate delivery quote.

**Request Body (no auth required):**
```json
{
  "collectionPostcode": "E1 7AA",
  "deliveryPostcode": "M1 1AA",
  "serviceType": "standard",
  "packageWeight": 5.2,
  "packageValue": 500.00,
  "collectionDate": "2024-12-25"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "basePrice": 85.00,
    "insuranceCost": 10.00,
    "totalPrice": 95.00,
    "distance": 320.5,
    "estimatedDuration": "4-5 hours",
    "availableServices": [
      {
        "type": "standard",
        "price": 85.00,
        "delivery": "2-3 business days"
      },
      {
        "type": "next-day",
        "price": 120.00,
        "delivery": "Next business day"
      },
      {
        "type": "same-day",
        "price": 180.00,
        "delivery": "Same day (if booked before 10am)"
      }
    ]
  }
}
```

---

### Dashboard/Analytics Endpoints

#### GET /dashboard/stats
Get dashboard statistics (admin/dispatcher only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?period=today|week|month|year
&dateFrom=2024-12-01
&dateTo=2024-12-31
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 324,
    "completedOrders": 287,
    "pendingOrders": 37,
    "cancelledOrders": 15,
    "totalRevenue": 28450.00,
    "averageOrderValue": 87.80,
    "averageDeliveryTime": 2.4,
    "activeDrivers": 24,
    "totalDrivers": 28,
    "ordersToday": 42,
    "revenueToday": 3680.00,
    "ordersByStatus": {
      "pending": 12,
      "in-transit": 18,
      "delivered": 8,
      "cancelled": 4
    },
    "ordersByService": {
      "standard": 180,
      "next-day": 95,
      "same-day": 49
    }
  }
}
```

#### GET /dashboard/recent-orders
Get recent orders for dashboard.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      // ... array of orders (same format as GET /orders)
    ]
  }
}
```

---

### User Management Endpoints

#### GET /users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+44 7700 900000",
    "companyName": "ABC Corp",
    "role": "customer",
    "emailVerified": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PATCH /users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+44 7700 900000",
  "companyName": "ABC Corp Ltd"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### POST /users/change-password
Change password.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Authentication & Authorization

### JWT Token Structure
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": 123,
  "email": "user@example.com",
  "role": "customer",
  "iat": 1640000000,
  "exp": 1640086400
}
```

### Role-Based Access Control (RBAC)

**Roles:**
- `customer` - Can create orders, view own orders, track deliveries
- `driver` - Can view assigned orders, update order status, update location
- `dispatcher` - Can view all orders, assign drivers, update order details
- `admin` - Full access to all resources

**Permission Matrix:**

| Endpoint              | Customer | Driver | Dispatcher | Admin |
|-----------------------|----------|--------|------------|-------|
| POST /orders          | ✓        | ✗      | ✓          | ✓     |
| GET /orders (own)     | ✓        | ✓      | ✓          | ✓     |
| GET /orders (all)     | ✗        | ✗      | ✓          | ✓     |
| PATCH /orders/:id     | ✗        | ✗      | ✓          | ✓     |
| DELETE /orders/:id    | ✗        | ✗      | ✗          | ✓     |
| POST /orders/:id/assign-driver | ✗ | ✗ | ✓        | ✓     |
| POST /orders/:id/update-status | ✗ | ✓ | ✓         | ✓     |
| GET /drivers          | ✗        | ✗      | ✓          | ✓     |
| POST /drivers/:id/location | ✗   | ✓      | ✗          | ✗     |
| GET /dashboard/stats  | ✗        | ✗      | ✓          | ✓     |

---

## Real-Time Features

### WebSocket Connection

**Connection URL:**
```
wss://api.seehratransport.co.uk/ws
```

**Authentication:**
```javascript
const socket = new WebSocket('wss://api.seehratransport.co.uk/ws');

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'authenticate',
    token: 'Bearer jwt_token_here'
  }));
};
```

### Event Types

#### Client → Server Events

**Subscribe to Order Updates:**
```json
{
  "type": "subscribe",
  "channel": "order",
  "orderId": 456
}
```

**Subscribe to Driver Location:**
```json
{
  "type": "subscribe",
  "channel": "driver_location",
  "driverId": 789
}
```

**Update Driver Location (Driver clients):**
```json
{
  "type": "location_update",
  "latitude": 53.4808,
  "longitude": -2.2426,
  "speed": 55.2,
  "heading": 180,
  "accuracy": 10.5
}
```

#### Server → Client Events

**Order Status Update:**
```json
{
  "type": "order_status",
  "orderId": 456,
  "status": "in-transit",
  "description": "Package in transit",
  "location": "M6 Motorway",
  "timestamp": "2024-12-21T09:30:00Z"
}
```

**Driver Location Update:**
```json
{
  "type": "driver_location",
  "driverId": 789,
  "orderId": 456,
  "latitude": 53.4808,
  "longitude": -2.2426,
  "speed": 55.2,
  "heading": 180,
  "timestamp": "2024-12-21T09:30:00Z"
}
```

**New Order Alert (Dispatcher dashboard):**
```json
{
  "type": "new_order",
  "order": {
    "id": 457,
    "orderNumber": "BK-20241221-1002",
    "collectionCity": "Birmingham",
    "deliveryCity": "Leeds",
    "serviceType": "next-day",
    "totalPrice": 120.00
  }
}
```

---

## Third-Party Integrations

### Email Service (SendGrid)

**Configuration:**
```env
SENDGRID_API_KEY=SG.abc123xyz789
SENDGRID_FROM_EMAIL=noreply@seehratransport.co.uk
SENDGRID_FROM_NAME=Seehra Transport
```

**Email Templates:**
1. **Order Confirmation** - Sent when order is created
2. **Payment Receipt** - Sent when payment is confirmed
3. **Order Assigned** - Sent when driver is assigned
4. **Out for Delivery** - Sent when order is out for delivery
5. **Delivered** - Sent when order is delivered
6. **Email Verification** - Sent on registration
7. **Password Reset** - Sent on password reset request

### SMS Service (Twilio)

**Configuration:**
```env
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+441234567890
```

**SMS Notifications:**
1. Order confirmation with tracking number
2. Driver assigned notification
3. Out for delivery alert
4. Delivery confirmation

### Payment Gateway (Stripe)

**Configuration:**
```env
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Webhook Events:**
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

### Google Maps API

**Configuration:**
```env
GOOGLE_MAPS_API_KEY=AIzaXXX
```

**Usage:**
- Distance and duration calculation
- Address geocoding
- Route optimization
- Real-time traffic data

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "phone",
        "message": "Phone number format is invalid"
      }
    ]
  }
}
```

### Error Codes

| HTTP Status | Error Code              | Description                      |
|-------------|-------------------------|----------------------------------|
| 400         | VALIDATION_ERROR        | Invalid request data             |
| 401         | UNAUTHORIZED            | Authentication required          |
| 401         | INVALID_TOKEN           | JWT token is invalid/expired     |
| 403         | FORBIDDEN               | Insufficient permissions         |
| 404         | NOT_FOUND               | Resource not found               |
| 409         | CONFLICT                | Resource already exists          |
| 429         | RATE_LIMIT_EXCEEDED     | Too many requests                |
| 500         | INTERNAL_SERVER_ERROR   | Server error                     |
| 503         | SERVICE_UNAVAILABLE     | Service temporarily unavailable  |

---

## Security Considerations

### 1. Password Security
- Minimum 8 characters
- Require uppercase, lowercase, number, special character
- Hash with bcrypt (cost factor: 12)
- Implement password history (prevent reuse of last 5 passwords)

### 2. JWT Security
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (30 days)
- Store refresh tokens in database
- Implement token blacklist for logout
- Rotate secrets regularly

### 3. API Rate Limiting
```
Per IP:
- Authentication endpoints: 5 requests/minute
- Order creation: 10 requests/minute
- General API: 100 requests/minute

Per User:
- Order creation: 20 orders/hour
- API calls: 1000 requests/hour
```

### 4. Data Validation
- Validate all input data
- Sanitize user input
- Use parameterized queries (prevent SQL injection)
- Implement CORS properly
- Use HTTPS only

### 5. PCI DSS Compliance
- Never store full card details
- Use Stripe/PayPal for payment processing
- Log all payment transactions
- Implement fraud detection

### 6. GDPR Compliance
- Obtain consent for data processing
- Implement right to erasure
- Data portability (export user data)
- Data breach notification (within 72 hours)
- Privacy policy and terms of service

---

## Deployment Checklist

### Environment Variables
```env
# Server
NODE_ENV=production
PORT=3000
API_URL=https://api.seehratransport.co.uk

# Database
DB_HOST=db.server.com
DB_PORT=5432
DB_NAME=seehra_transport
DB_USER=dbuser
DB_PASSWORD=secure_password_here

# Redis
REDIS_HOST=redis.server.com
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here

# JWT
JWT_SECRET=very_long_random_secret_key_here
JWT_REFRESH_SECRET=another_long_random_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@seehratransport.co.uk
SENDGRID_FROM_NAME=Seehra Transport

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+441234567890

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_MODE=live

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaXXX

# AWS S3
AWS_ACCESS_KEY_ID=AKIAXXXX
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=seehra-transport-uploads
AWS_S3_REGION=eu-west-2

# Frontend URL
FRONTEND_URL=https://seehratransport.co.uk

# CORS
CORS_ORIGIN=https://seehratransport.co.uk
```

### Pre-Deployment Steps
1. ✅ Set up production database
2. ✅ Run database migrations
3. ✅ Seed initial data (admin user, settings)
4. ✅ Configure environment variables
5. ✅ Set up SSL certificates
6. ✅ Configure CDN for static assets
7. ✅ Set up monitoring (Sentry, New Relic, etc.)
8. ✅ Configure log aggregation
9. ✅ Set up automated backups
10. ✅ Configure CI/CD pipeline

### Post-Deployment Steps
1. ✅ Test all API endpoints
2. ✅ Verify WebSocket connections
3. ✅ Test payment integrations
4. ✅ Verify email/SMS delivery
5. ✅ Load testing
6. ✅ Security audit
7. ✅ Set up monitoring alerts
8. ✅ Document API for frontend team

---

## Implementation Priority

### Phase 1: Core Features (Week 1-2)
1. User authentication (register, login, JWT)
2. Order creation and management
3. Basic order tracking
4. Payment integration (Stripe)
5. Email notifications

### Phase 2: Staff Features (Week 3-4)
1. Admin/dispatcher dashboard
2. Driver management
3. Order assignment
4. Driver shift management
5. Basic analytics

### Phase 3: Real-Time Features (Week 5-6)
1. WebSocket implementation
2. Real-time order tracking
3. Live driver location updates
4. Real-time dashboard updates
5. SMS notifications

### Phase 4: Advanced Features (Week 7-8)
1. Route optimization
2. Advanced analytics and reports
3. Proof of delivery
4. Driver mobile app API
5. Customer ratings and feedback

---

## Support & Contact

For backend implementation questions:
- **Email**: dev@seehratransport.co.uk
- **Documentation**: https://docs.seehratransport.co.uk
- **API Status**: https://status.seehratransport.co.uk

---

**End of Backend API Specification**
