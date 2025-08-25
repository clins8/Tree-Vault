# Tree Vault 🌱

Plant Now, Reap Later – Turning Eco-Actions into a Game

Tree Vault is a full-stack web application that gamifies eco-friendly actions like planting trees. Users can upload verified plant photos, earn points, view a private gallery, compete on the leaderboard, and explore a 3D globe visualization of contributions.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/clins8/Tree-Vault.git
cd Tree-Vault
```

### 2. Install dependencies

#### Frontend (React + Vite)

```bash
cd client
npm install
```

#### Backend (Node + Express)

```bash
cd ../server
npm install
```

### 3. Environment variables

Create `.env` files in both `client` and `server` directories with the following keys (replace with your actual values):

**Client (.env):**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Server (.env):**

```
PORT=5000
FIREBASE_SERVICE_ACCOUNT=path_to_your_service_account.json
```

### 4. Run the project

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173)
Backend runs on [http://localhost:5000](http://localhost:5000)

---

## 📂 Project Structure

```
Tree-Vault/
│
├── client/          # React + Vite frontend
│   ├── src/
│   └── vite.config.js
│
├── server/          # Node.js + Express backend
│   ├── routes/
│   └── index.js
│
└── README.md
```

---

## ✅ Features

* 🌍 3D Globe centerpiece (Three.js)
* 🌱 Plant verification with confetti rewards (+50 points)
* 🔒 Duplicate prevention via SHA-256 hashing
* 🖼️ Private gallery of successful uploads
* 🏆 Leaderboard ranked by upload count
* 👤 Profile with editable name

---

