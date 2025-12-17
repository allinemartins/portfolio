# 📚 Book Club App

Frontend application built with **React + TypeScript**, focused on managing a book club.  
This project was designed as a **real product**, prioritizing mobile experience, clear business rules, and an architecture prepared for future backend integration.

---

## ✨ Features

### 📊 Dashboard
- Overview of the book club
- Current book in reading (only **one book can be in progress at a time**)
- Quick metrics:
  - Total books
  - Books read
  - Books currently being read
- Book draw section (in progress)

### 📚 Books
- Add books with:
  - Title
  - Author
  - Status (Suggested, Reading, Read)
- Book search powered by **Google Books API**
- Book cover display
- Business rules:
  - Only **one book can have status "Reading"**
  - Controlled status transitions
- Remove books
- Filter by status using **tabs with counters**
- Automatic persistence using `localStorage`

---

## 🧠 Architecture Decisions

- **Context API** for global state management
- Business rules centralized in the domain layer (context)
- Storage adapter using `localStorage`
  - Ready to be replaced by a REST API in the future
- `useMemo` used for derived state (dashboard and filters)
- **CSS Modules** for scoped styles
- **Mobile-first** approach

---

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- React Router
- Context API
- CSS Modules
- Google Books API

---

## 🚀 Running the project

```bash
# install dependencies
npm install

# start development server
npm run dev
