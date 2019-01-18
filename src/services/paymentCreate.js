import { stringify } from 'qs';
import request from '@/utils/request';

// 获取年级班级列表
export async function gradeAndClass(params) {
  return request(`/joinus/ipay/students/grades/v1?${stringify(params)}`);
}


// 获取年级班级列表
export async function studentList(params) {
  return request(`/joinus/ipay/students/v1?${stringify(params)}`);
}

// 发起缴费项目
export async function item(params) {
  return request(`/joinus/ipay/items/v1`,  {
    method: 'POST',
    body: params,
  });
}