/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './IPayStatistics.less';
import RealTimeDataCard from './StatisticsComponents/RealTimeDataCard';
import TotalCountCard from './StatisticsComponents/TotalCountCard';
import TotalUserCard from './StatisticsComponents/TotalUserCard';
import RechargeRankCard from './StatisticsComponents/RechargeRankCard';
import TotalMoneyCard from './StatisticsComponents/TotalMoneyCard';
import _ from 'lodash';
@connect(({ iPayStatistics, loading }) => ({
  iPayStatistics,
  loading: loading.models.iPayStatistics,
}))
class IPayStatistics extends Component {


  render() {
    const { iPayStatistics: { allData } } = this.props;
    return (
      <div className={styles.content_style}>
        <Row gutter={8} style={{ width: '100%', margin: '8px 0' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={7}>
            <div className={styles.card_wrap}>
              <RealTimeDataCard styles={styles} />
              <TotalCountCard styles={styles} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={10}>
            <TotalMoneyCard styles={styles} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={7}>
            <div className={styles.card_wrap}>
              <TotalUserCard styles={styles} />
              <RechargeRankCard styles={styles} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default IPayStatistics;