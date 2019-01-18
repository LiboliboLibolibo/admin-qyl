import { stringify } from 'qs';
import request from '@/utils/request';

// 获取首页面数据
export async function getData(params) {
  return request(`/api/v1/rechargeOrders/dashboard?${stringify(params)}`);
}

// 获取最新的10条数据
export async function recentOrders(params) {
  return request(`/api/v1/rechargeOrders/recentOrders?${stringify(params)}`);
}