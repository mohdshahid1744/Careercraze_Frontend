import axios, { AxiosInstance } from 'axios';


const createAxiosInstance = (token: string | null, role: string | null): AxiosInstance => {
    const instance = axios.create({
      baseURL: "http://localhost:3001/",
      withCredentials: true,
    });
  
    if (token) {
      instance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers.role = role;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    }
  
    return instance;
  };
  
  const userToken: string | null = localStorage.getItem('userToken');
  const userRole: string | null = 'user';
  const recruiterToken: string | null = localStorage.getItem('recruiterToken');
  const recruiterRole: string | null = 'recruiter';
  
const adminToken:string | null =localStorage.getItem('adminToken')
const adminRole:string | null='admin'
  const axiosUserInstance = createAxiosInstance(userToken, userRole);
  const axiosRecruiterInstance = createAxiosInstance(recruiterToken, recruiterRole);
  const axiosAdminInstance=createAxiosInstance(adminToken,adminRole)
  const axiosInstance = createAxiosInstance(null, null);
  
  export {
    axiosUserInstance,
    axiosRecruiterInstance,
    axiosAdminInstance,
    axiosInstance
  };
  