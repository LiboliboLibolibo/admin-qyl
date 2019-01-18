/*eslint-disable*/
import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import styles from './PaymentDetail.less';
import SearchForm from './DetailComponent/SearchForm';
import TableComponents from './DetailComponent/TableComponents';
import _ from 'lodash';
@connect(({ paymentDetail, loading }) => ({
  paymentDetail,
  loading: loading.models.paymentDetail,
}))
class PaymentDetail extends Component {


  render() {
    const { paymentDetail: {  } } = this.props;
    return (
      <Card>
        <SearchForm styles={styles} />
        <TableComponents styles={styles} />        
      </Card>
    );
  }
}

export default PaymentDetail;