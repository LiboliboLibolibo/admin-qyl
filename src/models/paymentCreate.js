import { gradeAndClass, studentList, item } from '@/services/paymentCreate';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  schoolId: 152,
  treeData: [],
};

export default {
  namespace: 'paymentCreate',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/payment/payment-create') {
          // 查询年级列表数据
          dispatch({
            type: 'gradeAndClass',
            payload: {
              schoolId: 152,
            },
          });            
        }
      });
    },
  },

  effects: {
    // 年级班级列表
    *gradeAndClass({ payload = {} }, { call, put}) {
      const ret = yield call(gradeAndClass, parse(payload));
      if (ret.data) {
        let allList = [ret.data]
        allList.forEach(function (rt) {
          rt['title'] = '全校'
          rt['children'] = rt.grades
          rt['key'] = `a-${rt.schoolId}`
          rt['value'] = `a-${rt.schoolId}-${rt.stuCount}`
          if(allList[0].grades) {
            allList[0].grades.forEach(function (item) {
              item['title'] = item.gradeName
              item['children'] = item.classes
              item['key'] = `g-${item.gradeId}`
              item['value'] = `g-${item.gradeId}-${item.stuCount}`
              if(item.classes) {
                item.classes.forEach(function (ch) {
                  ch['title'] = ch.className
                  ch['key'] = `c-${ch.classId}`
                  ch['value'] = `c-${ch.classId}-${ch.stuCount}`
                })
              }
            })
          }
        })
      }
      if (ret) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: [ret.data],
          },
        });
      }
    },
 
    // 学生列表
    *studentList({ payload = {}, callback }, { call, put}) {
      const ret = yield call(studentList, parse(payload));
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
      }
    },

    // 发起缴费项目
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