/*eslint-disable*/
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, DatePicker, Col, Button, Radio } from 'antd';
import _ from 'lodash';
import moment from 'moment';
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
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
  },
};
@connect(({ appDataStatistics, loading }) => ({
  appDataStatistics,
  loading: loading.models.appDataStatistics,
}))
@Form.create()
export default class TotalUserChart extends Component {
  state = {
    loading: false,
    value: '',
    time: [],
  };

  // 时间范围发生变化
  handleTimeChange = (date, dateString) => {
    this.setState({
      time: dateString,
    })
  }

  // 快速查询按钮切换
  onRadioChange = (e) => {
    this.setState({ value: e.target.value });
    let [
      aWeek, 
      today, 
      aMonth
    ] = [
      moment().subtract(7, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
      moment().subtract(30, 'days').format('YYYY-MM-DD')
    ];
    this.props.dispatch({
      type: 'appDataStatistics/userCountStatistics',
      payload: {
        startDay: e.target.value === 'a'? aWeek : aMonth,
        endDay: today,
      },
    })
  }

  // 点击提交
  handleSubmit = () => {
    const { time } = this.state;
    const { appDataStatistics: { condition } } = this.props;
    this.setState({loading: true, value: ''})
    let _this = this;
    this.props.dispatch({
      type: 'appDataStatistics/userCountStatistics',
      payload: {
        startDay: time[0],
        endDay: time[1],
        ...condition,
      },
      callback() {
        _this.setState({loading: false})
      }
    })
  }

  render() {
    const { appDataStatistics: { userDataList }, styles } = this.props;
    const { getFieldDecorator } = this.props.form;
    const ds = new DataSet();
    const dv = ds.createView().source(userDataList);
    dv.transform({
      type: "fold",
      fields: ["注册用户总数"],
      // 展开字段集
      key: "date",
      // key字段
      value: "count" // value字段
    });
    const cols = {
      month: {
        range: [0, 1]
      }
    };
    return (
      <Card>
        <h3>注册用户总数</h3>
        <Form style={{overflow: 'hidden', clear: 'both'}}>
          <Col span="6">
            <FormItem {...formItemLayout} label="时间范围:">
              {getFieldDecorator('timeWidth', {
                rules: [{ required: true, message: '请选择活动时间段！' }],
                onChange: this.handleTimeChange,
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col style={{marginTop: 4}} offset='1' span='5'>
            <Button loading={this.state.loading} onClick={this.handleSubmit} style={{marginRight: 20}} type='primary'>查询</Button>
          </Col>
          <Col style={{marginTop: 4, textAlign: 'right'}} span='12'>
            <span style={{color: 'red', marginRight: 6}}>快速查询：</span> 
            <Radio.Group  onChange={this.onRadioChange} value={this.state.value} buttonStyle="solid">
              <Radio.Button value="a">最近7天</Radio.Button>
              <Radio.Button value="b">最近30天</Radio.Button>
            </Radio.Group>   
          </Col>
        </Form>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Legend />
          <Axis name="日期" />
          <Axis
            name="count"
            label={{
              formatter: val => `${val} 人`
            }}
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="日期*count"
            size={2}
            color={"date"}
          />
          <Geom
            type="point"
            position="日期*count"
            size={4}
            shape={"circle"}
            color={"date"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </Card>
    );
  }
}
