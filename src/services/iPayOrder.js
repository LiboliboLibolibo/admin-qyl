import { stringify } from 'qs';
import request from '@/utils/request';

// 获取订单列表数据
export async function getOrderList(params) {
  return request(`/api/v1/rechargeOrders?${stringify(params)}`);
}

// 获取所有开通一卡通的学校
export async function getOpenSchoolList(params) {
  return request(`/api/v1/schools/oneCard?${stringify(params)}`);
}

// 根据学校获取年级班级列表
export async function getGradeAndClass(params) {
  return request(`/api/v1/schools/${params.id}`);
}
