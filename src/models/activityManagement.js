import { v1, deleteActivite, getCity, getCountry, upperOrLower, addOrUpdateResults, joinStudent } from '@/services/activityManagement';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  showDetailModal: false, // 是否展示活动详情弹出框
  data: [], // 请求的table数据
  studentList: [], // 学生列表数据
  detailRecord: {}, // 被选中的详情行
  resultRecord: {}, // 成果展示被选中的行
  joinStudentRecord: {}, // 参加学生被选中的行
  loading: false, // 活动列表的数据
  cityLists: [], // 地市列表数据
  countryLists: [], // 县区列表数据
  showResultModal: false, // 是否展示活动成果弹出框
  showStudentModal: false, // 展示学生列表
  studentLoading: false, // 学生列表的loading
  conditionParams: {
    cityId: 0,
    countyId: 0,
    targets: 2,
    commitFlag: 2,
  }, // 翻页时需要带入的查询条件
  studentConditionParams: {}, // 学生列表翻页时需要带入的条件
  pagination: {},
  studentPagination: {},
};

export default {
  namespace: 'activityManagement',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/activite/activity-management') {
          // 获取用户登录信息
          dispatch({
            type: 'v1',
            payload: {
              cityId: 0,
              countyId: 0,
              targets: 2,
              commitFlag: 2,
            },
          });
          // 获取地市
          dispatch({
            type: 'getCity',
            payload: {
              regionId: '',
            },
          });
        }
      });
    },
  },

  effects: {

  // 请求活动列表数据
  *v1({ payload = {}, callback }, { call, put, select }) {
    yield put({ type: 'updateState', payload: { loading: true } });
    const ret = yield call(v1, parse(payload));
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
      callback(ret && ret.code == 200 ? 'success' : 'error', ret.message);
    }
  },

  // 删除活动
  *deleteActivite({ payload = {}, callback }, { call, put, select }) {
    const ret = yield call(deleteActivite, parse(payload));
    let res = JSON.parse(ret)
    if (callback && typeof callback === "function") {
      callback(res && res.code == 200 ? 'success' : 'error', res.msg);
    }
  },

  // 查询地市
  *getCity({ payload = {}, callback }, { call, put, select }) {
    const ret = yield call(getCity, parse(payload));
    if(ret && ret.rows) {
      yield put({
        type: 'updateState',
        payload: {
          cityLists: ret.rows,
        },
      });        
    }
    if (callback && typeof callback === "function") {
      callback(ret && ret.code == 200 ? 'success' : 'error', ret.msg);
    }
  },

  // 查询县区
  *getCountry({ payload = {}, callback }, { call, put, select }) {
    const ret = yield call(getCountry, parse(payload));
    if(ret && ret.rows) {
      yield put({
        type: 'updateState',
        payload: {
          countryLists: ret.rows,
        },
      });        
    }
    if (callback && typeof callback === "function") {
      callback(ret && ret.code == 200 ? 'success' : 'error', ret.msg);
    }
  },

  // 上架或者下架活动
  *upperOrLower({ payload = {}, callback }, { call, put, select }) {
    const ret = yield call(upperOrLower, parse(payload));
    if (callback && typeof callback === "function") {
      callback(ret && ret.code == 200 ? 'success' : 'error', ret.msg);
    }
  },

  // 新增修改活动结果
  *addOrUpdateResults({ payload = {}, callback }, { call, put, select }) {
    const ret = yield call(addOrUpdateResults, parse(payload));
    if (callback && typeof callback === "function") {
      callback(ret && ret.code == 200 ? 'success' : 'error', ret.msg);
    }
  },

  // 查询活动下的参赛学生
  *joinStudent({ payload = {}, callback }, { call, put, select }) {
    yield put({ type: 'updateState', payload: { studentLoading: true } });
    const ret = yield call(joinStudent, parse(payload));
    if(ret && ret.rows) {
      let page = {};
      page.current = Number(ret.current);
      page.pageSize = Number(ret.size);
      page.total = Number(ret.total);
      yield put({
        type: 'updateState',
        payload: {
          studentList: ret.rows,
          studentLoading: false,
          studentPagination: {
            showTotal: total => `共 ${ret.total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            ...page,
          },
        },
      });        
    }
    if (callback && typeof callback === "function") {
      callback(ret && ret.code == 200 ? 'success' : 'error', ret.msg);
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