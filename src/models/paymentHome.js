import { items, itemNames, item } from '@/services/paymentHome';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  data: [], // 缴费列表的数据
  loading: false, // 缴费列表loading
  conditionParams: {
    current: 1,
    size: 10,
  }, // 翻页时需要传入的查询条件
  nameList: [], // 项目名称列表
  schoolId: 152,
  showDelayModal: false, // 展示延时弹出框
  showRevokeModal: false, // 展示撤销弹出框
  revokeRecord: {}, // 撤销数据
  delayRecord: {}, // 延期的数据
  pagination: {
  },
};

export default {
  namespace: 'paymentHome',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/payment/payment-home') {
          // 获取用户登录信息
          dispatch({
            type: 'items',
            payload: {
              schoolId: 152,
              current: 1,
              size: 10,
            },
          });
          // 获取项目下拉列表
          dispatch({
            type: 'itemNames',
            payload: {
              schoolId: 152,
            },
          });
        }
      });
    },
  },

  effects: {

    // 查询缴费列表
    *items({ payload = {}, callback }, { call, put}) {
      yield put({ type: 'updateState', payload: { loading: true } });
      const ret = yield call(items, parse(payload));
      if (ret) {
        let page = {};
        page.current = Number(ret.current);
        page.pageSize = Number(ret.size);
        page.total = Number(ret.total);
        yield put({
          type: 'updateState',
          payload: {
            data: ret.rows,
            pagination: {
              showTotal: total => `共 ${ret.total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              ...page,
            },
            loading: false,
          },
        });
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
      }
    },

    // 查询缴费名称列表
    *itemNames({ payload = {} }, { call, put}) {
      const ret = yield call(itemNames, parse(payload));
      if (ret) {
        yield put({
          type: 'updateState',
          payload: {
            nameList: ret.rows,
          },
        });
      }
    },

    // 撤销或者延期缴费项目
    *item({ payload = {}, callback }, { call, put}) {
      const ret = yield call(item, parse(payload));
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
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