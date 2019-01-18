import { itemNames, gradeAndClass, stuItemsDetail } from '@/services/paymentDetail';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  data: [], // 明细列表数据
  nameList: [], // 项目名称列表  
  gradeClassList: [], // 班级年级数据列表
  loading: false, 
  schoolId: 152,
  conditionParams: {},
  pagination: {
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    current: 1,
    total: null,
  },
};

export default {
  namespace: 'paymentDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/payment/payment-detail') {
          // 获取项目下拉列表
          dispatch({
            type: 'itemNames',
            payload: {
              schoolId: 152,
            },
          });
          // 查询人员缴费明细
          dispatch({
            type: 'stuItemsDetail',
            payload: {
              schoolId: 152,
              current: 1,
              size: 10,
            },
          });                                              
        }
      });
    },
  },

  effects: {

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

    // 年级班级列表
    *gradeAndClass({ payload = {} }, { call, put}) {
      const ret = yield call(gradeAndClass, parse(payload));
      if (ret) {
        yield put({
          type: 'updateState',
          payload: {
            gradeClassList: ret.data.grades,
          },
        });
      }
    },

    // 请求人员缴费明细
    *stuItemsDetail({ payload = {} }, { call, put}) {
      yield put({ type: 'updateState', payload: { loading: true } });
      const ret = yield call(stuItemsDetail, parse(payload));
      if (ret) {
        let page = {};
        page.current = Number(ret.current);
        page.pageSize = Number(ret.size);
        page.total = Number(ret.total);
        yield put({
          type: 'updateState',
          payload: {
            data: ret.rows,
            loading: false,
            pagination: {
              showTotal: total => `共 ${ret.total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              ...page,
            },
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