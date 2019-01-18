/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Col, Button, Row, message, Form, Input, Table } from 'antd';
import _ from 'lodash';
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
@connect(({ activityManagement, loading }) => ({
  activityManagement,
  loading: loading.models.activityManagement,
}))
@Form.create()
export default class JoinStudentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 按搜索条件搜索学生
  handleSubmit = () => {
    const { activityManagement: { studentConditionParams } } = this.props;
    const { getFieldsValue } = this.props.form;
    let values = getFieldsValue();
    this.props.dispatch({
      type: 'activityManagement/joinStudent',
      payload: {
        ...studentConditionParams,
        ...values,
        current: 1,
        size: 10,
      },
    }); 
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        studentConditionParams: {
          ...studentConditionParams,
          ...values,
        },
      },
    });
  }

  // 点击导出
  handleExport = () => {
    const { activityManagement: { joinStudentRecord } } = this.props;
    let params = `activityId=${joinStudentRecord.activityId}`;
    window.open(`http://192.168.12.169:8692/activities/exportActivityStudents/v1?${params}`)
  }

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        showStudentModal: false,
      },
    });
  };

  // 分页
  handleTableChange(page) {
    const { activityManagement: { studentConditionParams } } = this.props;
    this.props.dispatch({
      type: 'activityManagement/joinStudent',
      payload: {
        current: page.current,
        size: page.pageSize,
        ...studentConditionParams,
      },
    }); 
  }

  render() {
    const { activityManagement: { studentList, studentLoading, studentPagination, showStudentModal, joinStudentRecord }, styles } = this.props;
    const { getFieldDecorator } = this.props.form;
    let modalTitle = `${joinStudentRecord.activityName}--参加人员明细`;
    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        key: 'sort',
        width: 60,
        fixed: 'left',
        render: (text, record, index) => {
          return <span>{index + 1}</span>;
        },
      },
      {
        title: '地市',
        dataIndex: 'cityName',
        key: 'cityName',
        width: 140,
        fixed: 'left',
      },
      {
        title: '县区',
        dataIndex: 'countyName',
        key: 'countyName',
        width: 100,
        fixed: 'left',
      },
      {
        title: '学校名称',
        dataIndex: 'schoolName',
        key: 'schoolName',
        width: 200,
        fixed: 'left',
      },
      {
        title: '年级',
        dataIndex: 'gradeName',
        key: 'gradeName',
        width: 160,
      },
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        width: 120,
      },
      {
        title: '学生姓名',
        dataIndex: 'studentName',
        key: 'studentName',
        width: 120,
      },
      {
        title: '身份证号',
        dataIndex: 'idcard',
        key: 'idcard',
        width: 200,
      },
      {
        title: '报名手机号',
        dataIndex: 'phoneNum',
        key: 'phoneNum',
        width: 200,
      }
    ];
    return (
      <Modal
        width="1000px"
        title={modalTitle}
        visible={showStudentModal}
        onCancel={this.handleCancel}
        footer=""
      >
        <Form style={{overflow: 'hidden', clear: 'both'}}>
          <Row gutter={16}>
            <Col span="6">
              <FormItem {...formItemLayout} label='学校名称'>
                {getFieldDecorator('schoolName', {
                  initialValue: '',
                })(<Input placeholder='请输入学校名称' />)}
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem {...formItemLayout} label='学生姓名'>
                {getFieldDecorator('studentName', {
                  initialValue: '',
                })(<Input placeholder='请输入学生姓名' />)}
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem {...formItemLayout} label='报名手机号'>
                {getFieldDecorator('phoneNum', {
                  initialValue: '',
                })(<Input placeholder='请输入报名手机号' />)}
              </FormItem>
            </Col>
            <Col offset="1" span="4">
              <Button style={{ marginTop: 4 }} type="primary" onClick={this.handleSubmit}>
                搜索
              </Button>
              <Button style={{ marginTop: 4, marginLeft: 10 }} type="primary" onClick={this.handleExport}>
                导出
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={studentList}
          pagination={studentPagination}
          onChange={this.handleTableChange.bind(this)}
          loading={studentLoading}
          scroll={{ x: 1300 }}
          bordered
        />
      </Modal>
    );
  }
}
