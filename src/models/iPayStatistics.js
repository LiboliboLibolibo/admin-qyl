import { getData, recentOrders } from '@/services/iPayStatistics';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  allData: {}, // 返回的数据
  recentData: {}, // 返回的实时列表数据
};

export default {
  namespace: 'iPayStatistics',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/i-pay/i-pay-statistics') {
          // 请求首页数据
          dispatch({
            type: 'getData',
            payload: {
            },
          });
          // 获取实时交易数据
          dispatch({
            type: 'recentOrders',
            payload: {
            },
          });                        
        }
      });
    },
  },

  effects: {
    // 获取数据
    *getData({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getData, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            allData: ret.result,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
      }
    },

    // 获取最新的10个订单
    *recentOrders({ payload = {} }, { call, put}) {
      const ret = yield call(recentOrders, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            recentData: ret.result.data,
          },
        });        
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