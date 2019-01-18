/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';
import moment from 'moment';
@connect(({ appDataStatistics, loading }) => ({
  appDataStatistics,
  loading: loading.models.appDataStatistics,
}))
export default class TypeCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { appDataStatistics: { data }, type, styles } = this.props;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let [
      allTotal, 
      parentTotal, 
      teacherTotal
    ] = [
      _.get(data, 'userTotal.userTotalCount') || '',
      _.get(data, 'userTotal.parantTotalCount') || '',
      _.get(data, 'userTotal.teacherTotalCount') || ''
    ];
    let title =
      type === 'a_total'
        ? '注册用户总数'
        : type === 't_total'
          ? '教师注册用户数'
          : type === 'p_total'
            ? '家长注册用户数'
            : '未注册用户数';
    let count =
      type === 'a_total'
      ? allTotal
      : type === 't_total'
        ? teacherTotal
        : type === 'p_total'
          ? parentTotal
          : '';
    return (
      <Card className={styles.type_card}>
        <Col className={styles.type_card_title}>
          <span>{title}</span>
        </Col>
        <Col style={{lineHeight: '50px'}}> 
            <span>更新与 {time}</span>
        </Col>
        <Col style={{lineHeight: '50px'}}>
          <div style={{display: 'flex'}}>
            <i style={{fontSize: 30, color: "red", fontWeight: 400, marginRight: 8}}>{count}</i> 人
          </div> 
        </Col>
      </Card>
    );
  }
}
