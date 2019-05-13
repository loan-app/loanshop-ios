import axios from './axios';
import global from "../styles/global";
import {HttpKey} from '../config/constants';

export function createApiUrl(path) {
  return `http://api.chengzilicai888.com${path}`;
}

// export function createApiUrl(path) {
//   return `http://api.i869.cn${path}`;
// }

var forge = require('node-forge')

export function createH5Url(path) {
  return createApiUrl(path).replace("api", "m");
}

/**
 * 登陆
 * **/
export function login(data) {
  return requestSign(data,'/user/login','POST')

  // return axios.post(createApiUrl('/user/login'), data);
}

/**
 * 退出登录
 * **/
export function logout(data) {
  return requestSign(data,'/user/logout','POST')

  // return axios.post(createApiUrl('/user/logout'), data);
}

/**
 * 注册
 * **/
export function register(data) {
  return requestSign(data,'/user/register','POST')

  // return axios.post(createApiUrl('/user/register'), data);
}

/**
 * 发送验证码
 * **/
export function sendCode(data) {
  return requestSign(data,'/verification-code/get','POST')

  // return axios.post(createApiUrl('/verification-code/get'), data, {headers:{"times":currentTime, "sign":signMd5.digest().toHex()}});
}

/**
 * 发送图形验证码
 * **/
export function getImageCode(data) {
  return requestSign(data,'/captcha/')

  // return axios.get(createApiUrl('/captcha/'), {params: data});
}

/**
 * 校验验证码
 * **/
export function checkCode(data) {
  return requestSign(data,'/verification-code/verify')

  // return axios.get(createApiUrl('/verification-code/verify'), {params: data});
}

/**
 * 校验手机号
 * **/
export function checkPhone(data) {
  return requestSign(data,'/user/resetMobile/verification','POST')

  // return axios.post(createApiUrl('/user/resetMobile/verification'),data);
}

/**
 * 忘记密码
 * **/
export function forget(data) {
  return requestSign(data,'/user/password/forget','POST')

  // return axios.post(createApiUrl('/user/password/forget'), data);
}

/**
 * 修改密码
 * **/
export function modifyPassword(data) {
  return requestSign(data,'/user/password/reset','POST')

  // return axios.post(createApiUrl('/user/password/reset'), data);
}

/**
 * 设置交易密码
 * **/
export function setPayPassword(data) {
  return requestSign(data,'/user/trading-password/set','POST')

  // return axios.post(createApiUrl('/user/trading-password/set'), data);
}

/**
 * 修改交易密码
 * **/
export function modifyPayPassword(data) {
  return requestSign(data,'/user/trading-password/reset','POST')

  // return axios.post(createApiUrl('/user/trading-password/reset'), data);
}

/**
 * 用户资料
 * **/
export function getUserProfile() {
  return requestSign(null,'/user/info')

  // return axios.get(createApiUrl('/user/info'));
}

/**
 * 提现请求
 * **/
export function cashRequest(data) {
  return requestSign(data,'/withdraw/handle-fee')

  // return axios.get(createApiUrl('/withdraw/handle-fee'), {params: data});
}

/**
 * 提现
 * **/
export function cash(data) {
  return requestSign(data,'/withdraw/create','POST')

  // return axios.post(createApiUrl('/withdraw/create'), data);
}

/**
 * 充值
 * **/
export function deposit(data) {
  return requestSign(data,'/deposit/create','POST')

  // return axios.post(createApiUrl('/deposit/create'), data);
}

/**
 * 实名认证
 * **/
export function authenticate(data) {
  return requestSign(data,'/user/authenticate','POST')

  // return axios.post(createApiUrl('/user/authenticate'), data);
}

/**
 * 绑定银行卡
 * **/
export function tiedCard(data) {
  return requestSign(data,'/user/tied-card','POST')

  // return axios.post(createApiUrl('/user/tied-card'), data);
}

/**
 * 投资
 * **/
export function invest(data) {
  return requestSign(data,'/invest/create','POST')

  // return axios.post(createApiUrl('/invest/create'), data);
}

/**
 * 银行卡详情
 * **/
export function bankCardDetail() {
  return requestSign(null,'/user/bank-card/info')

  // return axios.get(createApiUrl('/user/bank-card/info'));
}

/**
 * 资金流水
 * **/
export function capitalRecord(data) {
  return requestSign(data,'/cash/')

  // return axios.get(createApiUrl('/cash/'), {params: data});
}

/**
 * 投资记录
 * **/
export function investList(data) {
  return requestSign(data,'/invest/')

  // return axios.get(createApiUrl('/invest/'), {params: data});
}

/**
 * 投资详情
 * **/
export function capitalDetail(data) {
  return requestSign(data,'/invest/detail')

  // return axios.get(createApiUrl('/invest/detail'), {params: data});
}

/**
 * 消息列表
 * **/
export function messageList(data) {
  return requestSign(data,'/user-message/')

  // return axios.get(createApiUrl('/user-message/'), {params: data});
}

/**
 * 红包列表
 * **/
export function bonusList(data) {
  return requestSign(data,'/user/member-coupon')

  // return axios.get(createApiUrl('/user/member-coupon'), {params: data});
}

/**
 * 可用投资红包
 * **/
export function getBonusListForBuy(data) {
  return requestSign(data,'/invest/get-coupon')

  // return axios.get(createApiUrl('/invest/get-coupon'), {params: data});
}

/**
 * 消息详情
 * **/
export function messageDetail(data) {
  return requestSign(data,'/user-message/detail')

  // return axios.get(createApiUrl('/user-message/detail'), {params: data});
}


/**
 * 理财列表
 * **/
export function financeList(data) {
    // console.log('--------financeList' + data.toString());
  return requestSign(data,'/finance-base/')

  // return axios.get(createApiUrl('/finance-base/'), {params: data});
}

/**
 * 理财详情
 * **/
export function financeDetail(data) {
    // console.log('--------financeDetail');
  return requestSign(data,'/finance-base/detail')

  // return axios.get(createApiUrl('/finance-base/detail'), {params: data});
}

/**
 * banner列表
 * **/
export function getBanner() {
  return requestSign(null,'/banner/')

  // return axios.get(createApiUrl('/banner/'));
}

/**
 * ads列表
 * **/
export function getAds() {
  return requestSign(null,'/banner/ad-operations')

  // return axios.get(createApiUrl('/banner/ad-operations'));
}

/**
 * 公告列表
 * **/
export function getNotification(data){
  return requestSign(data,'/notice/list')

  // return axios.get(createApiUrl('/notice/list'), {params: data});
}

/**
 * 公告详情
 * **/
export function getNotifiyDetail(data){
  return requestSign(data,'/notice/detail')

  // return axios.get(createApiUrl('/notice/detail'), {params: data});
}

/**
 * 首页
 * **/
export function getHome() {
  return requestSign(null,'/index/')

  // return axios.get(createApiUrl('/index/'));
}

/**
 * 银行列表
 * **/
export function getBankList() {
  return requestSign(null,'/user/bank')

  // return axios.get(createApiUrl('/user/bank'));
}

/**
 * 上传意见反馈
 * **/
export function uploadFeedback(data) {
  return requestSign(data,'/feedback/create','POST')
  // return axios.post(createApiUrl('/feedback/create'), data)
}

/**
 * 检查更新
 * **/
export function checkUpdate() {
  return requestSign(null,'/app/version/info?os=ios')
  // return axios.get(createApiUrl('/app/version/info?os=ios'));
}

//获取公司名字
export function getCompanyName() {
  return axios.get('http://xpz.xinyijinf.com/app?code=00006');
}


// postHeader(null, 'dads')

// postHeader({}, 'xxx', 'POST')

function requestSign(data = {}, urlStr, method = 'GET') {
  //header
  const currentTime = new Date().getTime().toString()
  let sign = `${urlStr}|${currentTime}|${HttpKey}`

  var signMd5 = forge.md.md5.create()
  signMd5.update(sign)
  console.log('requestSign', JSON.stringify(data))
  if (method === 'GET') {
    if (data === null) {
      return axios.get(createApiUrl(urlStr));
    }else{
      return axios.get(createApiUrl(urlStr), {params: data});
    }
  }else{
    return axios.post(createApiUrl(urlStr), data, {headers:{"times":currentTime, "sign":signMd5.digest().toHex()}});
  }
}