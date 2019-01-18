/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Card, Form, Button, Row, Col, Select } from 'antd';
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

@connect(({ paymentParticulars, loading }) => ({
  paymentParticulars,
  loading: loading.models.paymentParticulars,
}))
@Form.create()
export default class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      classList: [], // 班级列表数据
    };
  }

  // 点击查询
  handleSubmit = () => {
    const { paymentParticulars: { schoolId } } = this.props;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    let itemId = JSON.parse(sessionStorage.getItem('detailParams')).itemId; 
    this.props.dispatch({
      type: 'paymentParticulars/statisticsByClassId',
      payload: {
        gradeName: values.gradeName == '全部'? '' : values.gradeName,
        className: values.className == '全部'? '' : values.className,
        itemId: itemId,
        schoolId: schoolId,
        current: 1,
        size: 10,
      },
    });
    this.props.dispatch({
      type: 'paymentParticulars/updateState',
      payload: {
        conditionParams: {
          gradeName: values.gradeName == '全部'? '' : values.gradeName,
          className: values.className == '全部'? '' : values.className,
        }
      },
    });
  };

  // 当年级下拉列表发生变化时
  handleGradeChange = (e) => {
    const { paymentParticulars: { gradeClassList } } = this.props;
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
    const { paymentParticulars: { schoolId } } = this.props;
    const { resetFields } = this.props.form;
    let itemId = JSON.parse(sessionStorage.getItem('detailParams')).itemId; 
    resetFields();
    this.props.dispatch({
      type: 'paymentParticulars/statisticsByClassId',
      payload: {
        schoolId: schoolId,
        itemId: itemId,
        current: 1,
        size: 10,
      },
    });
  }

  render() {
    const { paymentParticulars: { gradeClassList=[] }, styles} = this.props;
    const { classList } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{overflow: 'hidden', clear: 'both', marginTop: '30px'}}>
        <Row gutter={16}>
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
          <Col offset="2" span="10">
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
