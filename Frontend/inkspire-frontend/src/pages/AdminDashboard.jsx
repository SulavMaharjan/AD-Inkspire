import React, { useState, useEffect } from 'react';
import { 
  Line, 
  Bar,
  Doughnut,
  Pie
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  BookOpen, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  ChevronDown,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  BookIcon,
  LogOut,
  RefreshCw  
} from 'lucide-react';
import "../styles/AdminDashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "https://localhost:7039/api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataPeriod, setDataPeriod] = useState('monthly');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dashboard stats
  const [memberStats, setMemberStats] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [bookStats, setBookStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState([]);
  const [bestsellingBooks, setBestsellingBooks] = useState([]);

  // Get token from local storage
  const token = localStorage.getItem('token');
  
  // Headers for API calls
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Fetch all data
  useEffect(() => {
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    
    const userRole = localStorage.getItem('role');
    if (userRole !== 'SuperAdmin' && userRole !== 'Staff') {
      window.location.href = '/';
      return;
    }
    
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        membersData,
        booksData,
        ordersData,
        genresData,
        orderStatusData,
        bestsellersData
      ] = await Promise.all([
        fetchMembers(),
        fetchBooks(),
        fetchOrders(),
        fetchGenreDistribution(),
        fetchOrderStatusDistribution(),
        fetchBestsellingBooks()
      ]);

      processMembersData(membersData);
      processBooksData(booksData);
      processOrdersData(ordersData);
      processGenresData(genresData);
      processOrderStatusData(orderStatusData);
      processBestsellersData(bestsellersData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch members data
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/superadmin/members`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  };

  // Process members data
  const processMembersData = (membersData) => {
    const membersArray = Array.isArray(membersData) ? membersData : membersData.items || [];
    setTotalMembers(membersArray.length);
    setRecentMembers(membersArray.slice(0, 5));
    
    const last12Months = getLast12Months();
    const membersByMonth = new Array(12).fill(0);
    
    membersArray.forEach(member => {
      const joinDate = new Date(member.createdAt || member.registeredDate || new Date());
      const monthIndex = joinDate.getMonth();
      const yearIndex = joinDate.getFullYear();
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      if (yearIndex === currentYear) {
        membersByMonth[monthIndex]++;
      }
    });
    
    setMemberStats({
      labels: last12Months,
      datasets: [
        {
          label: 'New Members',
          data: membersByMonth,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          tension: 0.4
        }
      ]
    });
  };

  // Fetch books data
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/getbooks?pageNumber=1&pageSize=100`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  };

  // Process books data
  const processBooksData = async (booksData) => {
    const booksArray = Array.isArray(booksData) ? booksData : booksData.items || [];
    setTotalBooks(booksArray.length);
    
    const newReleasesResponse = await fetch(`${API_BASE_URL}/books/newreleases?pageNumber=1&pageSize=100`, {
      method: 'GET',
      headers
    });
    
    if (!newReleasesResponse.ok) {
      throw new Error(`API error: ${newReleasesResponse.status}`);
    }
    
    const newReleasesData = await newReleasesResponse.json();
    const newReleasesArray = Array.isArray(newReleasesData) ? newReleasesData : newReleasesData.items || [];
    
    const last12Months = getLast12Months();
    const booksByMonth = new Array(12).fill(0);
    
    newReleasesArray.forEach(book => {
      const publishDate = new Date(book.publicationDate || book.createdAt || new Date());
      const monthIndex = publishDate.getMonth();
      booksByMonth[monthIndex]++;
    });
    
    setBookStats({
      labels: last12Months,
      datasets: [
        {
          label: 'New Books',
          data: booksByMonth,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.4
        }
      ]
    });
  };

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders?pageNumber=1&pageSize=100`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  // Process orders data
  const processOrdersData = (ordersData) => {
    const ordersArray = Array.isArray(ordersData) ? ordersData : ordersData.items || [];
    setTotalOrders(ordersArray.length);
    setRecentOrders(ordersArray.slice(0, 5)); 
    
    let revenue = 0;
    ordersArray.forEach(order => {
      revenue += order.totalAmount || 0;
    });
    setTotalRevenue(revenue);
    
    const last12Months = getLast12Months();
    const ordersByMonth = new Array(12).fill(0);
    const revenueByMonth = new Array(12).fill(0);
    
    ordersArray.forEach(order => {
      const orderDate = new Date(order.orderDate || order.createdAt || new Date());
      const monthIndex = orderDate.getMonth();
      
      ordersByMonth[monthIndex]++;
      revenueByMonth[monthIndex] += order.totalAmount || 0;
    });
    
    setOrderStats({
      labels: last12Months,
      datasets: [
        {
          label: 'Orders',
          data: ordersByMonth,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          tension: 0.4
        }
      ]
    });
    
    const revenueData = {
      labels: last12Months,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenueByMonth,
          borderColor: '#EC4899',
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          tension: 0.4
        }
      ]
    };
    
    setRevenueStats(revenueData);
  };

  // Fetch genre distribution
  const fetchGenreDistribution = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/genres`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching genre distribution:', error);
      throw error;
    }
  };

  // Process genre distribution
  const processGenresData = async (genres) => {
    const genreData = [];
    const genreLabels = [];
    const backgroundColors = [];
    
    const generateRandomColor = () => {
      const r = Math.floor(Math.random() * 200 + 55);
      const g = Math.floor(Math.random() * 200 + 55);
      const b = Math.floor(Math.random() * 200 + 55);
      return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };
    
    const genresArray = Array.isArray(genres) ? genres : genres.items || [];
    const top10Genres = genresArray.slice(0, 10);
    
    for (const genre of top10Genres) {
      const genreResponse = await fetch(`${API_BASE_URL}/books/search/genre/${encodeURIComponent(genre)}?pageNumber=1&pageSize=1`, {
        method: 'GET',
        headers
      });
      
      if (genreResponse.ok) {
        const genreBooks = await genreResponse.json();
        const count = genreBooks.totalItems || genreBooks.totalCount || 0;
        genreData.push(count);
        genreLabels.push(genre);
        backgroundColors.push(generateRandomColor());
      }
    }
    
    setGenreDistribution({
      labels: genreLabels,
      datasets: [
        {
          data: genreData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }
      ]
    });
  };

  // Fetch order status distribution
  const fetchOrderStatusDistribution = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders?pageNumber=1&pageSize=100`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      throw error;
    }
  };

  // Process order status distribution
  const processOrderStatusData = (ordersData) => {
    const ordersArray = Array.isArray(ordersData) ? ordersData : ordersData.items || [];
    
    const statusCounts = {
      'Pending': 0,
      'Processing': 0,
      'Shipped': 0,
      'Completed': 0,
      'Cancelled': 0
    };
    
    ordersArray.forEach(order => {
      const status = order.status || 'Pending';
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });
    
    setOrderStatusDistribution({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(245, 158, 11, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(99, 102, 241, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }
      ]
    });
  };

  // Fetch bestselling books
  const fetchBestsellingBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/bestsellers?pageNumber=1&pageSize=10`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bestselling books:', error);
      throw error;
    }
  };

  // Process bestselling books
  const processBestsellersData = (bestsellersData) => {
    const booksArray = Array.isArray(bestsellersData) ? bestsellersData : bestsellersData.items || [];
    setBestsellingBooks(booksArray);
  };

  // Helper function to get last 12 months
  const getLast12Months = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const today = new Date();
    const currentMonth = today.getMonth();
    
    const last12Months = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last12Months.unshift(months[monthIndex]);
    }
    
    return last12Months;
  };

  // Revenue stats state
  const [revenueStats, setRevenueStats] = useState({
    labels: [],
    datasets: []
  });

  // Common chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  // Handle navigation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  // Refresh dashboard data
  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <div className="admin-db-container">
      <div className="admin-db-main-content">
        <div className="admin-db-header">
          <h1>Dashboard</h1>
          <div className="admin-db-actions">
            <button className="admin-db-refresh-btn" onClick={handleRefresh}>
              <RefreshCw size={20} />
              <span>Refresh</span>
            </button>
            <div className="admin-db-search">
              <Search size={20} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-db-loading">
            <div className="admin-db-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="admin-db-stats-grid">
              <div className="admin-db-stat-card">
                <div className="admin-db-stat-icon admin-db-stat-members">
                  <Users size={24} />
                </div>
                <div className="admin-db-stat-content">
                  <h3>Total Members</h3>
                  <h2>{totalMembers}</h2>
                </div>
              </div>
              
              <div className="admin-db-stat-card">
                <div className="admin-db-stat-icon admin-db-stat-orders">
                  <ShoppingBag size={24} />
                </div>
                <div className="admin-db-stat-content">
                  <h3>Total Orders</h3>
                  <h2>{totalOrders}</h2>
                </div>
              </div>
              
              <div className="admin-db-stat-card">
                <div className="admin-db-stat-icon admin-db-stat-books">
                  <BookOpen size={24} />
                </div>
                <div className="admin-db-stat-content">
                  <h3>Total Books</h3>
                  <h2>{totalBooks}</h2>
                </div>
              </div>
              
              <div className="admin-db-stat-card">
                <div className="admin-db-stat-icon admin-db-stat-revenue">
                  <DollarSign size={24} />
                </div>
                <div className="admin-db-stat-content">
                  <h3>Total Revenue</h3>
                  <h2>${totalRevenue.toFixed(2)}</h2>
                </div>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <>
                {/* Charts */}
                <div className="admin-db-chart-section">
                  <div className="admin-db-chart-container">
                    <h3>Sales Overview</h3>
                    <div className="admin-db-period-selector">
                      <button className={dataPeriod === 'monthly' ? 'admin-db-active' : ''} onClick={() => setDataPeriod('monthly')}>Monthly</button>
                      <button className={dataPeriod === 'weekly' ? 'admin-db-active' : ''} onClick={() => setDataPeriod('weekly')}>Weekly</button>
                      <button className={dataPeriod === 'daily' ? 'admin-db-active' : ''} onClick={() => setDataPeriod('daily')}>Daily</button>
                    </div>
                    <div className="admin-db-chart-wrapper">
                      {revenueStats.labels && revenueStats.datasets && (
                        <Line data={revenueStats} options={lineChartOptions} />
                      )}
                    </div>
                  </div>
                  
                  <div className="admin-db-chart-container">
                    <h3>New Members</h3>
                    <div className="admin-db-chart-wrapper">
                      {memberStats.labels && memberStats.datasets && (
                        <Line data={memberStats} options={lineChartOptions} />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="admin-db-chart-section">
                  <div className="admin-db-chart-container">
                    <h3>Book Categories</h3>
                    <div className="admin-db-chart-wrapper">
                      {genreDistribution.labels && genreDistribution.datasets && (
                        <Doughnut data={genreDistribution} options={doughnutChartOptions} />
                      )}
                    </div>
                  </div>
                  
                  <div className="admin-db-chart-container">
                    <h3>Order Status</h3>
                    <div className="admin-db-chart-wrapper">
                      {orderStatusDistribution.labels && orderStatusDistribution.datasets && (
                        <Pie data={orderStatusDistribution} options={doughnutChartOptions} />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Recent Orders and Members */}
                <div className="admin-db-tables-section">
                  <div className="admin-db-table-container">
                    <div className="admin-db-table-header">
                      <h3>Recent Orders</h3>
                      <button onClick={() => handleTabChange('orders')}>View All</button>
                    </div>
                    <table className="admin-db-data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => {
                          const statusText = String(order?.status || 'Unknown').toLowerCase();
                          const statusDisplay = order?.status || 'Unknown';
                          
                          return (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.customerName || order.user?.name || 'N/A'}</td>
                              <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <span className={`admin-db-status-badge admin-db-status-${statusText}`}>
                                  {statusDisplay}
                                </span>
                              </td>
                              <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="admin-db-table-container">
                    <div className="admin-db-table-header">
                      <h3>New Members</h3>
                      <button onClick={() => handleTabChange('members')}>View All</button>
                    </div>
                    <table className="admin-db-data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMembers.map(member => (
                          <tr key={member.id}>
                            <td>#{member.id}</td>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{new Date(member.registeredDate || member.createdAt || new Date()).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Bestselling Books */}
                <div className="admin-db-bestsellers">
                  <div className="admin-db-table-header">
                    <h3>Bestselling Books</h3>
                    <button onClick={() => handleTabChange('books')}>View All Books</button>
                  </div>
                  <div className="admin-db-books-grid">
                    {bestsellingBooks.map(book => (
                      <div className="admin-db-book-card" key={book.id}>
                        <div className="admin-db-book-cover">
                          <img src={book.coverImagePath ? `https://localhost:7039/${book.coverImagePath}` : "/placeholder-book-cover.jpg"} alt={book.title} />
                        </div>
                        <div className="admin-db-book-info">
                          <h4>{book.title}</h4>
                          <p className="admin-db-book-author">by {book.author}</p>
                          <div className="admin-db-book-meta">
                            <span className="admin-db-book-price">${book.price?.toFixed(2) || '0.00'}</span>
                            <div className="admin-db-book-rating">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={star <= (book.averageRating || 0) ? "admin-db-star admin-db-star-filled" : "admin-db-star"}>★</span>
                              ))}
                              <span className="admin-db-rating-value">({(book.averageRating || 0).toFixed(1)})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'members' && (
              <div className="admin-db-tab-content">
                <h2>Member Management</h2>
                <p>Detailed member management functionality would go here.</p>
              </div>
            )}

            {activeTab === 'books' && (
              <div className="admin-db-tab-content">
                <h2>Book Management</h2>
                <p>Detailed book management functionality would go here.</p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="admin-db-tab-content">
                <h2>Order Management</h2>
                <p>Detailed order management functionality would go here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;