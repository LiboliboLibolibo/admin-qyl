import { getOrderList, getOpenSchoolList, getGradeAndClass } from '@/services/iPayOrder';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  data: [], // 订单列表
  conditionParams: [], // 分页时需要传入的参数
  loading: false, // 列表数据的loading
  pagination: {}, // 翻页
  detailRecord: {}, // 当前所选中的数据的详情
  schoolList: [], // 开通一卡通的学校列表
  gradeClassList: [], // 年级数据列表
  classList: [], // 班级数据列表
};

export default {
  namespace: 'iPayOrder',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/i-pay/i-pay-order') {
          // 获取order列表数据
          dispatch({
            type: 'getOrderList',
            payload: {
              page: 1,
              perPage: 10,
            },
          }); 
          
          // 获取所有开通一卡通的学校
          dispatch({
            type: 'getOpenSchoolList',
            payload: {
            },
          }); 
        }
      });
    },
  },

  effects: {

    // 获取order列表数据
    *getOrderList({ payload = {}, callback }, { call, put}) {
      yield put({ type: 'updateState', payload: { loading: true } });
      const ret = yield call(getOrderList, parse(payload));
      if(ret) {
        let page = {};
        page.current = Number(ret.result.pagination.page);
        page.pageSize = Number(ret.result.pagination.perPage);
        page.total = Number(ret.result.pagination.totalCount);
        yield put({
          type: 'updateState',
          payload: {
            data: ret.result.data,
            pagination: {
              showTotal: total => `共 ${ret.result.pagination.totalCount} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              ...page,
            },
            loading: false,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    // 获取所有开通一卡通的学校
    *getOpenSchoolList({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getOpenSchoolList, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            schoolList: ret.result.data,
          },
        });        
      }
    },

    
    // 根据学校获取年级班级列表
    *getGradeAndClass({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getGradeAndClass, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            gradeClassList: ret.result.data.grades,
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