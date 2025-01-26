import React, { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [formData, setFormData] = useState({ stock: "" });
  const [data, setData] = useState(null);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FLASK_API}`,
        {
          stock: formData.stock,
        }
      );
      if (response.status === 200) {
        setData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // Generate chart data (Low, High, Close)
  const generateChartData = () => {
    if (!data || !data.future) return null;

    const labels = data.future.map((item) =>
      new Date(item.Date).toLocaleDateString()
    );
    const lowData = data.future.map((item) => item.Low);
    const highData = data.future.map((item) => item.High);
    const closeData = data.future.map((item) => item.Close);

    return {
      labels,
      datasets: [
        {
          label: "Low",
          data: lowData,
          borderColor: "#f44336", // red
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: "High",
          data: highData,
          borderColor: "#4caf50", // green
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: "Close",
          data: closeData,
          borderColor: "#2196f3", // blue
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
      ],
    };
  };

  // Chart.js configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  // Render company officers in sidebar
  const renderOfficers = () => {
    if (
      !data?.info?.companyOfficers ||
      data.info.companyOfficers.length === 0
    ) {
      return <p>No company officers found.</p>;
    }

    return data.info.companyOfficers.map((officer, index) => (
      <div key={index} className="card mb-3">
        <div className="card-body p-2">
          <h6 className="card-title mb-1">{officer.name}</h6>
          <p className="card-text mb-1" style={{ fontSize: "0.9rem" }}>
            <strong>Title:</strong> {officer.title}
          </p>
          {officer.age && (
            <p className="card-text mb-1" style={{ fontSize: "0.9rem" }}>
              <strong>Age:</strong> {officer.age}
            </p>
          )}
          {officer.totalPay && (
            <p className="card-text mb-1" style={{ fontSize: "0.9rem" }}>
              <strong>Total Pay:</strong> ${officer.totalPay.toLocaleString()}
            </p>
          )}
          {officer.exercisedValue !== undefined && (
            <p className="card-text mb-1" style={{ fontSize: "0.9rem" }}>
              <strong>Exercised Value:</strong> $
              {officer.exercisedValue.toLocaleString()}
            </p>
          )}
          {officer.unexercisedValue !== undefined && (
            <p className="card-text mb-1" style={{ fontSize: "0.9rem" }}>
              <strong>Unexercised Value:</strong> $
              {officer.unexercisedValue.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar for Officers (col-3) */}
        <aside className="col-md-3 bg-light vh-100 d-none d-md-block p-3">
          <h5 className="mb-3">Company Officers</h5>
          {renderOfficers()}
        </aside>

        {/* Main Content (col-9) */}
        <main className="col-md-9">
          <div className="container my-4">
            {/* Header Section */}
            <header className="text-center mb-4">
              <h1 className="mb-3">AI/ML Stock Information Viewer</h1>
              <p className="text-muted">
                Explore real-time and historical market data with advanced
                predictive modeling at your fingertips. Our AI/ML Stock
                Information Viewer harnesses cutting-edge analytics to help you
                make informed investment decisions. Dive deep into stock trends,
                visualize future performance, and stay ahead of the curve—all in
                one convenient platform.
              </p>
            </header>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  name="stock"
                  className="form-control"
                  placeholder="Enter stock symbol, e.g. TSLA"
                  value={formData.stock}
                  onChange={handleChange}
                />
                <button className="btn btn-primary">Search</button>
              </div>
            </form>

            {data && (
              <>
                {/* Chart Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-dark text-white">
                        Stock Chart
                      </div>
                      <div className="card-body">
                        {generateChartData() ? (
                          <div style={{ height: "400px" }}>
                            <Line
                              data={generateChartData()}
                              options={chartOptions}
                            />
                          </div>
                        ) : (
                          <p>No chart data available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="row">
                  {/* General Information */}
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-header bg-primary text-white">
                        General Information
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{data.info.longName}</h5>

                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Sector:</strong> {data.info.sector}
                          </li>
                          <li className="list-group-item">
                            <strong>Industry:</strong> {data.info.industry}
                          </li>
                          <li className="list-group-item">
                            <strong>Address:</strong> {data.info.address1},{" "}
                            {data.info.city}, {data.info.state} {data.info.zip},{" "}
                            {data.info.country}
                          </li>
                          <li className="list-group-item">
                            <strong>Website:</strong>{" "}
                            <a
                              href={data.info.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {data.info.website}
                            </a>
                          </li>
                          <li className="list-group-item">
                            <strong>Currency:</strong> {data.info.currency}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-header bg-info text-white">
                        Stock Information
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Current Price:</strong> $
                            {data.info.currentPrice}
                          </li>
                          <li className="list-group-item">
                            <strong>Previous Close:</strong> $
                            {data.info.previousClose}
                          </li>
                          <li className="list-group-item">
                            <strong>Open:</strong> ${data.info.open}
                          </li>
                          <li className="list-group-item">
                            <strong>Day High:</strong> ${data.info.dayHigh}
                          </li>
                          <li className="list-group-item">
                            <strong>Day Low:</strong> ${data.info.dayLow}
                          </li>
                          <li className="list-group-item">
                            <strong>Volume:</strong>{" "}
                            {data.info.volume?.toLocaleString()}
                          </li>
                          <li className="list-group-item">
                            <strong>Avg Volume (10d):</strong>{" "}
                            {data.info.averageDailyVolume10Day?.toLocaleString()}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-header bg-success text-white">
                        Financial Metrics
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Market Cap:</strong> $
                            {data.info.marketCap.toLocaleString()}
                          </li>
                          <li className="list-group-item">
                            <strong>Beta:</strong> {data.info.beta}
                          </li>
                          <li className="list-group-item">
                            <strong>Book Value:</strong> ${data.info.bookValue}
                          </li>
                          <li className="list-group-item">
                            <strong>Trailing PE:</strong> {data.info.trailingPE}
                          </li>
                          <li className="list-group-item">
                            <strong>Forward PE:</strong> {data.info.forwardPE}
                          </li>
                          <li className="list-group-item">
                            <strong>Profit Margins:</strong>{" "}
                            {(data.info.profitMargins * 100).toFixed(2)}%
                          </li>
                          <li className="list-group-item">
                            <strong>Revenue Growth:</strong>{" "}
                            {(data.info.revenueGrowth * 100).toFixed(2)}%
                          </li>
                          <li className="list-group-item">
                            <strong>Total Revenue:</strong> $
                            {data.info.totalRevenue.toLocaleString()}
                          </li>
                          <li className="list-group-item">
                            <strong>EBITDA:</strong> $
                            {data.info.ebitda?.toLocaleString()}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Insider & Institutional Holdings */}
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-header bg-warning text-white">
                        Insider & Institutional
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Insider Holdings:</strong>{" "}
                            {(data.info.heldPercentInsiders * 100).toFixed(2)}%
                          </li>
                          <li className="list-group-item">
                            <strong>Institutional Holdings:</strong>{" "}
                            {(data.info.heldPercentInstitutions * 100).toFixed(
                              2
                            )}
                            %
                          </li>
                          <li className="list-group-item">
                            <strong>Short Ratio:</strong> {data.info.shortRatio}
                          </li>
                          <li className="list-group-item">
                            <strong>Shares Short:</strong>{" "}
                            {data.info.sharesShort?.toLocaleString()}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Analyst Ratings */}
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-header bg-danger text-white">
                        Analyst Ratings
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Recommendation:</strong>{" "}
                            {data.info.recommendationKey?.toUpperCase()}
                          </li>
                          <li className="list-group-item">
                            <strong>Target High:</strong> $
                            {data.info.targetHighPrice}
                          </li>
                          <li className="list-group-item">
                            <strong>Target Low:</strong> $
                            {data.info.targetLowPrice}
                          </li>
                          <li className="list-group-item">
                            <strong>Target Mean:</strong> $
                            {data.info.targetMeanPrice}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Additional Risk Metrics */}
                  <div className="col-lg-4 mb-4">
                    <div className="card">
                      <div className="card-header bg-secondary text-white">
                        Risk Metrics
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Audit Risk:</strong> {data.info.auditRisk}
                          </li>
                          <li className="list-group-item">
                            <strong>Board Risk:</strong> {data.info.boardRisk}
                          </li>
                          <li className="list-group-item">
                            <strong>Shareholder Rights Risk:</strong>{" "}
                            {data.info.shareHolderRightsRisk}
                          </li>
                          <li className="list-group-item">
                            <strong>Overall Risk:</strong>{" "}
                            {data.info.overallRisk}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* News Section */}
                  <div className="col-lg-12">
                    <h2 className="mb-3">Latest News</h2>
                    {Array.isArray(data.news) && data.news.length > 0 ? (
                      data.news.map((newsItem, index) => (
                        <div key={index} className="card mb-3">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img
                                src={
                                  newsItem.thumbnail?.resolutions[0]?.url ||
                                  "https://via.placeholder.com/200"
                                }
                                className="img-fluid rounded-start"
                                alt={newsItem.title}
                              />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">{newsItem.title}</h5>
                                <p className="card-text">
                                  <small className="text-muted">
                                    Publisher: {newsItem.publisher}
                                  </small>
                                </p>
                                <a
                                  href={newsItem.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-link"
                                >
                                  Read more
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No news available.</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Disclaimer */}
            <footer className="text-center mt-5">
              <p className="text-muted">
                Disclaimer: All information is provided for educational
                purposes. This does not constitute financial advice. Always do
                your own research.
              </p>
            </footer>
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default App;
