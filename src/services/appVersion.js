import { stringify } from 'qs';
import request from '@/utils/request';

// 请求版本列表
export async function qylAppVers(params) {
  return request(`/api/v1/qylAppVers?${stringify(params)}`);
}


// 新建版本
export async function create(params) {
  return request(`/api/v1/qylAppVers`,  {
    method: 'POST',
    body: params,
  });
}

export async function deleteVers(params) {
  return request(`/api/v1/qylAppVers/${params.id}`,  {
    method: 'DELETE',
    body: params,
  });
}