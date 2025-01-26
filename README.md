# StockVision AI

StockVision AI is a cutting-edge platform that empowers investors with actionable insights by leveraging Artificial Intelligence and Machine Learning. This project combines real-time stock data, historical analysis, and advanced predictive modeling to make informed investment decisions easier and more accessible.

## Features

- **Real-Time Data Integration**: Access the latest stock market data for timely decision-making.
- **AI/ML Predictions**: Predict stock prices, including high, low, and close values, for the next 30 days using advanced machine learning models.
- **Historical Analysis**: View detailed stock history to analyze trends and patterns.
- **User-Friendly Interface**: Intuitive, clean, and responsive design for easy navigation and exploration of data.
- **Backend API**: Powered by Flask, providing seamless data processing and predictive capabilities.

## Technology Stack

### Frontend

- **React.js**: For a dynamic and responsive user interface.
- **Axios**: To handle API requests.
- **Bootstrap**: For styling and responsiveness.

### Backend

- **Flask**: API handling, data preprocessing, and ML model integration.
- **Prophet**: Machine learning library for time-series forecasting.
- **Yahoo Finance API**: For fetching real-time and historical stock data.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Python (>=3.8)
- Node.js and npm
- Virtual environment manager (e.g., `venv`)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/OldAlexhub/StockVisionAI.git
   cd stockvision-ai/backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. Install required Python libraries:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   flask run
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The application should now be accessible at `http://localhost:3000`.

## API Endpoints

### POST `/stocksearch`

**Description**: Fetches historical data and generates predictions for the given stock ticker.

**Request Body**:

```json
{
  "stock": "AAPL"
}
```

**Response**:

```json
{
  "future": [
    { "Date": "2025-01-15", "High": 150.25, "Low": 145.65, "Close": 148.32 },
    ...
  ],
  "history": [
    { "Date": "2025-01-10", "Open": 148.3, "High": 149.7, "Low": 147.0, "Close": 148.5, "Volume": 1000000 },
    ...
  ]
}
```

## Future Enhancements

- Add sentiment analysis from financial news and social media.
- Implement personalized stock recommendations based on user profiles.
- Deploy the application to a cloud platform for greater scalability.
- Introduce advanced visualizations for interactive data exploration.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

### Author

Developed by [Mohamed Gad](https://github.com/OldAlexhub/StockVisionAI.git). Feel free to reach out for collaboration or feedback!
