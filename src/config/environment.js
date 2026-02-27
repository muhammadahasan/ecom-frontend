const config = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    timeout: 30000,
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.yourdomain.com/api',
    timeout: 30000,
  }
};

const environment = import.meta.env.MODE || 'development';

export default config[environment];