# 🧠 AI‑Powered CV Builder

Create, edit, share, and download stunning CVs with **real‑time preview, multi‑user collaboration, AI‑powered suggestions, and ATS optimization**—all in one place.

🚀 **Live Demo:** [resumebuilder-frontend-i6nn.vercel.app](https://resumebuilder-frontend-i6nn.vercel.app/)  
📂 **Frontend Repo:** [DEEN-42/resumebuilder-frontend](https://github.com/DEEN-42/resumebuilder-frontend)  
🗄️ **Backend Repo:** [DEEN-42/ResumeBuilder-backend](https://github.com/DEEN-42/ResumeBuilder-backend)

---

## ✨ Features

| Category | Highlights |
|----------|------------|
| 🎨 **Template‑Based Editor** | Pick from **4 clean layouts** and customize instantly with a left‑panel form + right‑panel live preview. |
| 🤝 **Real‑Time Collaboration** | Share a resume link, see **who’s online**, and co‑edit together via Socket.IO rooms. |
| 🧠 **AI Suggestions** | Powered by the **Gemini API**: section‑wise tips to strengthen wording, skills, and achievements. |
| 📊 **ATS Score** | One‑click check that grades your CV’s recruiter/ATS friendliness and lists strengths & improvement areas. |
| 📬 **Email Invites** | Nodemailer sends collaboration invites + notifications. |
| 🔐 **Secure Auth** | Email/password (bcrypt + JWT access & refresh tokens) **and** Google OAuth login. |
| 📥 **PDF Export** | Download the polished resume as a high‑quality PDF. |
| 🗂 **Dashboard** | View, rename, duplicate, or delete all owned / shared resumes. |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React • Vite • Tailwind CSS • React‑Hot‑Toast |
| **Realtime** | Socket.IO |
| **Backend** | Node.js • Express.js |
| **Database** | MongoDB + Mongoose |
| **AI / ATS** | Google Gemini API (AI suggestions) + custom ATS scoring logic |
| **Auth** | bcrypt (hashing) • JWT (access/refresh) • Google OAuth 2.0 |
| **Email** | Nodemailer |
| **Deployment** | Vercel (frontend) • Render / Fly.io / Railway *(choose your host)* (backend) |

---

## 📦 Local Installation

> **Tip:** Clone *both* repos into a single folder (e.g., `resume‑builder/`) so relative paths in the examples below work out of the box.

### 1. Clone Repositories

```bash
git clone https://github.com/DEEN-42/resumebuilder-frontend.git
git clone https://github.com/DEEN-42/ResumeBuilder-backend.git
````

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install          
```

#### Backend

```bash
cd backend
npm install          
```

### 3. Configure Environment Variables

Create the following `.env` files.

#### `ResumeBuilder-backend/.env`

```env
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resume-builder

# Auth
JWT_ACCESS_SECRET=super_secret_access_token
JWT_REFRESH_SECRET=super_secret_refresh_token
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxx

# AI (Gemini)
GOOGLE_API_KEY=your_gemini_key_here

# Email
EMAIL_USER=your_gmail_or_ses_user
EMAIL_PASS=your_email_app_password
```

#### `resumebuilder-frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run in Development Mode

```bash
# In one terminal
cd ResumeBuilder-backend
npm run dev     # nodemon / ts-node / etc.

# In another terminal
cd resumebuilder-frontend
npm run dev     # Vite dev server
```

Site available at **[http://localhost:5173](http://localhost:5173)** (default Vite port).

---

## 🤖 How AI Suggestions Work

1. Click **“AI Suggest”** on any section.
2. The current text is sent to the Gemini API.
3. Gemini responds with concise, impact‑oriented rewrites + keyword suggestions.
4. Accept, reject, or tweak before saving.

---

## 🛡️ Security Notes

* **Passwords:** salted & hashed with bcrypt (12 rounds).
* **Tokens:** short‑lived access token + rotating refresh token stored in secure HTTP‑only cookies.
* **HTTPS:** strongly recommended in production (Vercel + automatic TLS).

---

## 🚀 Deployment

| Layer        | Service              | Branch → URL                                                                                                |
| ------------ | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | Vercel               | `main` → [https://resumebuilder-frontend-i6nn.vercel.app/](https://resumebuilder-frontend-i6nn.vercel.app/) |
| **Backend**  | Render/Fly/Railway\* | `main` → *add your Render URL when deployed*                                                                |

\* Replace with the actual host you pick—env vars above are Render‑friendly by default.

---

## 📜 License

Released under the **MIT License**.

> Feel free to fork, star, and contribute—PRs are welcome!

---

## 🙌 Acknowledgements

* **Google Gemini API** – natural‑language magic ✨
* **Socket.IO** – effortless real‑time sync
* **Vercel** – zero‑config frontend hosting
* **MongoDB Atlas** – scalable document DB

---

