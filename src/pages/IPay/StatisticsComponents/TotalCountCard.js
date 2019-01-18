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
export default class TotalCountCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { iPayStatistics: { allData }, styles } = this.props;
    const countList = _.get(allData, 'data.countAndAmount.nearDays.data') || [];
    const totalCount = _.get(allData, 'data.countAndAmount.nearDays.nearDaysTotalCount') || 0;
    let data = [];
    if(!_.isEmpty(countList)) {
      countList.map(c => {
        data.push({
          '日期': c.day,
          '笔数': c.cumulativeCount,
        })
      })
    }
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["笔数"],
      // 展开字段集
      key: "date",
      // key字段
      value: "cumulativeCount" // value字段
    });
    const cols = {
      month: {
        range: [0, 1]
      }
    };
    return (
      <Card className={styles.type_card}>
        <div className={styles.type_card_title}>
          交易总笔数：<i style={{color: 'red', fontSize: '24px'}}>{totalCount}</i> 笔
        </div>
        <div className={styles.marquee_box}>
        {!_.isEmpty(data) &&
          <Chart
            height={280}
            data={dv}
            padding={"auto"}
            scale={cols}
            forceFit
          >
            <Legend />
            <Axis name="日期" />
            <Axis
              name="cumulativeCount"
              label={{
                formatter: val => `${val} 笔`
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="area"
              position="日期*cumulativeCount"
              size={2}
              color={"date"}
            />
            <Geom
              type="line"
              position="日期*cumulativeCount"
              size={4}
              shape={"circle"}
              color={"date"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>
        }
        {_.isEmpty(data) &&
          <div style={{textAlign: 'center', lineHeight: '280px', fontSize: '26px'}}>
            暂无数据
          </div>
        }
        </div>
      </Card>
    );
  }
}
