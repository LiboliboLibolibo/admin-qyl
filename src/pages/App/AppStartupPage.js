/*eslint-disable*/
import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import styles from './AppStartupPage.less';
import _ from 'lodash';
@connect(({ appStartupPage, loading }) => ({
  appStartupPage,
  loading: loading.models.appStartupPage,
}))
class AppStartupPage extends Component {


  render() {
    const { appStartupPage: {  } } = this.props;
    return (
      <Card>
        22222222
      </Card>
    );
  }
}

export default AppStartupPage;