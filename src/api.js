import axios from "axios";
import axiosRetry from "axios-retry";

// Configure axios-retry globally
axiosRetry(axios, {
    retries: 3,
    retryCondition: (error) => error.response?.status === 429,
    retryDelay: (retryCount) => retryCount * 2000,
});

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc.documentElement.textContent;
};

// Set the base URL for all requests
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "https://quiz-backend-vz42.onrender.com";


// Add a response interceptor to decode HTML entities
axios.interceptors.response.use(
    (response) => {
        if (response.data && Array.isArray(response.data)) {
            // Decode each quiz's "question" field if it's an array
            response.data = response.data.map((item) => {
                if (item.question) {
                    item.question = decodeHtmlEntities(item.question);
                }
                return item;
            });
        } else if (response.data && typeof response.data === "object") {
            // Decode the "question" field if the response is an object
            if (response.data.question) {
                response.data.question = decodeHtmlEntities(response.data.question);
            }
        }
        return response;
    },
    (error) => {
        // Handle errors as usual
        return Promise.reject(error);
    }
);

export default axios;
