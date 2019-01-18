/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Card, Form, Button, Row, Col, Select, Input, DatePicker } from 'antd';
import _ from 'lodash';
const FormItem = Form.Item;
const Option = Select.Option;
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

const stateList = [{
  key: 1,
  name: '未开始',
},{
  key: 2,
  name: '进行中',
},{
  key: 3,
  name: '已结束',
},{
  key: 4,
  name: '已撤回',
}];

@connect(({ paymentHome, loading }) => ({
  paymentHome,
  loading: loading.models.paymentHome,
}))
@Form.create()
export default class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: [], // 查询时间
    };
  }

  // 点击查询
  handleSubmit = () => {
    const { paymentHome: { schoolId } } = this.props;
    const { time } = this.state;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    delete values.timeWidth; 
    let pueryParams = {
      beginDate: _.isEmpty(time)? '' : time[0],
      endDate: _.isEmpty(time)? '' : time[1],
      schoolId: schoolId,
      current: 1,
      size: 10,
      ...values,
    };
    this.props.dispatch({
      type: 'paymentHome/items',
      payload: {
        ...pueryParams,
      },
    });
    this.props.dispatch({
      type: 'paymentHome/updateState',
      payload: {
        conditionParams: {
          beginDate: _.isEmpty(time)? '' : time[0],
          endDate: _.isEmpty(time)? '' : time[1],
          ...values,
        }
      },
    });
  };

  // 点击清空
  handleReset = () => {
    const { paymentHome: { schoolId } } = this.props;
    const { resetFields } = this.props.form;
    resetFields();
    this.props.dispatch({
      type: 'paymentHome/items',
      payload: {
        schoolId: schoolId,
        current: 1,
        size: 10,
      },
    });
  }

  // 时间范围更改
  onRangeChange = (date, dateString) => {
    this.setState({
      time: dateString,
    });
  }

  render() {
    const { paymentHome: { nameList }, styles} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{overflow: 'hidden', clear: 'both'}}>
        <Row gutter={16}>
          <Col span="6">
            <FormItem {...formItemLayout} label="时间范围:">
              {getFieldDecorator('timeWidth', {
                initialValue: '',
                onChange: this.onRangeChange,
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem {...formItemLayout} label="状态:">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select>
                  { stateList.map(s => {
                    return (
                      <Option key={s.key} value={s.key}>
                        {s.name}
                      </Option>
                    );
                  })
                }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem {...formItemLayout} label="缴费项目:">
              {getFieldDecorator('itemName', {
                initialValue: '',
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  { nameList.map(n => {
                    return (
                      <Option key={n.itemId} value={n.itemName}>
                        {n.itemName}
                      </Option>
                    );
                  })
                }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col offset="2" span="4">
            <Button style={{ marginTop: 4 }} type="primary" onClick={this.handleSubmit}>
              查询
            </Button>
            <Button style={{ marginTop: 4, marginLeft: 10 }} onClick={this.handleReset}>
              重置
            </Button>
        </Col>
        </Row>
      </Form>
    );
  }
}
