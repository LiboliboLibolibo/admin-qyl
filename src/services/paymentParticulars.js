import { stringify } from 'qs';
import request from '@/utils/request';


// 请求缴费列表
export async function statisticsByClassId(params) {
  return request(`/joinus/ipay/items/statisticsByClassId/v1?${stringify(params)}`);
}

// 获取年级班级列表
export async function gradeAndClass(params) {
  return request(`/joinus/ipay/students/grades/v1?${stringify(params)}`);
}


// 查看班级各缴费状态名单
export async function stuItems(params) {
  return request(`/joinus/ipay/items/stuItems/v1?${stringify(params)}`);
}

// 一键催缴当前缴费项目
export async function notice(params) {
  return request(` /joinus/ipay/items/callItem/${params.itemId}/v1`);
}