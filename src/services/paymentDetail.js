import { stringify } from 'qs';
import request from '@/utils/request';

// 缴费项目名称列表
export async function itemNames(params) {
  return request(`/joinus/ipay/items/itemNames/v1?${stringify(params)}`);
}

// 获取年级班级列表
export async function gradeAndClass(params) {
  return request(`/joinus/ipay/students/grades/v1?${stringify(params)}`);
}

// 请求明细列表数据
export async function stuItemsDetail(params) {
  return request(`/joinus/ipay/items/stuItemsDetail/v1?${stringify(params)}`);
}

