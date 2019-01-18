/*eslint-disable*/
import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Card, Form, Button, Row, Col, Select, Input, Radio, DatePicker, Upload, message, Icon } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
    md: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 19 },
    sm: { span: 19 },
    md: { span: 19 },
  },
};
@connect(({ appVersion, loading }) => ({
  appVersion,
  loading: loading.models.appVersion,
}))
@Form.create()
export default class SearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      time: '',
    };
  }

  // 提交
  handleSubmit = (e) => {
    let _this = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'appVersion/create',
          payload: {
            ...values,
            create_time: moment(values.time).format("YYYY-MM-DD HH:mm:ss"),
          },
          callback(type, ret) {
            if (type === 'success') {
              message.success('添加成功！')
              _this.props.dispatch({
                type: 'appVersion/qylAppVers',
                payload: {
                  page: 1,
                  perPage: 10,  
                },
              })
              _this.props.form.resetFields();
            } else {
              message.success('添加失败！')
            }
          }
        });
      }
    });
  }

  // 点击清空已填写的form
  handleResetForm = () => {
    const { resetFields } = this.props.form;
    resetFields();
  }

  onDatePickerChange = (value, dateString) => {
    this.setState({
      time: dateString,
    })
  }
  

  render() {
    const { appVersion: { }, styles } = this.props;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    // const props = {
    //   name: 'file',
    //   action: '//jsonplaceholder.typicode.com/posts/',
    //   headers: {
    //     authorization: 'authorization-text',
    //   },
    //   onChange(info) {
    //     if (info.file.status !== 'uploading') {
    //       console.log(info.file, info.fileList);
    //     }
    //     if (info.file.status === 'done') {
    //       message.success(`${info.file.name} file uploaded successfully`);
    //     } else if (info.file.status === 'error') {
    //       message.error(`${info.file.name} file upload failed.`);
    //     }
    //   },
    // };
    
    return (
      <div>
        <h2>发布新版</h2>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span="24">
              <FormItem {...formItemLayout} label="APP类型:">
                {getFieldDecorator('platform_type', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择app类型!' }],
                })(
                  <RadioGroup>
                    <Radio value={'0'}>Android</Radio>
                    <Radio value={'1'}>IOS</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            {/* <Col span="24">
              <FormItem {...formItemLayout} label="文件上传:">
                {getFieldDecorator('file', {
                  initialValue: '',
                })(
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload" /> 上传文件
                    </Button>
                </Upload>
                )}
              </FormItem>
            </Col> */}
            <Col span="24">
              <FormItem {...formItemLayout} label="版本号:">
                {getFieldDecorator('ver', {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入版本号!' }],
                })(
                  <Input style={{width: 200}} />
                )}
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem {...formItemLayout} label="强制升级:">
                {getFieldDecorator('is_must_update', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择是否强制升级!' }],
                })(
                  <RadioGroup>
                    <Radio value={'0'}>否</Radio>
                    <Radio value={'1'}>是</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem {...formItemLayout} label="发布时间:">
                {getFieldDecorator('time', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择发布时间!' }],
                  onChange: this.onDatePickerChange,
                })(
                <DatePicker
                  showTime
                  style={{width: 200}}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="选择发布时间"
                />)}
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem {...formItemLayout} label="版本说明:">
                {getFieldDecorator('ver_desc', {
                  initialValue: '',
                  rules: [{ required: true, message: '请填写发版说明!' }],
                  onChange: this.onDatePickerChange,
                })(
                  <TextArea 
                    placeholder="请输入版本说明" 
                    style={{width: 320}}
                    autosize={{ minRows: 6, maxRows: 8 }} />
                )}
              </FormItem>
            </Col>
            <Col style={{textAlign: 'center'}} span="18">
              <Button
                style={{ marginTop: 4, marginRight: 20 }}
                onClick={this.handleResetForm}
              >
                清空
              </Button>
              <Button
                style={{ marginTop: 4 }}
                type="primary"
                htmlType="submit"
              >
                确定
              </Button>
            </Col>
          </Row>
        </Form>
        <div style={{marginTop: 40}} className={styles.link}>Android下载地址</div>
        <div className={styles.link}><a href="http://download.967111.com/qingyulan.apk">http://download.967111.com/qingyulan.apk</a></div>
        <div className={styles.link}>iOS下载地址</div>
        <div className={styles.link}><a href="https://itunes.apple.com/cn/app/%E9%9D%92%E4%BA%8E%E8%93%9D/id1404817237">https://itunes.apple.com/cn/app/%E9%9D%92%E4%BA%8E%E8%93%9D/id1404817237</a></div>
      </div>
    );
  }
}
