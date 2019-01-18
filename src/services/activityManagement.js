import request from '@/utils/request';
import { stringify } from 'qs';
// 请求活动列表
export async function v1(params) {
  return request(`/activities/v1?${stringify(params)}`);
}

// 请求活动列表
export async function deleteActivite(params) {
  return request(`/activities/v1/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 查询地市列表
export async function getCity(params) {
  return request(`/activities/links/v1/1/?regionId=${params.regionId}`);
}

// 查询地市下某个县区的列表
export async function getCountry(params) {
  return request(`/activities/links/v1/2/?regionId=${params.regionId}`);
}

// 请求活动列表
export async function upperOrLower(params) {
  return request(`/activities/showcase/v1`, {
    method: 'PUT',
    body: params,
  });
}

// 添加或更改活动结果
export async function addOrUpdateResults(params) {
  return request(`/activities/results/v1`, {
    method: 'PUT',
    body: params,
  });
}

// 查询活动下的学生
export async function joinStudent(params) {
  return request(`/activities/joins/v1?${stringify(params)}`);
}