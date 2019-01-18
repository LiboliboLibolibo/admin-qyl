import {} from '@/services/leaveManagement';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
};

export default {
  namespace: 'leaveManagement',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/student-management/leave-management') {
          console.log('student-management/leave-management')
        }
      });
    },
  },

  effects: {

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