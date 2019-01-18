/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Form, DatePicker, Col, Button, Radio, Select } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
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
@connect(({ iPayData, loading }) => ({
  iPayData,
  loading: loading.models.iPayData,
}))
@Form.create()
export default class ChartForm extends Component {
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
      type: 'iPayData/countAndAmount',
      payload: {
        beginDate: e.target.value === 'a'? aWeek : aMonth,
        endDate: today,
      },
    })
  }

  // 点击提交
  handleSubmit = () => {
    const { time } = this.state;
    this.setState({loading: true})
    let _this = this;
    this.props.dispatch({
      type: 'iPayData/countAndAmount',
      payload: {
        beginDate: time[0],
        endDate: time[1],
      },
      callback() {
        _this.setState({loading: false})
      }
    })
  }

  // 点击重置
  handleReset = () => {
    this.setState({
      value: '',
      time: [],
    });
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'iPayData/countAndAmount',
      payload: {},
    })
  }

  render() {
    const { iPayData: {  } } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
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
          <Button onClick={this.handleReset}>重置</Button>
        </Col>
        <Col style={{marginTop: 4, textAlign: 'right'}} span='12'>
          <span style={{color: 'red', marginRight: 6}}>快速查询：</span> 
          <Radio.Group  onChange={this.onRadioChange} value={this.state.value} buttonStyle="solid">
            <Radio.Button value="a">最近7天</Radio.Button>
            <Radio.Button value="b">最近30天</Radio.Button>
          </Radio.Group>   
        </Col>
      </Form>
    );
  }
}