/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col } from 'antd';
import _ from 'lodash';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
@connect(({ iPayStatistics, loading }) => ({
  iPayStatistics,
  loading: loading.models.iPayStatistics,
}))
export default class RechargeRankCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { iPayStatistics: { allData }, styles } = this.props;
    const dv = allData && allData.data && allData.data.amountRating.reverse() || [];

    return (
      <Card className={styles.type_card}>
        <div className={styles.type_card_title}>
          学校充值总额排名（前5）
        </div>
        <div className={styles.marquee_box}>
          {!_.isEmpty(dv) &&
            <Chart height={380} data={dv} forceFit>
              <Coord transpose />
              <Axis
                name="SCHOOL_NAME"
                label={{
                  offset: 12,
                }}
              />
              <Axis />
              <Tooltip name="人数（人）:" />
              <Geom type="interval" position="SCHOOL_NAME*amount" />
            </Chart>
          }
          {_.isEmpty(dv) &&
            <div style={{textAlign: 'center', lineHeight: '280px', fontSize: '26px'}}>
              暂无数据
            </div>
          }
        </div>
      </Card>
    );
  }
}
