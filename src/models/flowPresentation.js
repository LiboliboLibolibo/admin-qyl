import { atomTrees, getDataList, getSchoolName, giveFlow } from '@/services/flowPresentation';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  treeData:[], // 树形结构数据
  data: [], // table数据列表
  expandedKeys: [], // 展开的树节点
  loading: false, // table loading
  schoolList: [], // 学校名称列表
  selectedRowKeys: [], // 选中的行
  showConfirmModal: false, // 展示赠送确认框
  cityLists: [],
  countryLists: [],
  conditionParams: {
    regionId: '001',
    type: 1,
    giveFlag: 0,
    roleType: 0,
    reward: 0,
  }, // 翻页时传入的条件
  pagination: {
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    current: 1,
    total: null,
  },
};

export default {
  namespace: 'flowPresentation',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/activite/flow-presentation') {
          // 查询年级列表数据
          dispatch({
            type: 'getDataList',
            payload: {
              regionId: '001',
              type: 1,
              giveFlag: 0,
              roleType: 0,
              reward: 0,
              current: 1,
              size: 10,
            },
          });           
        }
      });
    },
  },

  effects: {
    // 请求异步树
    *atomTrees({ payload = {}, callback }, { call, put}) {
    const ret = yield call(atomTrees, parse(payload));
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
      }
    },

    // 查询学校名称列表
    *getSchoolName({ payload = {}}, { call, put}) {
      const ret = yield call(getSchoolName, parse(payload));
      if (ret) {
        yield put({
          type: 'updateState',
          payload: {
            schoolList: ret.rows,
          },
        });
      }
    },

    // 获取需赠送流量的人员列表
    *getDataList({ payload = {}, callback }, { call, put}) {
      yield put({ type: 'updateState', payload: { loading: true } });
      const ret = yield call(getDataList, parse(payload));
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
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
      }
    },

    
    // 赠送流量
    *giveFlow({ payload = {}, callback }, { call, put}) {
      const ret = yield call(giveFlow, parse(payload));
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