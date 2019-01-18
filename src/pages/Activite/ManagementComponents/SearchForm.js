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

const objList = [{
  key: 2,
  name: '全部',
},{
  key: 0,
  name: '仅小学',
},{
  key: 1,
  name: '仅小记者',
}];

const stateList = [{
  key: 2,
  name: '全部',
},{
  key: 0,
  name: '下架',
},{
  key: 1,
  name: '上架',
}];

@connect(({ activityManagement, loading }) => ({
  activityManagement,
  loading: loading.models.activityManagement,
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
    const { time } = this.state;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    delete values.activiteTime; 
    let pueryParams = {
      startTime: _.isEmpty(time)? '' : time[0],
      end: _.isEmpty(time)? '' : time[1],
      current: 1,
      size: 10,
      ...values,
    };
    this.props.dispatch({
      type: 'activityManagement/v1',
      payload: {
        ...pueryParams,
      },
    });
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        conditionParams: {
          startTime: _.isEmpty(time)? '' : time[0],
          end: _.isEmpty(time)? '' : time[1],
          ...values,
        }
      },
    });
  };

  // 点击重置
  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.dispatch({
      type: 'activityManagement/v1',
      payload: {
        cityId: 0,
        countyId: 0,
        targets: 2,
        commitFlag: 2,
      },
    });
  }

  // 查询活动时间更改
  onRangeChange = (date, dateString) => {
    this.setState({
      time: dateString,
    });
  }

  // 地市列表切换查询对应的县区
  handleCityChange = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      'countyId': '0', 
    })
    this.props.dispatch({
      type: 'activityManagement/getCountry',
      payload: {
        regionId: e,
      },
    });
  }

  render() {
    const { activityManagement: { cityLists, countryLists }, styles} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{overflow: 'hidden', clear: 'both'}}>
        <Col span="6">
          <FormItem {...formItemLayout} label='活动名称'>
            {getFieldDecorator('activityName', {
              initialValue: '',
            })(<Input placeholder='请输入活动名称' />)}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="活动时间:">
            {getFieldDecorator('activiteTime', {
              initialValue: '',
              onChange: this.onRangeChange,
            })(
              <RangePicker />
            )}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="地市:">
            {getFieldDecorator('cityId', {
              initialValue: '0',
              onChange: this.handleCityChange,
            })(
              <Select>
                <Option key='0' value='0'>
                      全部
                </Option>
                { cityLists.map(cl => {
                  return (
                    <Option key={cl.id} value={cl.id}>
                      {cl.name}
                    </Option>
                  );
                })
              }
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="县区:">
            {getFieldDecorator('countyId', {
              initialValue: '0',
            })(
              <Select>
                <Option key='0' value='0'>
                  全部
                </Option>
                { countryLists.map(cu => {
                  return (
                    <Option key={cu.id} value={cu.id}>
                      {cu.name}
                    </Option>
                  );
                })
              }
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="对象:">
            {getFieldDecorator('targets', {
              initialValue: 2,
            })(
            <Select>
              { objList.map(o => {
                  return (
                    <Option key={o.key} value={o.key}>
                      {o.name}
                    </Option>
                  );
                })
              }
            </Select>)}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="启用状态:">
            {getFieldDecorator('commitFlag', {
              initialValue: 2,
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
            </Select>)}
          </FormItem>
        </Col>
        <Col offset="2" span="4">
          <Button style={{ marginTop: 4 }} type="primary" onClick={this.handleSubmit}>
            搜索
          </Button>
          <Button style={{ marginTop: 4, marginLeft: 10 }} onClick={this.handleReset}>
            重置
          </Button>
        </Col>
      </Form>
    );
  }
}
