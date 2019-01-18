/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Col } from 'antd';
import { connect } from 'dva';
import styles from './LeaveManagement.less';
import _ from 'lodash';
@connect(({ leaveManagement, loading }) => ({
  leaveManagement,
  loading: loading.models.leaveManagement,
}))
class LeaveManagement extends Component {


  render() {
    const { leaveManagement: {  } } = this.props;
    return (
      <Card>
        <div className={styles.marquee_box}>
          <li>太康一高高级中学 1325****112, 充值100元 2018-10-10 18:00:23</li>
          <li>太康一高高级中学 1325****112, 充值100元 2018-10-10 18:00:23</li>
          <li>太康一高高级中学 1325****112, 充值100元 2018-10-10 18:00:23</li>
          <li>太康一高高级中学 1325****112, 充值100元 2018-10-10 18:00:23</li>
          <li>太康一高高级中学 1325****112, 充值100元 2018-10-10 18:00:23</li>
          <li>太康一高高级中学 1325****112, 充值100元 2018-10-10 18:00:23</li>     
        </div>
      </Card>
    );
  }
}

export default LeaveManagement;