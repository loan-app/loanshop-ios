import axios from './axios';

export function createApiUrl(path) {
  return `http://api.liqun888.com${path}`;
}

// export function createApiUrl(path) {
//   return `http://api.i869.cn${path}`;
// }

export function createH5Url(path) {
  return createApiUrl(path).replace("api", "m");
}

/**
 * 登陆
 * **/
export function login(data) {
  return axios.post(createApiUrl('/user/login'), data);
}

/**
 * 退出登录
 * **/
export function logout(data) {
  return axios.post(createApiUrl('/user/logout'), data);
}

/**
 * 注册
 * **/
export function register(data) {
  return axios.post(createApiUrl('/user/register'), data);
}

/**
 * 发送验证码
 * **/
export function sendCode(data) {
  return axios.post(createApiUrl('/verification-code/get'), data);
}

/**
 * 发送图形验证码
 * **/
export function getImageCode(data) {
  return axios.get(createApiUrl('/captcha/'), {params: data});
}

/**
 * 校验验证码
 * **/
export function checkCode(data) {
  return axios.get(createApiUrl('/verification-code/verify'), {params: data});
}

/**
 * 校验手机号
 * **/
export function checkPhone(data) {
  return axios.post(createApiUrl('/user/resetMobile/verification'),data);
}

/**
 * 忘记密码
 * **/
export function forget(data) {
  return axios.post(createApiUrl('/user/password/forget'), data);
}

/**
 * 修改密码
 * **/
export function modifyPassword(data) {
  return axios.post(createApiUrl('/user/password/reset'), data);
}

/**
 * 设置交易密码
 * **/
export function setPayPassword(data) {
  return axios.post(createApiUrl('/user/trading-password/set'), data);
}

/**
 * 修改交易密码
 * **/
export function modifyPayPassword(data) {
  return axios.post(createApiUrl('/user/trading-password/reset'), data);
}

/**
 * 用户资料
 * **/
export function getUserProfile() {
  return axios.get(createApiUrl('/user/info'));
}

/**
 * 提现请求
 * **/
export function cashRequest(data) {
  return axios.get(createApiUrl('/withdraw/handle-fee'), {params: data});
}

/**
 * 提现
 * **/
export function cash(data) {
  return axios.post(createApiUrl('/withdraw/create'), data);
}

/**
 * 充值
 * **/
export function deposit(data) {
  return axios.post(createApiUrl('/deposit/create'), data);
}

/**
 * 实名认证
 * **/
export function authenticate(data) {
  return axios.post(createApiUrl('/user/authenticate'), data);
}

/**
 * 绑定银行卡
 * **/
export function tiedCard(data) {
  return axios.post(createApiUrl('/user/tied-card'), data);
}

/**
 * 投资
 * **/
export function invest(data) {
  return axios.post(createApiUrl('/invest/create'), data);
}

/**
 * 银行卡详情
 * **/
export function bankCardDetail() {
  return axios.get(createApiUrl('/user/bank-card/info'));
}

/**
 * 资金流水
 * **/
export function capitalRecord(data) {
  return axios.get(createApiUrl('/cash/'), {params: data});
}

/**
 * 投资记录
 * **/
export function investList(data) {
  return axios.get(createApiUrl('/invest/'), {params: data});
}

/**
 * 投资详情
 * **/
export function capitalDetail(data) {
  return axios.get(createApiUrl('/invest/detail'), {params: data});
}

/**
 * 消息列表
 * **/
export function messageList(data) {
  return axios.get(createApiUrl('/user-message/'), {params: data});
}

/**
 * 红包列表
 * **/
export function bonusList(data) {
  return axios.get(createApiUrl('/user/member-coupon'), {params: data});
}

/**
 * 可用投资红包
 * **/
export function getBonusListForBuy(data) {
  return axios.get(createApiUrl('/invest/get-coupon'), {params: data});
}

/**
 * 消息详情
 * **/
export function messageDetail(data) {
  return axios.get(createApiUrl('/user-message/detail'), {params: data});
}


/**
 * 理财列表
 * **/
export function financeList(data) {
    console.log('--------financeList' + data.toString());
    return axios.get(createApiUrl('/finance-base/'), {params: data});
}

/**
 * 理财详情
 * **/
export function financeDetail(data) {
    console.log('--------financeDetail');
    return axios.get(createApiUrl('/finance-base/detail'), {params: data});
}

/**
 * banner列表
 * **/
export function getBanner() {
  return axios.get(createApiUrl('/banner/'));
}

/**
 * ads列表
 * **/
export function getAds() {
  return axios.get(createApiUrl('/banner/ad-operations'));
}

/**
 * 公告列表
 * **/
export function getNotification(data){
  return axios.get(createApiUrl('/notice/list'), {params: data});
}

/**
 * 公告详情
 * **/
export function getNotifiyDetail(data){
  return axios.get(createApiUrl('/notice/detail'), {params: data});
}

/**
 * 首页
 * **/
export function getHome() {
  return axios.get(createApiUrl('/index/'));
}

/**
 * 银行列表
 * **/
export function getBankList() {
  return axios.get(createApiUrl('/user/bank'));
}

/**
 * 上传意见反馈
 * **/
export function uploadFeedback(data) {
  return axios.post(createApiUrl('/feedback/create'), data)
}

/**
 * 检查更新
 * **/
export function checkUpdate() {
  return axios.get(createApiUrl('/app/version/info?os=ios'));
}