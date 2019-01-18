/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Col, Button, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux, Route, Switch } from 'dva/router';
import styles from './PaymentParticulars.less';
import _ from 'lodash';
import HolisticTableComponent from './ParticularsComments/HolisticTableComponent';
import DetailTableComponent from './ParticularsComments/DetailTableComponent';
import SearchForm from './ParticularsComments/SearchForm';
@connect(({ paymentParticulars, loading }) => ({
  paymentParticulars,
  loading: loading.models.paymentParticulars,
}))
class PaymentParticulars extends Component {

  handleBack = () => {
    this.props.dispatch(
      routerRedux.push({
        pathname: '../payment/payment-home',
      })
    );
  }

  render() {
    const { paymentParticulars: {  } } = this.props;
    return (
      <Card>
        <Col><span className={styles.backBtn}><Button onClick={this.handleBack} type='primary'><Icon type="arrow-left" /> 返回上级 </Button></span></Col>
        <HolisticTableComponent styles={styles}/>
        <SearchForm styles={styles} />
        <DetailTableComponent styles={styles}/>
      </Card>
    );
  }
}

export default PaymentParticulars;