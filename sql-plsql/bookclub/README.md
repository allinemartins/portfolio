# 📘 Book Club Database (Liquibase + Docker)

This project contains the **database schema and migrations** for a Book Club application, built with **PostgreSQL** and **Liquibase**, fully containerized using **Docker Compose**.

The goal of this module is to provide a **clean, versioned, and environment-independent database setup**, designed to be later consumed by a backend API (Spring Boot + JWT + Keycloak).

---

## 🧠 Key Concepts

- Database versioning with **Liquibase**
- PostgreSQL as the relational database
- **Multi-tenant ready** data model
- Docker-based local development
- Infrastructure decoupled from the application layer

---

## 🏗️ Architecture Overview

Docker Compose
├── PostgreSQL
└── Liquibase (runs migrations and exits)

Liquibase is executed as a **standalone container**, independent of any application runtime.

---

## 📂 Project Structure

bookclub/
├── docker/
│ ├── docker-compose.yml
│ └── .env
│
├── db/
│ └── changelog/
│ ├── db.changelog-master.yaml
│ ├── 001-create-club.yaml
│ ├── 002-create-member.yaml
│ ├── 003-create-book.yaml
│ ├── 004-create-book-reading.yaml
│ └── 005-create-book-rating.yaml
│
└── README.md

---

## 🧩 Data Model

### Core Entities

- **club**
- **member**
- **book**
- **book_reading**
- **book_rating**

### Multi-Tenancy Strategy

All domain tables reference a `club_id`, allowing:
- logical multi-tenancy
- easy isolation per tenant
- future scalability without schema changes

---

## 📚 Business Rules (Database-level)

- A book belongs to a single club
- Members belong to a club
- Reading progress is tracked per member and book
- Ratings are allowed only once per member and book

> Complex rules (e.g. “only one book in READING status”) are intentionally enforced at the **domain layer**, not at the database level.

---

## 🚀 Running Locally

### Prerequisites
- Docker
- Docker Compose

### Steps

```bash
cd docker
docker compose up -d 