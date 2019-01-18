import { atomTrees, v1, updateActive } from '@/services/activityCreate';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
  isUpdate: false, // 是否是修改状态
  treeData:[], // 树形结构数据
  expandedKeys: [], // 展开的树节点
  checkedKeys: [], // 选中的树的复选框节点
  themeImgUrl: '', // 主题图片路径
  submitTreeData: [], // 需要提交的树形数据
  harfAndCheckedKeys: '', // 半选和全选的key
};

export default {
  namespace: 'activityCreate',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/activite/activity-create') {
          // 清除数据
          dispatch({
            type: 'refresh',
            payload: initState,
          });
          const { query } = location;
          // 修改活动给各参数赋值
          if(query && query.editParams && query.editParams.areaids) {
            let editparams = JSON.stringify(query.editParams);
            sessionStorage.setItem('editParams', editparams);
          }
          if (sessionStorage.getItem('editParams')) {
            let editAreaids = JSON.parse(sessionStorage.getItem('editParams')).areaids; 
            let multiplex = JSON.parse(sessionStorage.getItem('editParams')).multiplex; 
            let checkedList = [];
            if(!_.isEmpty(editAreaids) && multiplex == false) {
              checkedList = editAreaids.split(",");
            } else {
              checkedList = [];
            }
            // 回显树形结构勾线的节点
            dispatch({
              type: 'updateState',
              payload: {
                checkedKeys: checkedList,
              },
            });            
          }
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

    // 添加活动
    *v1({ payload = {}, callback }, { call, put}) {
      const ret = yield call(v1, parse(payload));
      if (callback && typeof callback === "function") {
        callback(ret && ret.code == 200 ? "success" : "error", ret);
      }
    },

    // 修改活动
    *updateActive({ payload = {}, callback }, { call, put}) {
      const ret = yield call(updateActive, parse(payload));
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