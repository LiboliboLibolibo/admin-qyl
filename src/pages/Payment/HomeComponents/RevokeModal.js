/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Col, message } from 'antd';
import _ from 'lodash';
@connect(({ paymentHome, loading }) => ({
  paymentHome,
  loading: loading.models.paymentHome,
}))
export default class RevokeModal extends PureComponent {

  // 点击确定
  handleOk = () => {
    const { paymentHome: { revokeRecord, conditionParams, schoolId } } = this.props;
    let _this = this;
    // console.log(conditionParams, schoolId)
    // return
    this.props.dispatch({
      type: 'paymentHome/item',
      payload: {
        itemId: revokeRecord.itemId,
        endTime: '',
        userId: 1,
      },
      callback(type, ret) {
        if (type === 'success') {
          message.success('撤销成功！')
          _this.props.dispatch({
            type: 'paymentHome/items',
            payload: {
              schoolId: schoolId,
              ...conditionParams,
            },
          })
          _this.props.dispatch({
            type: 'paymentHome/updateState',
            payload: {
              showRevokeModal: false,
            },
          })
        } else {
          message.success('撤销失败！')
        }
      }
    });
  }

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'paymentHome/updateState',
      payload: {
        showRevokeModal: false,
      },
    });
  };

  render() {
    const { paymentHome: { showRevokeModal, revokeRecord }, styles } = this.props;
    return (
      <Modal
        width="560px"
        title="撤回操作"
        visible={showRevokeModal}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Col style={{marginBottom: 20}}>确定撤回当前缴费项目？</Col>
        <Col style={{marginBottom: 20}}>项目撤回操作不可逆，如果需要重新创建，请去<span style={{color: 'red'}}> “发起缴费项目” </span>页面</Col>
      </Modal>
    );
  }
}
