import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const generateAuditReport = async (auditData) => {
  const access = localStorage.getItem('accessToken');

  const response = await axios.post(
    `${API_BASE_URL}/energy-audit/`,
    auditData,
    {
      headers: {
        Authorization: `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login/`,
    {
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/signup/`,
    {
      name,
      email,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const authWithGoogle = async (code) => {
  const response = await axios.get(
    `${process.env.REACT_APP_GOOGLE_API_REDIRECT_URI}?${code}`
  );
  return response;
};

export const verifyEmail = async (token) => {
  const response = await axios.get(
    `${API_BASE_URL}/auth/email-verify/?token=${token}`
  );
  return response.data;
};

export const refresh = async (refresh) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/token/refresh/`,
    {
      refresh,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response.data.messages &&
      error.response.data.messages.length > 0 &&
      error.response.data.messages[0].token_type === 'access' &&
      error.response.data.status_code === 401
    ) {
      try {
        const refresh = localStorage.getItem('refreshToken');

        const res = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          {
            refresh,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.status === 200) {
          localStorage.setItem('refreshToken', res.data.refresh);
          localStorage.setItem('accessToken', res.data.access);

          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return axios.request(error.config);
        }
      } catch (err) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
