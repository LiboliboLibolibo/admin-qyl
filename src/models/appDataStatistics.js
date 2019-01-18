import { getCityList, getCountyListForCity, getSchoolListForCounty, getStatisticData, userCountStatistics, userGrowing } from '@/services/appDataStatistics';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  regionData: [], // 区域数据列表
  countyListData: [], // 县区数据列表
  schoolListData: [], // 学校列表数据
  data: [], // app相关统计数据
  userDataList: [], // 用户列表数据
  growingData: [], // 用户增长的数据
  condition: {
    cityId: '',
    countyId: '',
    schoolId: '',
  }, // 出入的地市县区学校条件
};

export default {
  namespace: 'appDataStatistics',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/app/app-data-statistics') {
          // 获取地市列表
          dispatch({
            type: 'getCityList',
            payload: {},
          }); 
          // 获取app数据统计
          dispatch({
            type: 'getStatisticData',
            payload: {},
          });
          // 获取app用户增长数据
          dispatch({
            type: 'userGrowing',
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
    
    // 获取用户数据统计的总数据
    *getStatisticData({ payload = {}, callback }, { call, put}) {
      const ret = yield call(getStatisticData, parse(payload));
      let chartData = _.get(ret, 'result.data.userCountStatistics') || {};
      let chartDataList = [];
      if(!_.isEmpty(chartData)) {
        for(var key in chartData){  
          chartDataList.push({
            '日期': key,
            '注册用户总数': chartData[key],
          })     
        }  
      }
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            data: ret.result.data,
            userDataList: chartDataList,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    // 获取注册用户总数折线图数据
    *userCountStatistics({ payload = {}, callback }, { call, put}) {
      const ret = yield call(userCountStatistics, parse(payload));
      let chartData = _.get(ret, 'result.data.userCountStatistics') || {};
      let chartDataList = [];
      if(!_.isEmpty(chartData)) {
        for(var key in chartData){  
          chartDataList.push({
            '日期': key,
            '注册用户总数': chartData[key],
          })     
        }  
      }
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            userDataList: chartDataList,
          },
        });        
      }
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 0 ? "success" : "error", ret);
      }
    },

    
    // 获取用户增长折线图数据
    *userGrowing({ payload = {}, callback }, { call, put}) {
      const ret = yield call(userGrowing, parse(payload));
      if(ret) {
        yield put({
          type: 'updateState',
          payload: {
            growingData: _.get(ret, 'result.data.userGrowingCountStatistics') || {},
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