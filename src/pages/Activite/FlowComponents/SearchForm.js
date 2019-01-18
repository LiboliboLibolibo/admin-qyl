/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Card, Form, Button, Row, Col, Select, Input, DatePicker, Divider, message } from 'antd';
import TableComponents from './TableComponents';
import ConfirmModal from './ConfirmModal';
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

const flowList = [{
  key: 0,
  name: '全部',
},{
  key: 1,
  name: '否',
},{
  key: 2,
  name: '是',
}];

const typeList = [{
  key: 0,
  name: '全部',
},{
  key: 1,
  name: '家长',
},{
  key: 2,
  name: '老师',
}];
const stateList = [{
  key: 0,
  name: '全部',
},{
  key: 1,
  name: '未录入',
},{
  key: 2,
  name: '已录入，未送',
},{
  key: 3,
  name: '已录入，送中',
},{
  key: 5,
  name: '已录入，送失败',
},{
  key: 6,
  name: '已录入，送成功',
}];

@connect(({ flowPresentation, loading }) => ({
  flowPresentation,
  loading: loading.models.flowPresentation,
}))
@Form.create()
export default class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    this.props.onRef&&this.props.onRef(this)
  }

  // 点击赠送流量
  handleSendFlow = () => {
    const { flowPresentation: { conditionParams, selectedRowKeys } } = this.props;
    let updateFlag = _.isEmpty(selectedRowKeys)? 1 : 2;
    let _this = this;
    this.props.dispatch({
      type: 'flowPresentation/giveFlow',
      payload: {
        updateFlag: updateFlag,
        flowIds: _.isEmpty(selectedRowKeys)? '' : selectedRowKeys.join(','),
        ...conditionParams,
      },
      callback(type, ret) {
        if (type === 'success') {
          _this.props.dispatch({
            type: 'flowPresentation/updateState',
            payload: {
              selectedRowKeys: [],
              showConfirmModal: false,
            },
          })
          message.success('操作成功！')
          _this.props.dispatch({
            type: 'flowPresentation/getDataList',
            payload: {
              ...conditionParams,
              current: 1,
              size: 10,
            },
          })
        } else {
          message.success('操作失败！')
        }
      }
    });
  }

  // 展示赠送确定框
  handleShowConfirmModal = () => {
    this.props.dispatch({
      type: 'flowPresentation/updateState',
      payload: {
        showConfirmModal: true,
      },
    })
  }

  resetForm = () =>{
    const { resetFields } = this.props.form;
    resetFields();
  }

  // 输入学校名称模糊查询
  handleSearch = (value) => {
    this.props.dispatch({
      type: 'flowPresentation/getSchoolName',
      payload: {
        schoolName: value,
      },
    }); 
  }


  // 点击查询
  handleSubmit = () => {

    const { flowPresentation: { conditionParams }, styles} = this.props;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    this.props.dispatch({
      type: 'flowPresentation/getDataList',
      payload: {
        ...conditionParams,
        ...values,
        current: 1,
        size: 10,
      },
    })
    this.props.dispatch({
      type: 'flowPresentation/updateState',
      payload: {
        selectedRowKeys: [],
        conditionParams: {
          ...conditionParams,
          ...values,          
        }
      },
    })
  }

  // 点击导出
  handleExport = () => {
    const { flowPresentation: { conditionParams } } = this.props;
    let params =`schoolId=${conditionParams.schoolId?conditionParams.schoolId : ''}&telNum=${conditionParams.telNum? conditionParams.telNum : ''}&regionId=${conditionParams.regionId}&type=${conditionParams.type}&roleType=${conditionParams.roleType}&giveFlag=${conditionParams.giveFlag}&reward=${conditionParams.reward}`
    window.open(`http://192.168.12.169:8692/compositions/exportExcel/v1?${params}`)
  }

  render() {
    const { flowPresentation: { cityLists, schoolList=[], countryLists, data }, styles} = this.props;
    let disabled = _.isEmpty(data)? true : false;
    const { getFieldDecorator } = this.props.form;
    const options = schoolList.map(d => <Option value={d.id} key={d.id}>{d.schoolName}</Option>);
    return (
      <div>
        <Form style={{overflow: 'hidden', clear: 'both'}}>
          <Row gutter={16}>
            <Col span="6">
              <FormItem {...formItemLayout} label='学校名称'>
                {getFieldDecorator('schoolId', {
                  initialValue: '',
                  // onSearch: this.handleSearch,
                })(
                  <Select
                  showSearch
                  placeholder="输入学校名称"
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.handleSearch}
                >
                  {options}
                </Select>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="操作手机号:">
                {getFieldDecorator('telNum', {
                  initialValue: '',
                })(
                  <Input placeholder='请输入手机号' />
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="是否送流量:">
                {getFieldDecorator('reward', {
                  initialValue: 0,
                })(
                  <Select>
                    { flowList.map(f => {
                        return (
                          <Option key={f.key} value={f.key}>
                            {f.name}
                          </Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label="类型:">
                {getFieldDecorator('roleType', {
                  initialValue: 0,
                })(
                  <Select>
                    { typeList.map(t => {
                        return (
                          <Option key={t.key} value={t.key}>
                            {t.name}
                          </Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="6">
              <FormItem {...formItemLayout} label="赠送状态:">
                {getFieldDecorator('giveFlag', {
                  initialValue: 0,
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
            <Col span="18">
              <Button style={{float: 'right', marginTop: 4, marginLeft: 10 }} disabled={disabled} type="primary" onClick={this.handleShowConfirmModal}>
                赠送流量
              </Button>
              <Button style={{float: 'right', marginTop: 4, marginLeft: 10 }} disabled={disabled} onClick={this.handleExport}>
                导出
              </Button>
              <Button style={{ marginTop: 4, float: 'right' }} type="primary" onClick={this.handleSubmit}>
                搜索
              </Button>
            </Col>
          </Row>
        </Form>
        <TableComponents styles={styles} />
        <ConfirmModal handleSendFlow={this.handleSendFlow} styles={styles} />        
      </div> 
    );
  }
}
