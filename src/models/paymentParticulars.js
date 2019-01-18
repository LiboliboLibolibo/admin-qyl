import { statisticsByClassId, gradeAndClass, stuItems, notice } from '@/services/paymentParticulars';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  schoolId: 152,
  gradeClassList: [], // 班级年级数据列表
  data: [], // 班级年级列表详细数据
  stuList: [], // 学生分类数据列表
  loading: false, 
  showStuListModal: false, // 学生分类数据列表modal
  conditionParams: {}, // 翻页时带入的查询条件
  pagination: {
  },
};

export default {
  namespace: 'paymentParticulars',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/payment/payment-particulars') {
          const { query } = location;
          // 缴费详情参数
          if(query && query.detailParams && query.detailParams.itemId) {
            let detailparams = JSON.stringify(query.detailParams);
            sessionStorage.setItem('detailParams', detailparams);
          }
          if (sessionStorage.getItem('detailParams')) {
            let itemId = JSON.parse(sessionStorage.getItem('detailParams')).itemId; 
            // 查询缴费数据
            dispatch({
              type: 'statisticsByClassId',
              payload: {
                schoolId: 152,
                itemId: itemId,
                current: 1,
                size: 10,
              },
            });
            // 查询年级列表数据
            dispatch({
              type: 'gradeAndClass',
              payload: {
                schoolId: 152,
                itemId: itemId,
              },
            });                        
          }
        }
      });
    },
  },

  effects: {
    
    // 查询缴费列表
    *statisticsByClassId({ payload = {}, callback }, { call, put}) {
      yield put({ type: 'updateState', payload: { loading: true } });
      const ret = yield call(statisticsByClassId, parse(payload));
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
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: total => `共 ${ret.total} 条`,
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

    
    // 年级班级列表
    *gradeAndClass({ payload = {} }, { call, put}) {
      const ret = yield call(gradeAndClass, parse(payload));
      if (ret && ret.data && ret.data.grades) {
        yield put({
          type: 'updateState',
          payload: {
            gradeClassList: ret.data.grades,
          },
        });
      }
    },

    
    // 分类查询学生缴费列表
    *stuItems({ payload = {} }, { call, put}) {
      const ret = yield call(stuItems, parse(payload));
      if (ret) {
        yield put({
          type: 'updateState',
          payload: {
            stuList: ret.rows,
          },
        });
      }
    },

    // 一键催缴当前缴费活动
    *notice({ payload = {}, callback }, { call, put}) {
      const ret = yield call(notice, parse(payload));
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