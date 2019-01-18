import { stringify } from 'qs';
import request from '@/utils/request';

// 获取地市数据列表
export async function getCityList(params) {
  return request(`/api/v1/regions/getCityList?${stringify(params)}`);
}

//  获取县区数据列表
export async function getCountyListForCity(params) {
  return request(`/api/v1/regions/getCountyListForCity?${stringify(params)}`);
}

//  获取县区下学校列表数据
export async function getSchoolListForCounty(params) {
  return request(`/api/v1/regions/getSchoolListForCounty?${stringify(params)}`);
}

// 获取所有开通一卡通的学校数据统计列表
export async function totalCountGroupBySchool(params) {
  return request(`/api/v1/rechargeOrders/totalCountGroupBySchool?${stringify(params)}`);
}

// 获取每日充值金额折线图数据列表
export async function countAndAmount(params) {
  return request(`/api/v1/rechargeOrders/countAndAmount?${stringify(params)}`);
}