/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './IPaySchoolDetail.less';
import TypeCard from './SchoolDetailComponents/TypeCard';
import TypeChartCard from './SchoolDetailComponents/TypeChartCard';
import _ from 'lodash';
@connect(({ iPaySchoolDetail, loading }) => ({
  iPaySchoolDetail,
  loading: loading.models.iPaySchoolDetail,
}))
class IPaySchoolDetail extends Component {


  render() {
    const { iPaySchoolDetail: {  } } = this.props;
    return (

      <div style={{width: '100%'}}>
        <Card style={{marginBottom: 0, fontSize: 24, color: '#000', fontWeight: 900}}>
          太康一高一卡通数据
        </Card>
        <Row gutter={8}>
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <TypeCard styles={styles} type='t_count' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <TypeCard styles={styles} type='y_count' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <TypeCard styles={styles} type='t_money' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <TypeCard styles={styles} type='y_money' />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <TypeChartCard styles={styles} type='t_count' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <TypeChartCard styles={styles} type='t_money' />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <TypeChartCard styles={styles} type='proportion' />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <TypeChartCard styles={styles} type='new_add' />
          </Col>
        </Row>
      </div>
    );
  }
}

export default IPaySchoolDetail;