import React, { Component } from 'react';
import { Card, Button, Col, Row, Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './FlowPresentation.less';
import AreaTree from './FlowComponents/AreaTree';
import SearchForm from './FlowComponents/SearchForm';
import _ from 'lodash';
@connect(({ flowPresentation, loading }) => ({
  flowPresentation,
  loading: loading.models.flowPresentation,
}))
class FlowPresentation extends Component {

  clearForm = () => {
    this.child.resetForm()
  }

  onRef = (ref) => {
    this.child = ref
  }
  render() {
    const { flowPresentation: {  } } = this.props;
    return (
      <Card>
        <Row gutter={32}>
          <Col span='5'>
            <AreaTree clearForm = {this.clearForm} styles={styles} />
          </Col>
          <Col span='19'>
            <SearchForm onRef={this.onRef} styles={styles} />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default FlowPresentation;
