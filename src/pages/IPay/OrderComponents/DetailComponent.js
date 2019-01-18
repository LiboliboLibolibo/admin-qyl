
/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { Card, Col, Button, Row, Icon } from 'antd';
@connect(({ iPayOrder, loading }) => ({
  iPayOrder,
  loading: loading.models.iPayOrder,
}))
export default class DetailComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iPayOrder: { detailRecord }, styles } = this.props;
    return (
      <Card>
        <div className={styles.back_btn}><Button onClick={this.props.changeDetailComponent} type='primary'><Icon type="rollback" />返回列表</Button></div>
        <div className={styles.deatil_sty}>
          <Row style={{fontSize: 20, color: '#333', fontWeight: 900}}>
            当前订单状态：{_.get(detailRecord, 'STATUS_CN') || ''}
          </Row>
          <Row style={{fontSize: 18, color: '#333', fontWeight: 900}}>
            订单号：{!_.isEmpty(detailRecord) && detailRecord.RECHARGE_ORDER_ID? detailRecord.RECHARGE_ORDER_ID : ''}
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>创建时间: <span>{_.get(detailRecord, 'CREATE_TIME') || ''}</span></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>写卡时间: <span>{_.get(detailRecord, 'RechargeThirdInterface.TRADE_TIME') || ''}</span></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>订单状态: <span>{_.get(detailRecord, 'STATUS_CN') || ''}</span></Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>交易金额（元）: <span>{_.get(detailRecord, 'AMOUNT')? detailRecord.AMOUNT/100 : ''}</span></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>支付方式: <span>{_.get(detailRecord, 'CHANNEL_ID') && _.get(detailRecord, 'CHANNEL_ID').indexOf('ALIPAY') != -1? '支付宝' : '微信'}</span></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>充值方式: <span>{_.get(detailRecord, 'rechargeMethod') || ''}</span></Col>
          </Row>
          <Row>
            交易对象：<span>{_.get(detailRecord, 'BODY') || ''}</span>
          </Row>
          <Row>
            交易卡号：<span>{_.get(detailRecord, 'STUDENT.CARDCODE') || ''}</span>
          </Row>
          <Row>
            学籍号：<span>{_.get(detailRecord, 'STUDENT.STUDENT_CODE') || ''}</span>
          </Row>
          <Row>
            充值手机：<span>{_.get(detailRecord, 'Parent.TEL_NUM') || ''}</span>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>平台订单号: <span>{_.get(detailRecord, 'RECHARGE_ORDER_ID') || ''}</span></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>微信订单号: <span>{_.get(detailRecord, 'CHANNEL_ORDER_NO') || ''}</span></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>三方流水号: <span>{_.get(detailRecord, 'RechargeThirdInterface.YKT_TRADE_NO') || ''}</span></Col>
          </Row>
          <Row style={{border: 0}}>
            备 注：<span>因为圈存机XXXXXXXXX</span>
          </Row>
        </div>
      </Card>
    );
  }
}
