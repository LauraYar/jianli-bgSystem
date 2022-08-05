import axios from 'axios';
import router from '../../router';

const axiosInstance = axios.create();
axiosInstance.defaults.timeout = 60000;

axiosInstance.interceptors.request.use(
  (config) => {
    const newConfig = {
      ...config,
    };
    return newConfig;
  },
  (error) => Promise.reject(error)
);

const handleErrorRequest = (error) => {
  const { response } = error;
  const status = response ? response.status : 408;
  if (response) {
    const { data } = response;
    const message = data.message || '服务器发送错误，请稍后再试';
    if (status === 401) {
      alert('登录状态过期，请重新登录!');
    } else if (status === 403) {
      alert('没有权限，联系管理员!');
    } else {
      alert(message);
    }
  } else {
    alert('网络超时!');
  }
  router.replace('/login');
};

const successRes = (res) => {
  switch (true) {
    case res.data.error_code === 0:
      return res.data.data;
    case res.data.error_code === 1:
      alert('res.data');
      return Promise.reject(res.data);
    default:
      return res.data;
  }
};

const errorRes = (error) => {
  handleErrorRequest(error);
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(successRes, errorRes);

export default {
  post(url = '', data = {}, config = {}) {
    return axiosInstance.post(url, data, config);
  },
  put(url = '', data = {}, config = {}) {
    return axiosInstance.put(url, data, config);
  },
  get(url = '', params = {}, config = {}) {
    const OPTIONS = Object.assign(
      {
        params,
      },
      config
    );
    return axiosInstance.get(url, OPTIONS);
  },
  delete(url = '', params = {}, config = {}) {
    const OPTIONS = Object.assign(
      {
        params,
      },
      config
    );
    return axiosInstance.delete(url, OPTIONS);
  },
  export(url = '', params = {}, config = {}) {
    const OPTIONS = Object.assign(
      {
        params,
      },
      config,
      { responseType: 'blob' }
    );
    return axiosInstance.get(url, OPTIONS);
  },
};
