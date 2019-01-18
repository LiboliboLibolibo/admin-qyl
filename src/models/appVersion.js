import { qylAppVers, create, deleteVers } from '@/services/appVersion';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  loading: false,
  data: [], // 版本数据列表
  pagination: {
  },
};

export default {
  namespace: 'appVersion',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/app/app-version') {
          // 获取版本列表
          dispatch({
            type: 'qylAppVers',
            payload: {
              page: 1,
              perPage: 10,
            },
          });                   
        }
      });
    },
  },

  effects: {

    // 获取版本列表
    *qylAppVers({ payload = {} }, { call, put}) {
      yield put({ type: 'updateState', payload: { loading: true } });
      const ret = yield call(qylAppVers, parse(payload));
      if (ret) {
        let page = {};
        page.current = Number(ret.result.pagination.page);
        page.pageSize = Number(ret.result.pagination.perPage);
        page.total = Number(ret.result.pagination.totalCount);
        yield put({
          type: 'updateState',
          payload: {
            data: ret.result.data,
            loading: false,
            pagination: {
              showTotal: total => `共 ${ret.result.pagination.totalCount} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              ...page,
            },
          },
        });
      }
    },

    // 新建版本
    *create({ payload = {}, callback }, { call, put}) {
      const ret = yield call(create, parse(payload));
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    // 删除版本
    *deleteVers({ payload = {}, callback }, { call, put}) {
      const ret = yield call(deleteVers, parse(payload));
      if (callback && typeof callback === "function") {
        if(ret && typeof(ret) == 'string'){
          let res = JSON.parse(ret);
          callback(res && res.code == 0 ? "success" : "error", res);
        }
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