import { getCityList, getCountyListForCity, getSchoolListForCounty, totalCountGroupBySchool, countAndAmount } from '@/services/iPayData';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  regionData: [], // 区域数据列表
  countyListData: [], // 县区数据列表
  schoolListData: [], // 学校列表数据
  dataList: [], // 学校一卡通数据统计列表
  chartDataList: [], // 图表数据列表
  pagination: {
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    current: 1,
    total: null,
  }, // 翻页
};

export default {
  namespace: 'iPayData',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/i-pay/i-pay-data') {
          // 获取地市列表
          dispatch({
            type: 'getCityList',
            payload: {},
          }); 
          // 获取所有开通一卡通的学校数据统计列表
          dispatch({
            type: 'totalCountGroupBySchool',
            payload: {},
          });
          // 获取每日充值金额数据列表
          dispatch({
            type: 'countAndAmount',
            payload: {},
          });
        }
      });
    },
  },

  effects: {

    // 获取地市列表
    *getCityList({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getCityList, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            regionData: ret.result.data,
          },
        });        
      }
    },

    // 获取县区列表
    *getCountyListForCity({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getCountyListForCity, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            countyListData: ret.result.data,
          },
        });        
      }
    },

    // 获取县区下的学校列表
    *getSchoolListForCounty({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getSchoolListForCounty, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            schoolListData: ret.result.data,
          },
        });        
      }
    },

    // 各个学校一卡通数据统计
    *totalCountGroupBySchool({ payload = {}, callback }, { call, put}) {
      const ret = yield call(totalCountGroupBySchool, parse(payload));
      if(ret) {
        let page = {};
        page.current = Number(ret.result.pagination.page);
        page.pageSize = Number(ret.result.pagination.perPage);
        page.total = Number(ret.result.pagination.totalCount);
        yield put({
          type: 'updateState',
          payload: {
            dataList: ret.result.data,
            pagination: {
              showTotal: total => `共 ${ret.result.pagination.totalCount} 条`,
              showQuickJumper: true,
              ...page,
            },
          },
        });
      }        
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    
    // 获取每日充值金额数据列表
    *countAndAmount({ payload = {}, callback }, { call, put}) {
      const ret = yield call(countAndAmount, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            chartDataList: _.get(ret, 'result.data.countAndAmount.nearDays.data') || [],
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