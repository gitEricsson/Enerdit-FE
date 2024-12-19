# Enerdit Frontend

Enerdit is a web application designed to help users understand and manage household energy consumption. The frontend is built using React and provides a user-friendly interface for conducting energy audits, viewing reports, and managing user accounts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)

## Features

- User authentication (signup, login, email verification)
- Energy audit functionality
- Dynamic dashboard displaying energy consumption data
- Responsive design for mobile and desktop
- Integration with various libraries for charts and data visualization

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **React Router**: For routing and navigation.
- **Axios**: For making HTTP requests to the backend API.
- **Tailwind CSS**: For styling and responsive design.
- **Recharts**: For data visualization through charts.
- **Yup**: For form validation.
- **React Hook Form**: For managing form state and validation.

## Installation

To get started with the Enerdit frontend, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/enerdit-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd enerdit-frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_GOOGLE_APP_REDIRECT_URI=http://localhost:3000/auth-callback
   ```

## Usage

To run the application in development mode, use the following command:

```bash
npm start
```

This will start the development server and open the application in your default web browser at `http://localhost:3000`.

## Folder Structure

The project has the following folder structure:

```
enerdit-frontend/
├── public/                  # Static files
│   ├── index.html          # Main HTML file
│   ├── manifest.json       # Web app manifest
│   └── favicon.ico         # Favicon
├── src/                     # Source files
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── styles/             # CSS files
│   ├── App.js              # Main application component
│   └── index.js            # Entry point
├── .gitignore               # Git ignore file
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```
