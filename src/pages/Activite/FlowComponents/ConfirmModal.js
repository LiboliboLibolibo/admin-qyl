/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Col, message } from 'antd';
import _ from 'lodash';
@connect(({ flowPresentation, loading }) => ({
  flowPresentation,
  loading: loading.models.flowPresentation,
}))
export default class ConfirmModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 点击确定
  handleOk = () => {
    this.props.handleSendFlow();
    
  }

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'flowPresentation/updateState',
      payload: {
        showConfirmModal: false,
      },
    });
  };

  render() {
    const { flowPresentation: { showConfirmModal, selectedRowKeys }, styles } = this.props;
    // 判断是区域赠送还是勾选人赠送
    let isArea = _.isEmpty(selectedRowKeys)? true : false;
    return (
      <Modal
        width="360px"
        title="确认赠送人员信息"
        visible={showConfirmModal}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
      {isArea? 
      <Col style={{color: 'red'}}>你将对下面数据列表中所有符合赠送要求的人员赠送流量, 请确认!</Col> :
      <Col style={{color: 'red'}}>您已选择 {selectedRowKeys.length}人对其赠送流量。请确认!</Col>
    }
      
      </Modal>
    );
  }
}
