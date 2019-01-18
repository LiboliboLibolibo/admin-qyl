/*eslint-disable*/
import React, { Component } from 'react';
import { Card, Col } from 'antd';
import { connect } from 'dva';
import styles from './IPayOrder.less';
import SearchForm from './OrderComponents/SearchForm';
import TableComponent from './OrderComponents/TableComponent';
import DetailComponent from './OrderComponents/DetailComponent';
import _ from 'lodash';
@connect(({ iPayOrder, loading }) => ({
  iPayOrder,
  loading: loading.models.iPayOrder,
}))
class IPayOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
    };
  }

  changeDetailComponent = () => {
    const {isShow} = this.state;
    this.setState({
      isShow: !isShow,
    })
  }

  render() {
    const { iPayOrder: { data } } = this.props;
    const {isShow} = this.state;
    return (
      <Card>
        {isShow &&
          <div>
            <SearchForm styles={styles} />
            <TableComponent
              changeDetailComponent = {this.changeDetailComponent}
              styles={styles} />
          </div>          
        }
        {!isShow &&
          <div>
            <DetailComponent  
              changeDetailComponent = {this.changeDetailComponent}
              styles={styles}/>
          </div>          
        }
      </Card>
    );
  }
}

export default IPayOrder;