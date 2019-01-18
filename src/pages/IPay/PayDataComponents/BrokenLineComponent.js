/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
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
@connect(({ iPayData, loading }) => ({
  iPayData,
  loading: loading.models.iPayData,
}))
export default class BrokenLineComponent extends Component {

  render() {
    const { iPayData: { chartDataList }, styles } = this.props;
    let isEmptyChartData = _.isEmpty(chartDataList)? true : false;
    const cols = {
      cumulativeAmount: {
        min: 0
      },
      day: {
        range: [0, 1]
      }
    };
    return (
      <div>
        {!isEmptyChartData &&
          <Chart height={320} data={chartDataList} scale={cols} forceFit>
            <Axis name="day" />
            <Axis name="cumulativeAmount" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="day*cumulativeAmount" size={1} />
            <Geom
              type="point"
              position="day*cumulativeAmount"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>          
        }
        {isEmptyChartData &&
          <div style={{width: '100%', lineHeight: '320px', background: '#f2f2f2', textAlign: 'center'}}>
            <h2>暂无数据</h2>
          </div>
        }
      </div>
    );
  }
}
