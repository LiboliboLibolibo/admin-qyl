/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tree, Divider } from 'antd';
import _ from 'lodash';
const TreeNode = Tree.TreeNode;
@connect(({ flowPresentation, loading }) => ({
  flowPresentation,
  loading: loading.models.flowPresentation,
}))
export default class AreaTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: '河南省', key: '001', type: '1', id: '001', children: [] },
      ],
    };
  }

  onExpand = (expandedKeys) => {
    this.props.dispatch({
      type: 'flowPresentation/updateState',
      payload: {
        expandedKeys,
      },
    })
  };

  onLoadData = (treeNode) => {
    const { flowPresentation: { expandedKeys, checkedKeys } } = this.props;
    let _this = this;
    return new Promise((resolve) => {
      resolve();
      this.props.dispatch({
        type: 'flowPresentation/atomTrees',
        payload: {
          id: treeNode.props.eventKey,
          type: treeNode.props.dataRef.type,
        },
        callback(type, ret) {
          if (type === 'success') {
            let data = [];
            if (ret.rows.length>0) {
              data = ret.rows.map(td => {
                return {
                  key: td.id,
                  title: td.name,
                  isLeaf: td.type == 3? true : false,
                  ...td,
                }
              })
              treeNode.props.dataRef.children = data;
            } else {
              let filterExpandedKeys = expandedKeys.filter(e => e != treeNode.props.id)
              _this.props.dispatch({
                type: 'flowPresentation/updateState',
                payload: {
                  expandedKeys: filterExpandedKeys,
                },
              })
            }
            _this.setState({
              treeData: [..._this.state.treeData],
            })
          }
        },
      });
    });    
  }

  // 点击选中树节点
  onSelect = ( selectedKeys, e) => {
    const { flowPresentation: { conditionParams } } = this.props;
    this.props.dispatch({
      type: 'flowPresentation/updateState',
      payload: {
        selectedKeys,
        conditionParams: {
          giveFlag: 0,
          roleType: 0,
          reward: 0,
          regionId: e.node.props.dataRef.id,
          type: e.node.props.dataRef.type,
        },
      },
    })
    this.props.dispatch({
      type: 'flowPresentation/getDataList',
      payload: {
        giveFlag: 0,
        roleType: 0,
        reward: 0,
        regionId: e.node.props.dataRef.id,
        type: e.node.props.dataRef.type,
      },
    })
    // 点击树节点查询流量红包列表数据
    this.props.clearForm();
  }

  renderTreeNodes = treeData => {
    return treeData.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode dataRef={item} {...item} />;
    });
  };

  render() {
    const { flowPresentation: { checkedKeys, selectedKeys = ['001'], expandedKeys = [] }, styles } = this.props;
    return (
      <div className={styles.treeDiv}>
        <Tree
          // showLine
          onExpand={this.onExpand}
          loadData={this.onLoadData}
          expandedKeys={expandedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          checkedKeys={checkedKeys}
          selectedKeys={selectedKeys}
        >
          {this.renderTreeNodes(this.state.treeData)}
        </Tree>        
      </div>
      
    );
  }
}
