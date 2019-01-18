/*eslint-disable*/
import React, { Component } from 'react';
import { Form, Col, Button, Select } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
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
export default class SearchForm extends Component {
    state = {
      loading: false,
    };

  // 地市变化时查询下面的县区
  handleCityChange = (e) => {
    this.props.form.setFieldsValue({'regionId': '0', 'schoolId': '0'});
    this.props.dispatch({
      type: 'iPayData/getCountyListForCity',
      payload: {
        cityRegionId: e,
      },
    })
    this.props.dispatch({
      type: 'iPayData/updateState',
      payload: {
        schoolListData: [],
      },
    })
  }

  // 县区发生变化查询县区下面的学校
  handleCountChange = (e) => {
    this.props.form.setFieldsValue({'schoolId': '0'});
    this.props.dispatch({
      type: 'iPayData/getSchoolListForCounty',
      payload: {
        countyRegionId: e,
      },
    })
  }

  // 查询一卡通数据列表
  handleSubmit = () => {
    this.setState({ loading: true });
    const { iPayData: { conditionParams } } = this.props;
    const { getFieldsValue } = this.props.form;
    let _this = this;
    let values = getFieldsValue();
    this.props.dispatch({
      type: 'iPayData/totalCountGroupBySchool',
      payload: {
        cityId: values.cityId == 0? '' : values.cityId,
        regionId: values.regionId == 0? '' : values.regionId,
        schoolId: values.schoolId == 0? '' : values.schoolId,
      },
      callback(type, ret) {
        _this.setState({ loading: false });
      }
    })
    this.props.dispatch({
      type: 'iPayData/updateState',
      payload: {
        conditionParams:{
          cityId: values.cityId == 0? '' : values.cityId,
          regionId: values.regionId == 0? '' : values.regionId,
          schoolId: values.schoolId == 0? '' : values.schoolId,          
        }
      },
    })
  }

  // 点击重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'iPayData/totalCountGroupBySchool',
      payload: {
      }
    })
    this.props.dispatch({
      type: 'iPayData/updateState',
      payload: {
        conditionParams:{
          cityId: '',
          regionId: '',
          schoolId: '',
        }
      },
    })
  }


  render() {
    const { iPayData: { regionData, countyListData, schoolListData } } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{overflow: 'hidden', clear: 'both'}}>
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
              {regionData && regionData.map(r => {
                return <Option key={r.REGION_ID} value={r.REGION_ID}>{r.REGION_NAME}</Option>
              })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="县区:">
            {getFieldDecorator('regionId', {
              initialValue: '0',
              onChange: this.handleCountChange,
            })(
              <Select>
                <Option key='0' value='0'>
                  全部
                </Option>
                {!_.isEmpty(countyListData) && countyListData.map(c => {
                  return <Option key={c.REGION_ID} value={c.REGION_ID}>{c.REGION_NAME}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem {...formItemLayout} label="学校:">
            {getFieldDecorator('schoolId', {
              initialValue: '0',
            })(
              <Select>
                <Option key='0' value='0'>
                  全部
                </Option>
                {!_.isEmpty(schoolListData) && schoolListData.map(s => {
                  return <Option key={s.ID} value={s.ID}>{s.SCHOOL_NAME}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col style={{marginTop: 4}} offset='1' span='5'>
          <Button onClick={this.handleSubmit} loading={this.state.loading} style={{marginRight: 20}} type='primary'>查询</Button>
          <Button onClick={this.handleReset}>重置</Button>
        </Col>
      </Form>
    );
  }
}