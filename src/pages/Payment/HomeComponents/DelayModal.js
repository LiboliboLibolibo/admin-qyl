/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Col, DatePicker, message } from 'antd';
import _ from 'lodash';
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
@connect(({ paymentHome, loading }) => ({
  paymentHome,
  loading: loading.models.paymentHome,
}))
export default class DelayModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changedEndTime: '', // 更改后的结束时间
    };
  }

  // 更改延期时间
  handleEndDateChange = (date, dateString) => {
    this.setState({
      changedEndTime: dateString,
    })
  }

  // 点击确定
  handleOk = () => {
    const { paymentHome: { delayRecord, conditionParams, schoolId } } = this.props;
    const { changedEndTime } = this.state;
    let _this = this;
    if (_.isEmpty(changedEndTime)) {
      message.error('请更改延期时间');
      return;
    }
    this.props.dispatch({
      type: 'paymentHome/item',
      payload: {
        itemId: delayRecord.itemId,
        endTime: `${changedEndTime} 23:59:59`,
        userId: 1,
      },
      callback(type, ret) {
        if (type === 'success') {
          message.success('延期成功！')
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
              showDelayModal: false,
            },
          })
        } else {
          message.success('延期失败！')
        }
      }
    });
  }

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'paymentHome/updateState',
      payload: {
        showDelayModal: false,
      },
    });
  };

  disabledDate = (current) => {
    const { paymentHome: { delayRecord } } = this.props;
    var now = delayRecord && delayRecord.endTime? delayRecord.endTime : '2017-12-12 00:00:00';
    var momentTime = moment(now,'YYYY-MM-DD HH:mm:ss');
    return current && current < momentTime;
  }

  render() {
    const { paymentHome: { showDelayModal, delayRecord }, styles } = this.props;
    return (
      <Modal
        width="560px"
        title="延期当前收费项目"
        visible={showDelayModal}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Col style={{marginBottom: 20}}>开始时间： {delayRecord &&delayRecord.startTime? delayRecord.startTime.substring(0, 10) : ''}</Col>
        <Col style={{marginBottom: 20}}>结束时间： <DatePicker onChange={this.handleEndDateChange} disabledDate={this.disabledDate} style={{width: 124}} defaultValue={moment(delayRecord &&delayRecord.endTime? delayRecord.endTime.substring(0, 10) : '2015-01-01', dateFormat)} format={dateFormat} /></Col>
      </Modal>
    );
  }
}
