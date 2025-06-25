
# 🧠 AI-Powered CV Builder

Create, edit, and download stunning CVs with real-time preview, AI-powered suggestions, and ATS optimization — all in one place.

🚀 [Live Demo](https://resumebuilder-frontend-i6nn.vercel.app/)  
📂 [Frontend Repository](https://github.com/DEEN-42/resumebuilder-frontend)

---

## ✨ Features

- 🖋️ **Template-Based Resume Editor**: Choose from **4 predefined layouts** and customize in real-time.
- 🧠 **AI Suggestions**: Integrated with the **Gemini API** to provide intelligent section-wise improvement tips.
- ✅ **ATS Score Evaluation**: Get feedback on how well your CV aligns with Applicant Tracking Systems.
- 📦 **Download as PDF**: Export your final CV in a ready-to-share, high-quality PDF format.
- 🧾 **Real-Time Preview**: Instantly see how your resume looks as you type.
- 🗂️ **User Dashboard**: Save, manage, and revisit your previously created CVs with latest updates.
- 🔐 **Secure Authentication**: Passwords are securely hashed; uses access and refresh tokens for safe session handling.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **AI Integration**: Gemini API  
- **Authentication**: Bcrypt (password hashing), JWT (access/refresh tokens)

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/DEEN-42/resumebuilder-frontend.git
````

### 2. Navigate to Project Directory

```bash
cd resumebuilder-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env` file in the root directory and add the following:

```
REACT_APP_BACKEND_URL=your_backend_api_url
```

> **Note:** This is the frontend repo. Ensure the backend is running and properly configured.

### 5. Start Development Server

```bash
npm start
```

---


## 🤖 How AI Integration Works

* Each section (e.g., Work Experience, Education) has an optional “Get Suggestions” button.
* When clicked, it sends the current content to the OpenAI API, which responds with targeted improvement tips.

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* [Vercel](https://vercel.com/) – for hosting the live demo.

```

---

