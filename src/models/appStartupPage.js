import { } from '@/services/appStartupPage';
import { parse } from 'qs';
import _ from 'lodash';
const initState = {
};

export default {
  namespace: 'appStartupPage',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/app/app-startup-page') {
          console.log('/app/app-startup-page')
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