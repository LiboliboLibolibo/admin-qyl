import { stringify } from 'qs';
import request from '@/utils/request';
// 请求异步树
export async function atomTrees(params) {
  return request(`/activities/atomTrees/v1?${stringify(params)}`);
}

// 查询table数据列表
export async function getDataList(params) {
  return request(`/compositions/flows/v1?${stringify(params)}`);
}

// 查询学校名称列表
export async function getSchoolName(params) {
  return request(`/compositions/schools/v1?${stringify(params)}`);
}


// 查询学校名称列表
export async function giveFlow(params) {
  return request(`/compositions/flows/v1`, {
    method: 'PUT',
    body: params,
  });
}
