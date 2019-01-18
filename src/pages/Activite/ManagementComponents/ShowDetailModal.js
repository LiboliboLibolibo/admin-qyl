/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Col } from 'antd';
import phoneTitle from '../../../assets/phone_title.jpg';
import _ from 'lodash';

@connect(({ activityManagement, loading }) => ({
  activityManagement,
  loading: loading.models.activityManagement,
}))
export default class ShowDetailModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        showDetailModal: false,
      },
    });
  };

  render() {
    const { activityManagement: { showDetailModal, detailRecord }, styles } = this.props;
    return (
      <Modal
        width="375px"
        title=""
        visible={showDetailModal}
        onCancel={this.handleCancel}
        closable={false}
        className={styles.web}
        header=""
        footer=""
      >
        <div className={styles.article_content}>
          <img src={phoneTitle} alt="" />
          <Col className={styles.call_back} span="3">
            &nbsp;
          </Col>
          <Col className={styles.top_title} span="18">
            {detailRecord && detailRecord.activityName? detailRecord.activityName : ''}
          </Col>
          <Col className={styles.top_share} span="3">
            &nbsp;
          </Col>
          <div className={styles.content_main}>
            {/* <div className={styles.content_main_title}>
              如何成为世界上最有钱的人
            </div> */}
            <div className={styles.content_main_time}>
              {detailRecord && detailRecord.startTime? detailRecord.startTime : ''}
            </div>
            <div
              className={styles.content_main_content}
                dangerouslySetInnerHTML={{ __html:detailRecord && detailRecord.contents? detailRecord.contents : '' }}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
