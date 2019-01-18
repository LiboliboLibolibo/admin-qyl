/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table } from 'antd';
import _ from 'lodash';
@connect(({ paymentParticulars, loading }) => ({
  paymentParticulars,
  loading: loading.models.paymentParticulars,
}))
export default class StuListModal extends PureComponent {

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'paymentParticulars/updateState',
      payload: {
        showStuListModal: false,
      },
    });
  };

  render() {
    const { paymentParticulars: { showStuListModal, stuList }, styles, params } = this.props;
    let title = params.recordParams.gradeName + params.recordParams.className + (params.type == 0? '应缴人数' :  (params.type == 1? '实缴人数' : '欠缴人数'));
    
    const columns = [
      {
        title: '身份证号',
        dataIndex: 'identity',
        key: 'identity',
        width: 200,
        render: (text) => {
          return(<span>{_.isEmpty(text) || text== " "? '暂无身份信息' : text}</span>)
        }
      },
      {
        title: '学生姓名',
        dataIndex: 'studentName',
        key: 'studentName',
        width: 200,
      }
    ]
    return (
      <Modal
        width="560px"
        title={title}
        visible={showStuListModal}
        onCancel={this.handleCancel}
        footer=''
      >
       <Table
          rowKey={record => record.studentId}
          columns={columns}
          dataSource={stuList}
          pagination={false}
          scroll={{y: 500}}
        />
      </Modal>
    );
  }
}
