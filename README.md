# 📰 Gamegear Blog (Spring Boot, React + Vite)

GGBlog is a full‑stack **blogging platform** built with a Java **Spring Boot** backend and **React + Vite** frontend.  
The backend powers the REST APIs, authentication, file uploads, and AI‑assisted features, while the frontend provides a modern SPA experience for reading and managing blog posts.
---
[Project Link](https://blog.gamegear.one/)
---

## 🧩 Project Overview

### Backend

- **Framework:** Spring Boot (Java)
- **Layers:**
  - **Controller layer** – `controller/*` (`BoardController`, `CommentController`, `FileController`, `MemberController`, `OpenAiController`)
  - **Service layer** – `service/*` (`BoardService`, `CommentService`, `FileService`, `MemberService`, `OpenAiService` – core business logic)
  - **Repository layer** – `repository/*` (`BoardRepository`, `CommentRepository`, `FileRepository`, `MemberRepository` – Spring Data JPA)
  - **Domain model** – `entity/*` (`Board`, `Comment`, `FileEntity`, `Member`)
  - **DTOs / Requests / Responses** – `dto/request/*`, `dto/response/*` (API contracts for boards, comments, files, members)

- **Security:**
  - Spring Security with **JWT** 
  - CORS configuration and password encoding 

- **AI Integration:**
  - AI‑assisted blog features (e.g. content writing assistance / generation)


### Authentication & Members

| Area    | Example pattern           | Notes                         |
|--------|---------------------------|-------------------------------|
| Auth   | `/api/members/login`      | Login, JWT issuance           |
| Members| `/api/members/**`         | Register, profile, update     |

### Blog (Board) & Comments

Handled by `BoardController` and `CommentController`:

| Area     | Example pattern                          | Notes                            |
|----------|------------------------------------------|----------------------------------|
| Boards   | `/api/boards/**`                         | CRUD for blog posts              |
| Search   | `/api/boards/search`                     | Search with `SearchData` DTO     |
| Comments | `/api/boards/{boardId}/comments/**`      | CRUD for comments on a post      |

### Files & Uploads

| Area  | Example pattern             | Notes                                |
|-------|-----------------------------|--------------------------------------|
| Files | `/api/files/upload`         | Upload attachments/images            |
| Files | `/api/files/{fileId}`       | Download/serve uploaded file         |

### AI Endpoints

| Area | Example pattern             | Notes                                |
|------|-----------------------------|--------------------------------------|
| AI   | `/api/ai/**` or similar     | AI‑assisted blog features (OpenAI)   |


---

### 👤 User Flow

- Browse the list of posts (boards)
- View a single post with comments and attachments
- Login / register as a member
- Create, edit, and delete your own posts
- Add comments and see them live under posts


## 🛠️ Technologies

### Backend

- **Language:** Java  
- **Framework:** Spring Boot  
- **Security:** Spring Security, JWT, BCrypt password encoding  
- **Persistence:** Spring Data JPA / Hibernate  
- **Database:** Postgresql  
- **AI:** OpenAI integration 
- **Build Tool:** Maven

### Frontend (brief)

- React + Vite   
---

## 🚀 Future Upgrades

### Rating option for blogs
- Allowing users to give rating out of 5 stars

### Tags  
- Tag and category filtering for boards.

### Admin Role
- Admin role with ability to moderate content

### Automatic moderation
- AI based moderation
