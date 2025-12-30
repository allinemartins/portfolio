# 📚 Book Club App

Frontend application built with **React + TypeScript**, focused on managing a book club experience.
This project was designed as a **real-world product**, prioritizing mobile usability, clear business rules, and an architecture prepared for **backend integration and multi-tenant authentication**.

---

## ✨ Features

### 🔐 Authentication
- Authentication via **Keycloak (OpenID Connect)**
- Authorization Code Flow (PKCE)
- JWT-based security
- Ready for future **multi-tenant** support using Keycloak realms
- No sensitive data stored in the frontend

---

### 📊 Dashboard
- Book club overview
- Current book in progress  
  > ⚠️ Only **one book can be in "Reading" status** at a time
- Quick metrics:
  - Total books
  - Books read
  - Books currently being read
- Book draw section (in progress)

---

### 📚 Books Management
- Add books with:
  - Title
  - Author
  - Status: **Suggested | Reading | Read**
- Book search powered by **Google Books API**
- Book cover preview
- Business rules enforced at the domain layer:
  - Only one book can have status **"Reading"**
  - Controlled status transitions
- Remove books
- Filter books by status using **tabs with counters**
- Automatic persistence using `localStorage`
  - Easily replaceable by a REST API

---

## 🧠 Architecture Decisions

- **Context API** for global state management
- Business rules centralized in the domain layer (context)
- Storage abstraction using `localStorage`
  - Designed to be replaced by a backend service
- Derived state handled with `useMemo`
- **CSS Modules** for scoped and maintainable styles
- **Mobile-first** design approach

---

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- React Router
- Context API
- CSS Modules
- Axios
- Keycloak (OIDC)
- Google Books API

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`.

```env
VITE_KEYCLOAK_URL=https://auth.yourdomain.com
VITE_KEYCLOAK_REALM=clube-do-livro
VITE_KEYCLOAK_CLIENT_ID=clube-do-livro-web

VITE_API_BASE_URL=https://api.yourdomain.com


## 🚀 Running the project

```bash
# install dependencies
npm install

# start development server
npm run dev
