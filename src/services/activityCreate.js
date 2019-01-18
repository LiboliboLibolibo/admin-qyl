import { stringify } from 'qs';
import request from '@/utils/request';

// 请求异步树
export async function atomTrees(params) {
  return request(`/activities/atomTrees/v1?${stringify(params)}`);
}

// 请求添加活动
export async function v1(params) {
  return request('/activities/v1',  {
    method: 'POST',
    body: params,
  });
}

// 修改活动
export async function updateActive(params) {
  return request('/activities/v1',  {
    method: 'PUT',
    body: params,
  });
}