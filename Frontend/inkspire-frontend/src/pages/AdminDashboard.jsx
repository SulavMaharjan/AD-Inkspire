import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalMembers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [salesData, setSalesData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all data
        const [
          booksRes,
          ordersRes,
          membersRes,
          recentOrdersRes,
          salesDataRes,
          topBooksRes,
        ] = await Promise.all([
          axios.get("/api/books/getbooks", {
            headers,
            params: { pageSize: 1 },
          }),
          axios.get("/api/orders", { headers, params: { pageSize: 1 } }),
          axios.get("/api/superadmin/members", { headers }),
          axios.get("/api/orders", {
            headers,
            params: { pageSize: 5, sortBy: "CreatedAt", sortAscending: false },
          }),
          axios.get(`/api/orders/sales-data?range=${timeRange}`, { headers }),
          axios.get("/api/books/mostpopular", {
            headers,
            params: { pageSize: 5 },
          }),
        ]);

        // Calculate stats
        const allOrders = ordersRes.data.items || [];
        const pendingOrders = allOrders.filter(
          (order) => order.status === "Pending"
        ).length;
        const completedOrders = allOrders.filter(
          (order) => order.status === "Completed"
        ).length;

        setStats({
          totalBooks: booksRes.data.totalCount || 0,
          totalOrders: ordersRes.data.totalCount || 0,
          totalRevenue: salesDataRes.data.totalRevenue || 0,
          totalMembers: membersRes.data.length || 0,
          pendingOrders,
          completedOrders,
        });

        setRecentOrders(recentOrdersRes.data.items || []);
        setTopBooks(topBooksRes.data.items || []);
        setSalesData(salesDataRes.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data"
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "📚",
      color: "#4CAF50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "🛒",
      color: "#2196F3",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "💰",
      color: "#FFC107",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: "👥",
      color: "#9C27B0",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "#FF9800",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: "✅",
      color: "#607D8B",
    },
  ];

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderBottom: `4px solid ${stat.color}` }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="dashboard-section">
        <h2>Sales Overview</h2>
        <div className="time-range-selector">
          <button
            className={timeRange === "weekly" ? "active" : ""}
            onClick={() => setTimeRange("weekly")}
          >
            Weekly
          </button>
          <button
            className={timeRange === "monthly" ? "active" : ""}
            onClick={() => setTimeRange("monthly")}
          >
            Monthly
          </button>
          <button
            className={timeRange === "yearly" ? "active" : ""}
            onClick={() => setTimeRange("yearly")}
          >
            Yearly
          </button>
        </div>
        {salesData && (
          <div className="chart-container">
            <Line
              data={{
                labels: salesData.labels,
                datasets: [
                  {
                    label: "Sales",
                    data: salesData.data,
                    fill: true,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Recent Orders and Top Books */}
      <div className="row-section">
        {/* Recent Orders */}
        <div className="dashboard-section recent-orders">
          <h2>Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.userName || "Guest"}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-badge ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent orders found</p>
          )}
        </div>

        {/* Top Books */}
        <div className="dashboard-section top-books">
          <h2>Top Selling Books</h2>
          {topBooks.length > 0 ? (
            <div className="books-list">
              {topBooks.map((book, index) => (
                <div key={book.id} className="book-item">
                  <span className="rank">{index + 1}</span>
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p>by {book.author}</p>
                    <div className="sales-info">
                      <span>Sold: {book.salesCount || 0}</span>
                      <span>${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No top books data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
