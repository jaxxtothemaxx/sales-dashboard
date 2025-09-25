# Product Metrics Dashboard

This project is a simple, interactive dashboard built to visualize key product metrics. The goal is to provide a single source of truth for understanding user behavior and product health, enabling data-driven decision-making.

This project was designed to demonstrate core product management and technical skills, specifically:

- **SQL Competency:** Writing and executing SQL queries to transform raw data into meaningful insights.
- **Data Literacy:** Identifying key metrics and visualizing them in a way that is clear and actionable.
- **Product Thinking:** Understanding which metrics are important for tracking product health and user engagement.

## Technologies & Architecture

The dashboard is a single-page application (SPA) built with a modern, lightweight technology stack. The entire application runs in the browser without a separate backend server.

- **Frontend Framework:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for rapid and responsive UI development.
- **Database:** [`sql.js`](https://sql.js.org/) for an in-browser SQLite database.
- **Data Visualization:** `Recharts` for creating interactive charts.
- **Build Tool:** Vite

### Architecture Overview

The application consists of a single React component (`App.jsx`) that handles all logic:

1.  **Database Initialization:** On component mount, the `sql.js` library is loaded and a new in-memory database is created.
2.  **Data Population:** SQL `CREATE TABLE` and `INSERT` statements are executed to populate the database with data representing users and sales events.
3.  **Data Retrieval:** Key product metrics are extracted from the database using SQL `SELECT` queries with joins, aggregations, and grouping.
4.  **Visualization:** The retrieved data is passed as props to `Recharts` components to render the line charts, bar charts, and data tables.

## Key Metrics Visualized

- **User Signups Over Time:** A line chart showing the number of new user signups per month.
- **Product Feature Usage:** A bar chart displaying the usage count of different product features.
- **User Distribution by Country:** A bar chart showing the total number of users from different countries.
- **Recent User Activity:** A data table displaying the 10 most recent user activities, joining user and sales data.

## How to Run This Project

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/jaxxtothemaxx/sales-dashboard.git
    cd sales-dashboard
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to the local address provided (usually `http://localhost:5173`).
