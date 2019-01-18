/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './AppDataStatistics.less';
import _ from 'lodash';
import SearchForm from './DataStatisticComponents/SearchForm';
import TypeCard from './DataStatisticComponents/TypeCard';
import TotalUserChart from './DataStatisticComponents/TotalUserChart';
import GrowingChart from './DataStatisticComponents/GrowingChart';
@connect(({ appDataStatistics, loading }) => ({
  appDataStatistics,
  loading: loading.models.appDataStatistics,
}))
class AppDataStatistics extends Component {


  render() {
    const { appDataStatistics: {  } } = this.props;
    return (
      <Card>
        <SearchForm styles={styles}/>
        <Row gutter={8}>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <TypeCard styles={styles} type='a_total' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <TypeCard styles={styles} type='t_total' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <TypeCard styles={styles} type='p_total' />
          </Col>
        </Row>
        <TotalUserChart styles={styles}/>
        <GrowingChart styles={styles}/>
      </Card>
    );
  }
}

export default AppDataStatistics;