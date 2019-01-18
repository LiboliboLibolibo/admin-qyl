import { stringify } from 'qs';
import request from '@/utils/request';

// 获取单个学校的一卡通数据详情
export async function schoolDetail(params) {
  return request(`/api/v1/rechargeOrders/schoolDetail?${stringify(params)}`);
}

// 按日期查询一卡通充值笔数变化趋势数据
export async function getRechargeCountStatisticByDate(params) {
  return request(`/api/v1/rechargeOrders/getRechargeCountStatisticByDate?${stringify(params)}`);
}

// 按日期查询一卡通充值金额变化趋势数据
export async function getRechargeAmountStatisticByDate(params) {
  return request(`/api/v1/rechargeOrders/getRechargeAmountStatisticByDate?${stringify(params)}`);
}


// 按日期查询开通一卡通人数变化趋势数据
export async function growingRechargeUserStatisticByDate(params) {
  return request(`/api/v1/rechargeOrders/growingRechargeUserStatisticByDate?${stringify(params)}`);
}

