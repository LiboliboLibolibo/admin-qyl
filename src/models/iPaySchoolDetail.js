import { schoolDetail, getRechargeAmountStatisticByDate, getRechargeCountStatisticByDate, growingRechargeUserStatisticByDate } from '@/services/iPaySchoolDetail';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  allData: {},
  totalCount: 0, // 充值总笔数
  totalAmount: 0, // 充值总金额
  filledCountList: [], // 充值笔数随日期变化数据列表
  filledAmountList: [], // 充值金额随日期变化数据列表
  userRatio: [], // 本校开通充值人数占比
  addUserList: [], // 新增用户日期变化数据列表
  totalUserCount: 0, // 本校总一卡通用户数
};

export default {
  namespace: 'iPaySchoolDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/i-pay/i-pay-school-detail') {
          // 清除数据
          dispatch({
            type: 'refresh',
            payload: initState,
          });
          const { query } = location;
          // 获取query里的参数
          if(query && query.schoolId) {
            let school_id = query.schoolId;
            sessionStorage.setItem('schoolId', school_id);
            let schoolId = sessionStorage.getItem('schoolId');
            // 获取单个学校一卡通数据详情
            dispatch({
              type: 'schoolDetail',
              payload: {
                schoolId: Number(schoolId),
              },
            });        
          }
        }
      });
    },
  },

  effects: {
    // 获取单个学校一卡通数据详情
    *schoolDetail({ payload = {}, callback }, { call, put}) {
      const ret = yield call(schoolDetail, parse(payload));
      console.log(ret)
      if(ret) {
        let [
          totalCount,
          totalAmount,
          totalUserCount,
          countList, 
          amountList,
          addUser,
          userRatio,
          filledCountList,
          filledAmountList,
          addUserList
        ] = 
        [
          _.get(ret, 'result.data.rechargeCountStatistic.queryDateTotalCount', 0),
          _.get(ret, 'result.data.rechargeAmountStatistic.queryDateTotalAmount', 0),
          _.get(ret, 'result.data.growingRechargeUserStatistic.totalGrowingRechargeUser', 0),
          _.get(ret, 'result.data.rechargeCountStatistic.statisticByDateArray', []),
          _.get(ret, 'result.data.rechargeAmountStatistic.statisticByDateArray', []),
          _.get(ret, 'result.data.growingRechargeUserStatistic.growingRechargeUserStatisticArray', []),
          _.get(ret, 'result.data.rechargeUserRatio.userRatio', []),
          [],
          [],
          []
        ];
        countList.map(c => {
          filledCountList.push({
            '日期': c.day,
            '当日充值笔数': c.count
          })
        })
        amountList.map(a => {
          filledAmountList.push({
            '日期': a.day,
            '当日充值金额': a.amount
          })
        })
        addUser.map(a => {
          addUserList.push({
            '日期': a.day,
            '当日新增用户数': a.growingUserCount
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            allData: _.get(ret,'result.data', {}),
            totalCount,
            totalAmount,
            totalUserCount,
            filledCountList,
            filledAmountList,
            addUserList,
            userRatio,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    
    // 按日期查询一卡通充值笔数变化趋势数据
    *getRechargeCountStatisticByDate({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getRechargeCountStatisticByDate, parse(payload));
      if(ret) {
        let [
          totalCount,
          countList, 
          filledCountList
        ] = 
        [
          _.get(ret, 'result.data.rechargeCountStatistic.queryDateTotalCount', 0),
          _.get(ret, 'result.data.rechargeCountStatistic.statisticByDateArray', []),
          []
        ];
        countList.map(c => {
          filledCountList.push({
            '日期': c.day,
            '当日充值笔数': c.count
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            totalCount,
            filledCountList
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    // 按日期查询一卡通充值金额变化趋势数据
    *getRechargeAmountStatisticByDate({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getRechargeAmountStatisticByDate, parse(payload));
      if(ret) {
        let [
          totalAmount,
          amountList,
          filledAmountList
        ] = 
        [
          _.get(ret, 'result.data.rechargeAmountStatistic.queryDateTotalAmount', 0),
          _.get(ret, 'result.data.rechargeAmountStatistic.statisticByDateArray', []),
          []
        ];
        amountList.map(a => {
          filledAmountList.push({
            '日期': a.day,
            '当日充值金额': a.amount
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            totalAmount,
            filledAmountList,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    
    // 按日期查询每日增长一卡通用户数
    *growingRechargeUserStatisticByDate({ payload = {}, callback }, { call, put}) {
      const ret = yield call(growingRechargeUserStatisticByDate, parse(payload));
      console.log(ret)
      if(ret) {
        let [
          totalUserCount,
          addUser,
          addUserList
        ] = 
        [
          _.get(ret, 'result.data.growingRechargeUserStatistic.totalGrowingRechargeUser', 0),
          _.get(ret, 'result.data.growingRechargeUserStatistic.growingRechargeUserStatisticArray', []),
          []
        ];
        addUser.map(a => {
          addUserList.push({
            '日期': a.day,
            '当日新增用户数': a.growingUserCount
          })
        })
        yield put({
          type: 'updateState',
          payload: {
            totalUserCount,
            addUserList,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },
  },

  reducers: {
    refresh(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};