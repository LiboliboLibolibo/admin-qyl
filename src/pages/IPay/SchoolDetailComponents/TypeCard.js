/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Icon, Tooltip } from 'antd';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import _ from 'lodash';
import moment from 'moment';
@connect(({ iPaySchoolDetail, loading }) => ({
  iPaySchoolDetail,
  loading: loading.models.iPaySchoolDetail,
}))
export default class TypeCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iPaySchoolDetail: { allData }, type, styles } = this.props;
    let title =
      type === 't_count'
        ? '今日充值笔数'
        : type === 'y_count'
          ? '昨日充值笔数'
          : type === 't_money'
            ? '今日充值金额'
            : '昨日充值金额';
    let isCurrent = (type === 't_count' || type === 't_money')? true : false;
    return (
      <Card className={styles.type_card}>
        <Col className={styles.type_card_title}>
          <span>{title}</span>
        </Col>
        <Col style={{lineHeight: '50px'}}>
          {isCurrent === true? 
            <span>更新与{moment().format('YYYY-MM-DD HH:mm:ss')}</span> :
            <span>{moment().subtract(1, 'days').format('YYYY-MM-DD')}-{moment().subtract(1, 'days').format('YYYY-MM-DD')}</span>  
          }
        </Col>
        <Col style={{lineHeight: '50px'}}>
          {isCurrent === true? 
            <div style={{display: 'flex'}}>
            {type === 't_count'? 
            <span style={{fontSize: 30, color: "red", fontWeight: 400, marginRight: 4}}>
              {_.get(allData, 'rechargeStatisticRecentTwoDays.TODAY_COUNT') || 0}
            </span> : 
            <span style={{fontSize: 30, color: "red", fontWeight: 400, marginRight: 4}}>
              {_.get(allData, 'rechargeStatisticRecentTwoDays.TODAY_AMOUNT') || 0}
            </span>} {type === 't_count'? ' 笔' : ' 元'}
            </div> 
            :
            <div style={{display: 'flex'}}>
            {type === 'y_count'? 
              <span style={{fontSize: 30, color: "red", fontWeight: 400, marginRight: 4}}>
                {_.get(allData, 'rechargeStatisticRecentTwoDays.YESTERDAY_COUNT') || 0}
              </span> : 
              <span style={{fontSize: 30, color: "red", fontWeight: 400, marginRight: 4}}>
                {_.get(allData, 'rechargeStatisticRecentTwoDays.YESTERDAY_COUNT') || 0}
              </span>} {type === 'y_count'? ' 笔' : ' 元'}
              <NumberInfo
                // subTitle={<span>Visits this week</span>}
                total={`同比：`}
                status="up"
                subTotal={type === 'y_count'? (Number(_.get(allData, 'rechargeStatisticRecentTwoDays.COUNT_RATE')) || 0) : (Number(_.get(allData, 'rechargeStatisticRecentTwoDays.AMOUNT_RATE')) || 0)}
                theme={'light'}
              />
            </div>
          }
        </Col>
      </Card>
    );
  }
}
