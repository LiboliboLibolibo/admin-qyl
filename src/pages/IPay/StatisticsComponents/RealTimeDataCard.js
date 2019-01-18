/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Icon, Tooltip } from 'antd';
import _ from 'lodash';
import { WaterWave } from '@/components/Ellipsis';
@connect(({ iPayStatistics, loading }) => ({
  iPayStatistics,
  loading: loading.models.iPayStatistics,
}))
export default class RealTimeDataCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iPayStatistics: { recentData }, styles } = this.props;
    return (
      <Card className={styles.type_card}>
        <div className={styles.type_card_title}>
          实时交易统计：
        </div>
        <div className={styles.marquee_box}>
          {!_.isEmpty(recentData) &&
            recentData.map(r => {
              return(<Tooltip style={{width: '400px'}} title={(_.get(r, 'SCHOOL_NAME') || '暂无学校名称')+ (_.get(r, 'TEL_NUM') || '暂无手机号') + ', 充值' + (_.get(r, 'AMOUNT') || '0') + '元,' +(_.get(r, 'PAYSUCC_TIME') || '')}>
                <li>
                  {_.get(r, 'SCHOOL_NAME') || '暂无学校名称'} {_.get(r, 'TEL_NUM') || '暂无手机号'}, 充值{_.get(r, 'AMOUNT') || '0'}元, {_.get(r, 'PAYSUCC_TIME') || ''}
                </li>
              </Tooltip>
              )
            })
          } 
          {_.isEmpty(recentData) &&
            <div style={{textAlign: 'center', lineHeight: '280px', fontSize: '26px'}}>
              暂无数据
            </div>
          }  
        </div>
      </Card>
    );
  }
}
