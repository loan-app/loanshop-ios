import axios from 'axios';
import qs from 'qs';
import localStorage from '../utils/LocalStorage';

let callback403 = () => {
};
let netWorkError = () => {
};

// Request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers = config.headers || {};
  if (global.token) {
    config.headers.token = global.token;
  }
  config.headers.osversion = global.version || '';
  config.headers.osname = global.os || '';
  // console.info('[axiosRequestInter]:',JSON.stringify(config.headers))
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Response interceptor
axios.interceptors.response.use(function (response) {
  if (global.token && response.data.code === 403) {
    callback403();
    return Promise.reject({});
  } else {
    return response;
  }
}, function (error) {
  console.log(error);
  netWorkError();
  return Promise.reject(error);
});


/**
 * 封装的`post`方法，所有非文件类型数据都使用`application/x-www-form-urlencoded`格式
 * **/
let axiosPost = axios.post.bind(axios);
axios.post = function (url, data, config) {
  config = config || {};
  config.headers = Object.assign({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }, config.headers || {});
  data = qs.stringify(data || {});
  return axiosPost(url, data, config);
};

/**
 * 封装的`upload`方法，所有包含文件（如图片，视频）的请求使用`multipart/form-data`格式
 * `formData`是`FromData`的对象，例如：
 *  let form = new FormData();
 *  form.append('avatarFile', {
 *    uri: response.uri,
 *    type: 'image/jpg',
 *    name: 'photo.jpg'
 *  });
 **/
axios.upload = function (url, formData, config) {
  config = config || {};
  config.headers = Object.assign({
    'Content-Type': 'multipart/form-data',
  }, config.headers || {});
  return axiosPost(url, formData, config);
};

// let axiosGet = axios.get.bind(axios);
// axios.get=function (url, formData, config) {
//   console.log(url);
//   return axiosGet(url);
// };

export default axios;

/**
 * 对外提供初始化token接口
 * **/
export function initCookie() {
  return new Promise((resolve) => {
    localStorage.getItem('token', cachedCookie => {
      global.token = cachedCookie || "";
      resolve(global.token);
    });

  });
}

/**
 * 注册403回调
 * **/
export function register403Callback(cb) {
  callback403 = cb;
}

/**
 * 注册网络异常回调
 * **/
export function registerNetWorkErrorCallback(cb) {
  netWorkError = cb;
}

/**
 * 清除cookie
 * **/
export function clearCookie() {
  global.token = '';
  localStorage.removeItem('token');
}

export function logoutUser() {
  clearCookie();
}

export function loginUser(token) {
  global.token = token;
  localStorage.setItem('token', token);
}
