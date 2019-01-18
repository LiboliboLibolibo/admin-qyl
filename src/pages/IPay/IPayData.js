/*eslint-disable*/
import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import styles from './IPayData.less';
import _ from 'lodash';
import moment from 'moment';
import BrokenLineComponent from './PayDataComponents/BrokenLineComponent';
import SchoolListComponent from './PayDataComponents/SchoolListComponent';
import ChartForm from './PayDataComponents/ChartForm';
import SearchForm from './PayDataComponents/SearchForm';
@connect(({ iPayData, loading }) => ({
  iPayData,
  loading: loading.models.iPayData,
}))
class IPayData extends Component {
    state = {
    };
  render() {
    const { iPayData: { } } = this.props;
    return (
      <div style={{width: '100%'}}>
        <Card style={{marginBottom: 20}}>
          <div className={styles.pay_title}>每日充值金额变化趋势</div>
          <ChartForm styles={styles}/>
          <BrokenLineComponent styles={styles}/>
        </Card>
        <Card>
          <div className={styles.pay_title}>学校一卡通数据<span>按总充值金额高低排序</span></div>
          <SearchForm styles={styles}/>
          <SchoolListComponent styles={styles}/>        
        </Card>
      </div>
    );
  }
}

export default IPayData;