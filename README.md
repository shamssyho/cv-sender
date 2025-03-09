# 📌 CV Sender - LinkedIn Job Application Automation

## 🚀 Description

This project is a **NestJS API** that automates **job applications on LinkedIn** using **Selenium**. It allows you to:

- 🔍 **Search** for a specific job
- 🎯 **Filter** only "Easy Apply" job offers
- 🤖 **Automatically apply** with your CV
- 📝 **Fill in** Easy Apply forms

---

## 🛠️ Technologies Used

- &#x20;**NestJS** - Backend framework for Node.js
- &#x20;**Selenium WebDriver** - Browser automation
- &#x20;**TypeScript** - Main language of the project
- &#x20;**PostgreSQL** - Database for tracking applications
- &#x20;**Docker** (optional) - Application containerization

---

## 📂 Project Structure

```
cv-sender-api/
│── src/
│   ├── controllers/
│   │   ├── application.controller.ts  # Manages job applications
│   ├── services/
│   │   ├── automation.service.ts      # Selenium automation logic
│   │   ├── application.service.ts     # Application data management
│   ├── entities/
│   │   ├── application.entity.ts      # Application model (TypeORM)
│   ├── dto/
│   │   ├── create-application.dto.ts  # DTO for job applications
│   ├── app.module.ts                  # Main NestJS module
│── .env                               # Environment variables
│── package.json                       # Project dependencies
│── README.md                          # Documentation
```

---

## 📦 Installation

1️⃣ **Clone the project**

```sh
git clone https://github.com/your-repo/cv-sender.git
cd cv-sender-api
```

2️⃣ **Install dependencies**

```sh
npm install
```

3️⃣ **Set up environment variables** (`.env`)

```ini
LINKEDIN_EMAIL=your_email
LINKEDIN_PASSWORD=your_password
CHROMEDRIVER_PATH=/path/to/chromedriver
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=cv-sender
```

4️⃣ **Start PostgreSQL** (if using locally)

```sh
docker-compose up -d
```

5️⃣ **Run the API**

```sh
npm run start
```

---

## 🖥️ Usage

📌 **Apply for a job automatically**:

```sh
POST http://localhost:4000/applications/apply
Content-Type: application/json

{
  "platform": "LinkedIn",
  "jobTitle": "Frontend Developer",
  "cvPath": "D:/Documents/CV.pdf"
}
```

📌 **Retrieve sent applications**:

```sh
GET http://localhost:4000/applications/history
```

---

## 🔥 Future Enhancements

- 📌 **Support for multiple job platforms** (Indeed, Welcome to the Jungle...)
- 🚀 **Improved job filtering**
- 🤖 **Advanced question handling in Easy Apply**
- 📊 **Dashboard to track applications**

---

👨‍💻 **Developed by:** Shams ALSAADI 🚀



