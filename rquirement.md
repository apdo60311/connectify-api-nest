# Social Media Application Engineering Requirements Document

## Table of Contents

1. [Introduction](#introduction)
2. [Purpose](#purpose)
3. [Scope](#scope)
4. [Definitions](#definitions)
5. [System Overview](#system-overview)
6. [Functional Requirements](#functional-requirements)
    1. [User Management](#user-management)
    2. [Authentication and Authorization](#authentication-and-authorization)
    3. [Profile Management](#profile-management)
    4. [Post Management](#post-management)
    5. [Comment Management](#comment-management)
    6. [Notification System](#notification-system)
    7. [Messaging System](#messaging-system)
    8. [Admin and Moderation Tools](#admin-and-moderation-tools)
    9. [Privacy Settings](#privacy-settings)
7. [Non-Functional Requirements](#non-functional-requirements)
    1. [Performance](#performance)
    2. [Scalability](#scalability)
    3. [Security](#security)
    4. [Usability](#usability)
    5. [Maintainability](#maintainability)
8. [Technical Stack](#technical-stack)
9. [Database Design](#database-design)
10. [API Documentation](#api-documentation)
11. [Deployment](#deployment)

## Introduction

This document outlines the engineering requirements for **connectify** a social media application. The application will allow users to register, authenticate, manage profiles, create and interact with posts, comments, messages, notifications, and more. The application will follow Clean Architecture principles and utilize the Repository Pattern to ensure a scalable, maintainable, and testable codebase.

## Purpose

The purpose of this document is to provide a comprehensive guide for the development and implementation of the **connectify** application. It includes both functional and non-functional requirements, as well as details on the system's architecture, technical stack, and deployment.

## Scope

This document covers the following areas:

- Functional requirements
- Non-functional requirements
- Technical stack
- Database design
- API documentation
- Deployment strategies

## Definitions

- **User**: An individual who registers and interacts with the application.
- **Post**: Content created by users, which can include text and media.
- **Comment**: User responses to posts.
- **Notification**: Alerts for users about important activities.
- **Message**: Direct communication between users.
- **Admin**: A user with additional privileges to manage and moderate the application.

## System Overview

The system consists of several interconnected modules:

- User Management
- Authentication and Authorization
- Profile Management
- Post Management
- Comment Management
- Notification System
- Messaging System
- Admin and Moderation Tools
- Privacy Settings

## Functional Requirements

### User Management

- **User Registration**
  - [DONE] Users can register with a profile photo, bio, location, and website.
  - [DONE] Input validation and sanitization.
  - [DONE] Prevent duplicate user registration.
- **User Login**
  - [DONE] Secure authentication using JWT tokens.
  - Login attempts tracking.
  - User login history.
  
- [DONE] Password Reset
- User account verification.
- User account recovery.
- [DONE] User account deletion.

### Authentication and Authorization

- [DONE] **JWT Authentication**
  - Users receive a JWT token upon successful login.
  - Secure routes using JWT verification.

- [DONE] **Role-Based Access Control (RBAC)**
  - Admin and regular user roles.
  - Route protection based on roles.

### Profile Management

- **View Profile**
  - Users can view their profile information.
  - Users can view other users' profiles.

- **Edit Profile**
  - Users can update their profile information and profile photo.
  - Input validation and error handling.

### Post Management

- **Create Post**
  - Users can create posts with text and media.
  - Input validation and error handling.

- **Edit Post**
  - Users can edit their own posts.
  - Input validation and error handling.

- **Delete Post**
  - Users can delete their own posts.
  - Admins can delete any post.

- **View Posts**
  - Users can view posts from other users they follow.
  - Infinite scrolling for the activity feed.

### Comment Management

- **Create Comment**
  - Users can comment on posts.
  - Input validation and error handling.

- **Delete Comment**
  - Users can delete their own comments.
  - Admins can delete any comment.

### Notification System

- **Create Notification**
  - Notifications for new messages, likes, comments, etc.
  - Real-time notifications using WebSockets.

- **View Notifications**
  - Users can view their notifications.
  - Mark all notifications as read.

### Messaging System

- **Private Messaging**
  - Direct messages between users.
  - Real-time messaging with typing indicators using WebSockets.

- **Group Chats**
  - Group messaging with multiple users.
  - Real-time updates for group messages.

### Admin and Moderation Tools

- **Admin Roles**
  - Admins can manage the application.
  - Admins can ban and unban users.

- **Content Moderation**
  - Users can report inappropriate content.
  - Admins can review and take action on reported content.

### Privacy Settings

- **Profile Visibility**
  - Users can control who can see their profile information.
  - Users can control who can send them friend requests.

- **Blocking**
  - Users can block and unblock other users.

## Non-Functional Requirements

### Performance

- **Response Time**
  - API responses should be within 200ms.

- **Concurrency**
  - Support for at least 10,000 concurrent users.

### Scalability

- **Horizontal Scaling**
  - The system should support horizontal scaling to handle increased load.

### Security

- **Data Protection**
  - Secure data transmission using HTTPS.
  - Encrypt sensitive data such as passwords.

- **Input Validation**
  - Sanitize all inputs to prevent SQL injection, XSS, and other attacks.

- **Rate Limiting**
  - Implement rate limiting to prevent abuse.

### Usability

- **User Interface**
  - Intuitive and user-friendly interface.
  - Accessible for users with disabilities.

### Maintainability

- **Code Structure**
  - Follow Clean Architecture principles.
  - Write modular and reusable code.

- **Documentation**
  - Comprehensive API documentation using Swagger.
  - Inline code comments and external documentation.

## Technical Stack

- **Backend**: Node.js, NestJS, TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **File Storage**: Firebase Storage
- **Real-Time**: WebSockets
- **Validation**: class-validator
- **Testing**: Jest
- **Documentation**: Swagger

## Database Design

### User

- id (PK)
- name
- email
- password
- profilePhoto
- bio
- location
- website
- isAdmin
- isBanned
- is2FAEnabled
- twoFactorAuthSecret

### User_follows

- id (PK)
- followerId (FK) -> User.id
- followedId (FK) -> User.id

### User_Friend

- id (PK)
- user1 (FK) -> User.id
- user2 (FK) -> User.id

### Post

- id (PK)
- content
- media (array)
- userId (FK) -> User.id
- createdAt
- updatedAt

### Comment

- id (PK)
- content
- userId (FK) -> User.id
- postId (FK) -> Post.id
- parentId (FK) -> Comment.id
- createdAt
- updatedAt

### Comment_mentions

- id (PK)
- commentId (FK) -> Comment.id
- userId (FK) -> User.id

### Post_mentions

- id (PK)
- postId (FK) -> Post.id
- userId (FK) -> User.id

### Notification

- id (PK)
- type
- message
- userId (FK) -> User.id
- createdAt

### Message

- id (PK)
- content
- senderId (FK) -> User.id
- chatId (FK) -> Chat.id
- createdAt

### Chat

- id (PK)
- user1 (FK) -> User.id
- user2 (FK) -> User.id
- createdAt
- updatedAt

### Chat_Message

- chatId (FK) -> Chat.id
- messageId (FK) -> Message.id

### GroupMessage

- id (PK)
- content
- senderId (FK) -> User.id
- chatId (FK) -> Chat.id
- replyTo (FK) -> GroupMessage.id
- createdAt

### GroupMessage_viewers

- id (PK)
- messageId (FK) GroupMessage.id
- userId (FK) User.id

### GroupChat

- id (PK)
- name
- image
- description
- createdAt
- updatedAt

### GroupChat_User

- id (PK)
- groupId (FK) -> GroupChat.id
- userId (FK) -> User.id

### GroupChat_Messagr

- id (PK)
- groupId (FK) -> GroupChat.id
- messageId (FK) -> GroupMessage.id

### Block

- id (PK)
- userId (FK) -> User.id
- bannedBy (FK) -> User.id

### Ban

- id (PK)
- userId (FK) -> User.id
- bannedBy (FK) -> User.id
- reason

### Report

- id (PK)
- reporterId (FK) -> User.id
- postId (FK) -> Post.id
- commentId (FK) -> Comment.id
- userId (FK) -> User.id
- additionalInfo

## API Documentation

- Comprehensive API documentation using Swagger.
- Each endpoint should include details on the request, response, status codes, and example payloads.

## Deployment

- **Environment Configuration**
  - Use environment variables for configuration.
  - Ensure secrets are not hardcoded.

- **CI/CD**
  - Implement CI/CD pipelines for automated testing and deployment.

- **Monitoring and Logging**
  - Monitor application performance and log errors using tools like Prometheus and Grafana.

- **Scaling**
  - Deploy the application on a cloud provider with support for auto-scaling, such as AWS, Azure, or GCP.

---

This document provides a comprehensive guide for the development and implementation of the connectify application, covering both functional and non-functional requirements, the technical stack, database design, API documentation, and deployment strategies.
