/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Card, Form, Button, Row, Col, Select, Input, Icon } from 'antd';
import _ from 'lodash';
const FormItem = Form.Item;
const Option = Select.Option;
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
  key: '',
  name: '全部',
},{
  key: 1,
  name: '待缴费',
},{
  key: 2,
  name: '已缴费',
}];

@connect(({ paymentDetail, loading }) => ({
  paymentDetail,
  loading: loading.models.paymentDetail,
}))
@Form.create()
export default class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      classList: [],
    };
  }

  // 点击查询
  handleSubmit = () => {
    const { paymentDetail: { schoolId } } = this.props;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    
    this.props.dispatch({
      type: 'paymentDetail/stuItemsDetail',
      payload: {
        ...values,
        className: values.className == '全部'? '' : values.className,
        gradeName: values.gradeName == '全部'? '' : values.gradeName,
        schoolId: schoolId,
        current: 1,
        size: 10,
      },
    });
    this.props.dispatch({
      type: 'paymentDetail/updateState',
      payload: {
        conditionParams: {
          ...values,
        }
      },
    });
  };

  // item名称发生变化
  handleItemChange = (e) => {
    const { paymentDetail: { schoolId } } = this.props;
    this.props.dispatch({
      type: 'paymentDetail/gradeAndClass',
      payload: {
        schoolId: schoolId,
        itemId: e,
      },
    });
    this.props.form.setFieldsValue({'className': '全部', 'gradeName': '全部'});
  }


  // 当年级下拉列表发生变化时
  handleGradeChange = (e) => {
    const { paymentDetail: { schoolId, gradeClassList } } = this.props;
    let selectedGrade = [];
    if (e != 0) {
      selectedGrade = gradeClassList.filter(g => g.gradeName == e);
      this.setState({
        classList: selectedGrade[0].classes,
      })
    }
    this.props.form.setFieldsValue({'className': '全部'});
  }

  // 点击清空
  handleReset = () => {
    const { paymentDetail: { schoolId } } = this.props;
    const { resetFields } = this.props.form;
    resetFields();
    this.props.dispatch({
      type: 'paymentDetail/stuItemsDetail',
      payload: {
        schoolId: schoolId,
        current: 1,
        size: 10,
      },
    });
    this.props.dispatch({
      type: 'paymentDetail/updateState',
      payload: {
        conditionParams: {},
        selectedGrade: [],
      },
    });
  }

  // 导出数据
  handleExport = () => {
    const { paymentDetail: { conditionParams, schoolId } } = this.props;
    let params = _.isEmpty(conditionParams)? `schoolId=${schoolId}` :`schoolId=${schoolId}&itemId=${conditionParams.itemId}&gradeName=${conditionParams.gradeName}&className=${conditionParams.className == "全部"? "" : conditionParams.className}&studentName=${conditionParams.studentName}&identity=${conditionParams.identity}&payStatus=${conditionParams.payStatus}`
    
    window.open(`http://114.115.156.188:8681/joinus/ipay/items/exportStuItems/v1?${params}`)
  }

  render() {
    const { paymentDetail: { nameList, gradeClassList }, styles} = this.props;
    const { classList } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{overflow: 'hidden', clear: 'both'}}>
        <Row gutter={16}>
          <Col span="6">
            <FormItem {...formItemLayout} label="缴费项目:">
              {getFieldDecorator('itemId', {
                initialValue: '',
                onChange: this.handleItemChange,
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                  { nameList.map(n => {
                    return (
                      <Option key={n.itemId} value={n.itemId}>
                        {n.itemName}
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
              {getFieldDecorator('gradeName', {
                initialValue: '',
                onChange: this.handleGradeChange,
              })(
                <Select>
                  <Option key='' value=''>全部</Option>
                  { gradeClassList.map((g, index) => {
                      return (
                        <Option key={index} value={g.gradeName}>
                          {g.gradeName}
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
              {getFieldDecorator('className', {
                initialValue: '',
              })(
                <Select>
                  <Option key='' value=''>全部</Option>
                  { classList.map((c, index) => {
                      return (
                        <Option key={index} value={c.className}>
                          {c.className}
                        </Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem {...formItemLayout} label="缴费状态:">
              {getFieldDecorator('payStatus', {
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
        </Row>
        <Row>
        <Col span="6">
          <FormItem {...formItemLayout} label="学生姓名:">
            {getFieldDecorator('studentName', {
              initialValue: '',
            })(
              <Input />
            )}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="身份证号:">
            {getFieldDecorator('identity', {
              initialValue: '',
            })(
              <Input />
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
        <Col span="6">
          <Button style={{ marginTop: 4, float: 'right' }} type="primary" onClick={this.handleExport}>
          <Icon type="download" /> 导出当前数据
          </Button>
        </Col>
      </Row>  
    </Form>
    );
  }
}
