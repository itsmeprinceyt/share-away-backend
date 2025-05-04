# Share Away

**Share Away** is a minimalistic blogging platform where users can express their feelings and share personal thoughts without judgment. It provides a safe and supportive community where anyone can create posts, interact with others, and engage with a like-minded audience.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- **User Authentication**: Secure user sign-up and login and using JWT Token to ensure security at its max!
- **User Profiles**: Each user has a unique profile with personal information, posts, and interactions.
- **Post Creation**: Users can create new posts to express their thoughts and feelings.
- **Post Editing & Deletion**: Edit or delete your posts at any time.
- **Like System (Hearts)**: Users can "heart" posts to express support.
- **Search Functionality**: Search for users by username or email using regex-based search.
- **Responsive UI**: The platform is optimized for both mobile and desktop views.
- **Post Feed**: View the latest posts from all users in a centralized feed.
- `more features discussed in the video . . .`
---

## Tech Stack

  - **Next.js** (React Framework) for building a fast and scalable frontend.
  - **TypeScript** for type safety and better development experience.
  - **TailwindCSS** for styling and a responsive design.
  - **React Query** for efficient data fetching and caching.
  - **Express.js** for handling API routes and server-side logic.
  - **MySQL** for relational database management to store users, posts, and likes.
  - **bcrypt.js** for password hashing and security.

---

## Installation

Follow these steps to get the project up and running locally.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16.x or above)
- **MySQL** (v5.7 or above)
- **Git** for version control
- **npm** or **yarn** for managing dependencies

### Step 1: Clone the Front-end Repository

```bash
git clone https://github.com/itsmeprinceyt/share-away-website
```

### Step 2: Clone the Back-end Repository

```bash
git clone https://github.com/itsmeprinceyt/share-away-backend
```

### Step 3: Install packages and dependencies

```bash
npm install
```

### Step 4: Setup backend-env
I used XAAMP MySQL locally for testing and stuff so those goes under `DEV_DB..` , the main database credentials has to go into `PROD_DB...`.

Then you setup it in `https://github.com/itsmeprinceyt/share-away-backend/blob/main/src/databaseConnections/pool.ts` and keep the `ENV=dev` and run it so you can check if the local database is working or not. Then change `ENV=prod` and test your main database.

**NOTE:** You need to first create database and then put them in the `DB_NAME` and then just run the script, it'll create the tables itself.
```env
ENV=dev # dev | prod
PROD_PORT=
DEV_PORT=
JWT_TOKEN=

PROD_DB_HOST=
PROD_DB_PORT=
PROD_DB_USER=
PROD_DB_PASSWORD=
PROD_DB_NAME=

DEV_DB_HOST=localhost
DEV_DB_PORT=3306
DEV_DB_USER=devuser
DEV_DB_PASSWORD=devpassword
DEV_DB_NAME=shareaway
```

### Step 5: Setup frontend-env

```env
NEXT_PUBLIC_ENV=dev # keep it at dev when running, when you deploy then switch to prod
NEXT_PUBLIC_API_URL= # this is where your backend is hosted and running
NEXT_PUBLIC_LOCAL_API_URL= # this is where your backend is running locally
```

### Step 6: Start the Backend

For Development
```bash
nodemon
```

For Building
```bash
npm run build
```

Running from production build
```bash
npm run start
```

### Step 7: Start the Frontend
For Development
```bash
npm run dev
```

### Acknowledgements
- Next.js - The React framework for building the frontend.
- Express.js - The backend framework for building the API.
- MySQL - The relational database used to store data.
- TailwindCSS - A utility-first CSS framework used for styling.

### Contributing
- Fork the repository.
- Go to issues and see what is missing and try to contribute. https://github.com/itsmeprinceyt/share-away-website/issues/8
- Create a new branch: git checkout -b feature/new-feature.
- Make your changes and commit them: git commit -am '1.1.1 | Appropriate message'.
- Push to your branch: git push origin feature/new-feature.
- Submit a pull request to the main repository.

### License
Distributed under the MIT License. See LICENSE for more information.

This version of the `README.md` provides **all possible details** about the **Share Away** project, including features, setup instructions, environment variables, API documentation, frontend pages, and contributing guidelines. It ensures that anyone can follow the instructions to set up and run the project from start to finish.

### Video Explaination

TBA
