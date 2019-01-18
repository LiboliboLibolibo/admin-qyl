/*eslint-disable*/
import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import styles from './PaymentHome.less';
import SearchForm from './HomeComponents/SearchForm';
import TableComponents from './HomeComponents/TableComponents';
import _ from 'lodash';
@connect(({ paymentHome, loading }) => ({
  paymentHome,
  loading: loading.models.paymentHome,
}))
class PaymentHome extends Component {


  render() {
    const { paymentHome: {  } } = this.props;
    return (
      <Card>
        <SearchForm styles={styles} />
        <TableComponents styles={styles} />
      </Card>
    );
  }
}

export default PaymentHome;