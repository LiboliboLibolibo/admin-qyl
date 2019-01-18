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

// 获取app统计数据
export async function getStatisticData(params) {
  return request(`/api/v1/qylAppDataStatistics/home?${stringify(params)}`);
}

// 根据时间段查询用户总数列表数据
export async function userCountStatistics(params) {
  return request(`/api/v1/qylAppDataStatistics/userCountStatistics?${stringify(params)}`);
}

// 获取用户数据增长的折线图数据
export async function userGrowing(params) {
  return request(`/api/v1/qylAppDataStatistics/userGrowingCountStatistics?${stringify(params)}`);
}