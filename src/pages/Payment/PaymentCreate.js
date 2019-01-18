/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Form, Input, Select, Col, Button, Radio, InputNumber, DatePicker, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm';
import styles from './PaymentCreate.less';
import _ from 'lodash';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
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
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
@connect(({ paymentCreate, loading }) => ({
  paymentCreate,
  loading: loading.models.paymentCreate,
}))
@Form.create()
class PaymentCreate extends Component {
  state = {
    isDisabled: true,
    sendTime: '',
    gradeIds: [],
    classIds: [],
    studentIds: [],
    count: 0, // 计算所要缴费的人员数
    payMoney: 0,
    totalMoney: 0,
    startTime: '',
    endTime: '',
    checkedValues: [],
    loading: false, // 提交按钮loading
  }

  onChange = (value, label, extra) => {
    const { paymentCreate: { treeData } } = this.props;
    const { gradeIds, classIds, studentIds, payMoney } = this.state;
    let [aIds, aCount, gIds, gCount, cCount, cIds, sIds] =[[],[],[],[],[],[],[]]; 
    let studentCount = 0;
    // 组装发送给后台的年级，班级，学生id数组
    if (!_.isEmpty(value)) {
      value.map(v => {
        if (v.indexOf('a') != -1) {
          aIds.push(v.split('-')[1])
          aCount.push(v.split('-')[2])
        } else if (v.indexOf('g') != -1) {
          gIds.push(v.split('-')[1])
          gCount.push(v.split('-')[2])
        } else if(v.indexOf('c') != -1){
          cIds.push(v.split('-')[1])
          cCount.push(v.split('-')[2])
        } else if(v.indexOf('s') != -1){
          sIds.push(v.substring(2,v.length))
        }
      })
    }
    [...gCount, ...cCount, ...aCount].map(gc =>{
      studentCount += Number(gc)
    })

    this.setState({
      gradeIds: gIds,
      classIds: cIds,
      studentIds: sIds,
      count: (studentCount+sIds.length),
      totalMoney: payMoney*(studentCount+sIds.length),
      checkedValues: value,
    })
  }

  // 发送时间
  handleTimeChange = (e) => {
    let value = e.target.value;
    this.setState({
      isDisabled: value === 2 ? false : true,
    })
  }

  // 当缴费金额发生变化时
  handleItemChange = (e) => {
    const { count } = this.state;
    if(Number(e)){
      this.setState({
        totalMoney: e*count,
        payMoney: e,
      })
    } else {
      this.setState({
        totalMoney: 0,
        payMoney: 0,
      })
    }
  }

  // 缴费时间发生变化
  handleSendTimeChange = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }

  // 发送缴费通知
  handleSubmit = () => {
    const { paymentCreate: { schoolId } } = this.props;
    this.setState({ loading: true })
    let _this = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        delete values.time; 
        delete values.ids; 
        delete values.sendType; 
        const {startTime, endTime, sendTime, gradeIds, classIds, studentIds, checkedValues, totalMoney, count} = this.state;
        let isAll = checkedValues.join(',').indexOf('a') != -1 ? true : false;
        if(count == 0){
          message.error('发布的缴费人数不能为0！')
          this.setState({ loading: false })
          return
        }
        let queryParams = {
          startTime: _.isEmpty(startTime)? '' : `${startTime} 00:00:00`,
          endTime: _.isEmpty(endTime)? '' : `${endTime} 23:59:59`,
          sendTime: sendTime,
          itemCount: count,
          endFlag: 0,
          ifAllStu: isAll,
          schoolId: schoolId,
          userId: 1,
          gradeIds: gradeIds.join(','),
          classIds: classIds.join(','),
          studentIds: studentIds.join(','),
          ...values,
          itemMoney: (values.itemMoney)*100,
        };
        this.props.dispatch({
          type: 'paymentCreate/item',
          payload: {
            ...queryParams,
          },
          callback(type, ret) {
            _this.setState({ loading: false })
            if (type === 'success') {
              message.success('发布成功！')
            } else {
              message.success('发布失败！')
            }
          }
        })      
      } else {
        this.setState({ loading: false })
      }
    });
    
  }

  // 定时发送选择时间
  onHandleTimeChange = (e) => { 
    let time = moment(e).format("YYYY-MM-DD HH:mm:ss");
    let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    if ( time < date ) {
        message.error('不能选当前以前的时间');
        return;
    }else{
      this.setState({
          sendTime: time,
      })            
    }
  }

  onLoadData = (node) => {

    const { paymentCreate: { treeData } } = this.props;
    let [gId, cId] = [node.props.gradeId || '', node.props.classId || ''];
    
    let _this = this;
    return new Promise((resolve) => {
      resolve();
      this.props.dispatch({
        type: 'paymentCreate/studentList',
        payload: {
          classId: node.props.classId,
        },
        callback(type, ret) {
          if (type === 'success') {
            let data = [];
            if (ret && ret.rows && ret.rows.length>0) {
              data = ret.rows.map(td => {
                return {
                  key: `s-${td.studentId}` || '',
                  title: td.studentNamed || '',
                  value: `s-${td.studentId}` || '',
                  isLeaf: true,
                }
              })
              if(gId&&cId&&!_.isEmpty(data)) {
                treeData[0].grades.forEach( (item) => {
                  if(item && item.gradeId == gId && !_.isEmpty(item.classes)) {
                    item.classes.forEach( (ch) => {
                      if(ch && !_.isEmpty(ch) && ch.classId == cId) {
                        ch['children'] = data
                      }
                    })
                  }
                })
              }
              _this.props.dispatch({
                type: 'paymentCreate/updateState',
                payload: {
                  treeData: [...treeData],
                },
              })
            } 
          }
        },
      });
    });    
  }

  disabledDate = (current) => {
    return current && current < moment().subtract(1, "days");
  }

  render() {
    const { isDisabled, count, totalMoney } = this.state;
    const { paymentCreate: { treeData=[] } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      loadData:this.onLoadData,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '下拉勾选发送对象',
      style: {
        width: 332,
      },
    };

    return (
      <Card>
        <Form>
          <Col span="24">
            <FormItem {...formItemLayout} label="缴费名称:">
              {getFieldDecorator('itemName', {
                rules: [{ required: true, message: '请填写缴费名称!'}],
                initialValue: '',
              })(
                <Input style={{width: 332}}/>
              )}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem {...formItemLayout} label="缴费金额:">
              {getFieldDecorator('itemMoney', {
                rules: [{ required: true, message: '请填写缴费金额!'}],
                initialValue: '',
                onChange: this.handleItemChange,
              })(
                <InputNumber min={0.01} precision={2} style={{width: 100}} />
              )} 元/人
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem {...formItemLayout} label="缴费时间:">
              {getFieldDecorator('time', {
                rules: [{ required: true, message: '请选择缴费开始，结束时间!'}],
                initialValue: '',
                onChange: this.handleSendTimeChange,
              })(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem {...formItemLayout} label="缴费说明:">
              {getFieldDecorator('itemDesc', {
                initialValue: '',
              })(
                <TextArea style={{width: 332}} placeholder="输入缴费说明" autosize={{ minRows: 4, maxRows: 6 }} />
              )}
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem {...formItemLayout} label="缴费对象:">
              {getFieldDecorator('ids', {
                initialValue: '',
              })(
                <TreeSelect {...tProps} />
              )} 共(<span style={{color: 'red'}}>{count}</span>)人
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem {...formItemLayout} label="发送时间:">
              {getFieldDecorator('sendType', {
                rules: [{ required: true, message: '请选择缴费类型!'}],
                initialValue: 1,
                onChange: this.handleTimeChange,
              })(
                <RadioGroup>
                  <Radio value={1}>即时发送</Radio>
                  <Radio value={2}>定时发送</Radio>
                </RadioGroup>
              )}
              <span className="ant-form-text">
                <DatePicker
                    disabled={isDisabled}
                    onChange={this.onHandleTimeChange}
                    renderExtraFooter={() => '选完日期后,请点击 "选择时间" 进行选时'}
                    showTime={{
                      hideDisabledOptions: true,
                      format: 'HH:mm',
                      defaultValue: moment('00:00', 'HH:mm')
                    }}
                    disabledDate={this.disabledDate}
                    format={dateFormat}
                />
            </span>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem {...formItemLayout} label="应收总额:">
              <span>{String(totalMoney).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 元</span>
            </FormItem>
          </Col>
          <Col style={{textAlign: 'center'}} span="24">
            <Button style={{ marginTop: 4 }} type="primary" loading={this.state.loading} onClick={this.handleSubmit}>
              发送缴费通知
            </Button>
        </Col>
      </Form>
      </Card>
    );
  }
}

export default PaymentCreate;