/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import styles from './AppVersion.less';
import FormComponents from './VersionComponents/FormComponents';
import TableComponents from './VersionComponents/TableComponents';
import _ from 'lodash';
@connect(({ appVersion, loading }) => ({
  appVersion,
  loading: loading.models.appVersion,
}))
class AppVersion extends Component {


  render() {
    const { appVersion: {  } } = this.props;
    return (
      <Card>
        <Row gutter={16}>
          <Col span='10'>
            <FormComponents styles={styles} />
          </Col>
          <Col span='14'>
            <TableComponents styles={styles} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default AppVersion;
