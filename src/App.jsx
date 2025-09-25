import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const App = () => {
  const [db, setDb] = useState(null);
  const [userCountryData, setUserCountryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [userSignupData, setUserSignupData] = useState([]);
  const [salesDetailData, setSalesDetailData] = useState([]);
  const [isDbReady, setIsDbReady] = useState(false);
  const [sqlError, setSqlError] = useState(null);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        // Dynamically import the sql.js library and its wasm file
        const SQL = await (await import('sql.js')).default({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
        const newDb = new SQL.Database();
        setDb(newDb);
        await createAndPopulateTables(newDb);
        setIsDbReady(true);
      } catch (err) {
        console.error('SQL.js initialization error:', err);
        setSqlError(err.message);
      }
    }

    initializeDatabase();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  const createAndPopulateTables = async (newDb) => {
    try {
      // Create tables
      const userTableSql = `CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        signup_date TEXT,
        country TEXT
      );`;
      newDb.exec(userTableSql);

      const salesTableSql = `CREATE TABLE sales_events (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        product_name TEXT,
        event_type TEXT,
        timestamp TEXT
      );`;
      newDb.exec(salesTableSql);

      // Populate with mock data
      const insertUsersSql = `
        INSERT INTO users (id, signup_date, country) VALUES
        (1, '2023-01-05', 'USA'),
        (2, '2023-01-07', 'USA'),
        (3, '2023-01-12', 'CAN'),
        (4, '2023-02-01', 'USA'),
        (5, '2023-02-03', 'MEX'),
        (6, '2023-02-15', 'CAN'),
        (7, '2023-03-01', 'USA'),
        (8, '2023-03-02', 'USA'),
        (9, '2023-03-20', 'MEX'),
        (10, '2023-04-01', 'USA'),
        (11, '2023-04-03', 'USA'),
        (12, '2023-04-10', 'MEX'),
        (13, '2023-05-01', 'USA'),
        (14, '2023-05-05', 'USA'),
        (15, '2023-05-20', 'CAN');
      `;
      newDb.exec(insertUsersSql);

      const insertSalesSql = `
        INSERT INTO sales_events (id, user_id, product_name, event_type, timestamp) VALUES
        (1, 1, 'Product A', 'Feature_Click', '2023-01-06 10:00:00'),
        (2, 1, 'Product B', 'Purchase', '2023-01-06 11:30:00'),
        (3, 2, 'Product A', 'Feature_Click', '2023-01-08 14:00:00'),
        (4, 3, 'Product C', 'Purchase', '2023-01-13 09:00:00'),
        (5, 4, 'Product A', 'Purchase', '2023-02-02 12:00:00'),
        (6, 5, 'Product B', 'Feature_Click', '2023-02-04 16:00:00'),
        (7, 6, 'Product A', 'Feature_Click', '2023-02-16 11:00:00'),
        (8, 7, 'Product C', 'Purchase', '2023-03-03 10:00:00'),
        (9, 8, 'Product A', 'Purchase', '2023-03-04 12:00:00'),
        (10, 9, 'Product A', 'Feature_Click', '2023-03-21 09:00:00'),
        (11, 10, 'Product B', 'Purchase', '2023-04-02 14:00:00'),
        (12, 11, 'Product C', 'Feature_Click', '2023-04-04 15:00:00'),
        (13, 12, 'Product A', 'Purchase', '2023-04-11 11:00:00'),
        (14, 13, 'Product B', 'Purchase', '2023-05-02 10:00:00'),
        (15, 14, 'Product A', 'Feature_Click', '2023-05-06 13:00:00'),
        (16, 15, 'Product B', 'Purchase', '2023-05-21 15:00:00');
      `;
      newDb.exec(insertSalesSql);
    } catch (err) {
      console.error("SQL execution error: ", err);
      setSqlError(err.message);
    }
  };

  useEffect(() => {
    if (isDbReady) {
      // Query 1: Get user signups per month
      const userSignupSql = `
        SELECT
          strftime('%Y-%m', signup_date) AS month,
          COUNT(id) AS signups
        FROM users
        GROUP BY month
        ORDER BY month;
      `;
      const userSignupResult = db.exec(userSignupSql);
      const userSignupRows = userSignupResult[0]?.values.map(row => ({ month: row[0], signups: row[1] })) || [];
      setUserSignupData(userSignupRows);
      
      // Query 2: Get total users by country
      const userCountrySql = `
        SELECT
          country,
          COUNT(id) as user_count
        FROM users
        GROUP BY country;
      `;
      const userCountryResult = db.exec(userCountrySql);
      const userCountryRows = userCountryResult[0]?.values.map(row => ({ name: row[0], users: row[1] })) || [];
      setUserCountryData(userCountryRows);

      // Query 3: Get product usage data
      const productUsageSql = `
        SELECT
          product_name AS name,
          COUNT(event_type) as usage
        FROM sales_events
        WHERE event_type = 'Feature_Click'
        GROUP BY product_name;
      `;
      const productUsageResult = db.exec(productUsageSql);
      const productUsageRows = productUsageResult[0]?.values.map(row => ({ name: row[0], usage: row[1] })) || [];
      setProductData(productUsageRows);

      // Query 4: Get detailed sales data
      const salesDetailSql = `
        SELECT
          T1.signup_date,
          T1.country,
          T2.product_name,
          T2.event_type
        FROM users AS T1
        JOIN sales_events AS T2 ON T1.id = T2.user_id
        ORDER BY T2.timestamp DESC;
      `;
      const salesDetailResult = db.exec(salesDetailSql);
      const salesDetailRows = salesDetailResult[0]?.values.map(row => ({
        "Signup Date": row[0],
        "Country": row[1],
        "Product": row[2],
        "Event Type": row[3]
      })) || [];
      
      // We will display this in a table. For the MVP, we will only show the first 10 rows.
      setSalesDetailData(salesDetailRows.slice(0, 10));
    }
  }, [isDbReady, db]);

  if (sqlError) {
    return (
      <div className="bg-red-500 text-white p-4 text-center rounded-lg">
        <h2 className="text-xl font-bold">Error Loading Database</h2>
        <p>Please check the console for details. Error: {sqlError}</p>
      </div>
    );
  }

  if (!isDbReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-800 dark:text-white text-lg font-semibold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
            Sales Operations Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Showcasing data literacy and SQL competency.
          </p>
        </header>
        
        <main className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Signups Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Signups Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userSignupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="signups" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Product Usage Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product Feature Usage</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution by Country */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Distribution by Country</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userCountryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="Total Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Signups Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent User Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    <th className="px-6 py-3 text-left font-semibold text-sm">Signup Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Country</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Product</th>
                    <th className="px-6 py-3 text-left font-semibold text-sm">Event Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                  {salesDetailData.length > 0
                    ? salesDetailData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{row["Signup Date"]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{row["Country"]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{row["Product"]}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{row["Event Type"]}</td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No data available.</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default App;
