/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Card, Form, Button, Row, Col, Select, Input, DatePicker, Divider, message, Radio } from 'antd';
import _ from 'lodash';
import moment from 'moment';
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

const statusList = [{
  key: '',
  name: '全部',
}, {
  key: 'waitPay',
  name: '待支付',
},{
  key: 'success',
  name: '交易成功',
},{
  key: 'cancel',
  name: '交易取消',
},{
  key: 'processing',
  name: '交易进行中',
}];

@connect(({ iPayOrder, loading }) => ({
  iPayOrder,
  loading: loading.models.iPayOrder,
}))
@Form.create()
export default class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: '',
      time: [],
    };
  }

  handleReset = () =>{
    const { resetFields } = this.props.form;
    resetFields();
    let _this = this;
    this.props.dispatch({
      type: 'iPayOrder/getOrderList',
      payload: {
        current: 1,
        size: 10,
      },
    })
    this.props.dispatch({
      type: 'iPayOrder/updateState',
      payload: {
        conditionParams: {},
      },
    })
    this.setState({ value: '' })
  }

  // 输入学校名称模糊查询
  handleSearch = (value) => {
    this.props.dispatch({
      type: 'iPayOrder/getSchoolName',
      payload: {
        schoolName: value,
      },
    }); 
  }


  // 点击查询
  handleSubmit = () => {
    this.setState({ loading: true });
    const { time } = this.state;
    const { iPayOrder: { conditionParams } } = this.props;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    delete values.date;
    let _this = this;
    this.props.dispatch({
      type: 'iPayOrder/getOrderList',
      payload: {
        ...conditionParams,
        ...values,
        beginDate: time[0]? time[0] : '',
        endDate: time[1]? time[1] : '',
        gradeId: values.gradeId == '全部'? '' : values.gradeId,
        classId: values.classId == '全部'? '' : values.classId,
        current: 1,
        size: 10,
      },
      callback(type, ret) {
        _this.setState({ loading: false });
      }
    })
    this.props.dispatch({
      type: 'iPayOrder/updateState',
      payload: {
        conditionParams: {
          ...conditionParams,
          ...values,
          beginDate: time[0]? time[0] : '',
          endDate: time[1]? time[1] : '',  
          gradeId: values.gradeId == '全部'? '' : values.gradeId,
          classId: values.classId == '全部'? '' : values.classId,        
        }
      },
    })
  }

  // 快速查询按钮切换
  onRadioChange = (e) => {
    this.props.form.resetFields();
    this.setState({ value: e.target.value, time: [] });
    let [
      yesterday, 
      today,
      tomorrow, 
      aWeek
    ] = [
      moment().subtract(1, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
      moment().subtract(-1, 'days').format('YYYY-MM-DD'),
      moment().subtract(6, 'days').format('YYYY-MM-DD')
    ];
    this.props.dispatch({
      type: 'iPayOrder/getOrderList',
      payload: {
        beginDate: e.target.value === 'a'? yesterday : (e.target.value === 'b'? today : aWeek),
        endDate: e.target.value === 'a'? today : tomorrow,
        current: 1,
        size: 10,
      },
    })
    this.props.dispatch({
      type: 'iPayOrder/updateState',
      payload: {
        conditionParams:{
          beginDate: e.target.value === 'a'? yesterday : (e.target.value === 'b'? today : aWeek),
          endDate: e.target.value === 'a'? today : tomorrow,
        },
      },
    })
  }

  // 选择学校发生变化时
  handleSchoolIdChange = (e) => {
    this.props.form.setFieldsValue({'gradeId': '全部', 'classId': '全部'});
    this.props.dispatch({
      type: 'iPayOrder/getGradeAndClass',
      payload: {
        id: e,
      },
    })
  }

  // 年级发生变化时
  gradeIdChange = (e) => {
    const { iPayOrder: { schoolList, gradeClassList = [] }, styles} = this.props;
    this.props.form.setFieldsValue({ 'classId': '全部'});
    let classes = gradeClassList.filter(g => g.ID == e)
    if (e != '全部') {
      this.props.dispatch({
        type: 'iPayOrder/updateState',
        payload: {
          classList: classes && classes[0].classes? classes[0].classes : [],
        },
      })      
    }
  }

  // 交易时间发生变化
  handleTimeChange = (date, dateString) => {
    this.setState({
      time: dateString,
    })
  }

  // 点击导出
  handleExport = () => {
    const { iPayOrder: { conditionParams } } = this.props;
    let [
      schoolId,
      gradeId,
      classId,
      name,
      cardcode,
      orderNumber,
      studentNumber,
      mobile,
      status,
      beginDate,
      endDate
    ] = [
      _.get(conditionParams,'schoolId')? _.get(conditionParams,'schoolId') : '',
      _.get(conditionParams,'gradeId') && _.get(conditionParams,'gradeId') != '全部'? _.get(conditionParams,'gradeId') : '',
      _.get(conditionParams,'classId') && _.get(conditionParams,'classId') != '全部'? _.get(conditionParams,'classId') : '',
      _.get(conditionParams,'name')? _.get(conditionParams,'name') : '',
      _.get(conditionParams,'cardcode')? _.get(conditionParams,'cardcode') : '',
      _.get(conditionParams,'orderNumber')? _.get(conditionParams,'orderNumber') : '',
      _.get(conditionParams,'studentNumber')? _.get(conditionParams,'studentNumber') : '',
      _.get(conditionParams,'mobile')? _.get(conditionParams,'mobile') : '',
      _.get(conditionParams,'status')? _.get(conditionParams,'status') : '',
      _.get(conditionParams,'beginDate')? _.get(conditionParams,'beginDate') : '',
      _.get(conditionParams,'endDate')? _.get(conditionParams,'endDate') : '',
    ]
    let params = `?schoolId=${schoolId}&gradeId=${gradeId}&classId=${classId}&name=${name}&cardcode=${cardcode}&orderNumber=${orderNumber}&studentNumber=${studentNumber}&mobile=${mobile}&status=${status}&beginDate=${beginDate}&endDate=${endDate}`
    window.open('http://192.168.12.123:7001/api/v1/rechargeOrders/exportExcel'+params)
  }

  render() {
    const { iPayOrder: { schoolList, gradeClassList, classList }, styles} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form style={{overflow: 'hidden', clear: 'both'}}>
          <Row gutter={16}>
            <Col span="6">
              <FormItem {...formItemLayout} label='学校名称'>
                {getFieldDecorator('schoolId', {
                  initialValue: '',
                  onChange: this.handleSchoolIdChange,
                })(
                  <Select
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    { schoolList.map(S => {
                        return (
                          <Option key={S.ID} value={S.ID}>
                            {S.SCHOOL_NAME}
                          </Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="年级:">
                {getFieldDecorator('gradeId', {
                  initialValue: '全部',
                  onChange: this.gradeIdChange,
                })(
                  <Select>
                    <Option key='' value=''>全部</Option>
                    { gradeClassList.map(G => {
                        return (
                          <Option key={G.ID} value={G.ID}>
                            {G.GRADE_NAME}
                          </Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="班级:">
                {getFieldDecorator('classId', {
                  initialValue: '全部',
                })(
                  <Select>
                    <Option key='' value=''>全部</Option>
                    { classList.map(C => {
                        return (
                          <Option key={C.ID} value={C.ID}>
                            {C.CLASS_NAME}
                          </Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="姓名:">
                {getFieldDecorator('name', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="6">
              <FormItem {...formItemLayout} label="卡号:">
                {getFieldDecorator('cardcode', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="平台订单号:">
                {getFieldDecorator('orderNumber', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="学籍号:">
                {getFieldDecorator('studentNumber', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="手机号:">
                {getFieldDecorator('mobile', {
                  initialValue: '',
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="6">
              <FormItem {...formItemLayout} label="订单状态:">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select>
                     { statusList.map(s => {
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
              <FormItem {...formItemLayout} label="交易时间:">
                {getFieldDecorator('date', {
                  initialValue: '',
                  onChange: this.handleTimeChange,
                })(
                  <RangePicker />
                )}
              </FormItem>
            </Col>
            <Col span="12">
              <Button style={{float: 'right', marginTop: 4, marginLeft: 10 }} onClick={this.handleReset}>
                重置
              </Button>
              <Button style={{ marginTop: 4, float: 'right' }} type="primary" loading={this.state.loading} onClick={this.handleSubmit}>
                搜索
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col style={{marginBottom: 10 }} span='16'>
            <Radio.Group  onChange={this.onRadioChange} value={this.state.value} buttonStyle="solid">
              <Radio.Button value="a">昨天</Radio.Button>
              <Radio.Button value="b">今天</Radio.Button>
              <Radio.Button value="c">近7天</Radio.Button>
            </Radio.Group>   
          </Col>
          <Col style={{marginBottom: 10, textAlign: 'right'}} span='8'>
            <Button onClick={this.handleExport} type='primary'>导出数据</Button>
          </Col>          
        </Row>      
      </div> 
    );
  }
}
