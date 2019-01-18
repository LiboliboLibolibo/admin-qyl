import { stringify } from 'qs';
import request from '@/utils/request';

// 请求缴费列表
export async function items(params) {
  return request(`/joinus/ipay/items/v1?${stringify(params)}`);
}

// 缴费项目名称列表
export async function itemNames(params) {
  return request(`/joinus/ipay/items/itemNames/v1?${stringify(params)}`);
}

// 撤销项目
export async function item(params) {
  return request(`/joinus/ipay/items/v1`,  {
    method: 'PUT',
    body: params,
  });
}