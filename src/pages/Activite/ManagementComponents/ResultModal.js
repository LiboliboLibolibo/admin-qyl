/*eslint-disable*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Col, Button, message } from 'antd';
import _ from 'lodash';
import { EditorState, convertToRaw, convertFromRaw, ContentState, editorContent } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
let initHtml = '<p></p>';
const initFromHTML = htmlToDraft(initHtml);
const conState = ContentState.createFromBlockArray(
  initFromHTML.contentBlocks,
  initFromHTML.entityMap
);

@connect(({ activityManagement, loading }) => ({
  activityManagement,
  loading: loading.models.activityManagement,
}))
export default class ResultModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextprops) {
    const { editorState } = this.state;
    if (!_.isEmpty(nextprops.activityManagement.resultRecord)&&nextprops.activityManagement.resultRecord.result) {
      let templateHtml = nextprops.activityManagement.resultRecord.result;
      const blocksFromHTML = htmlToDraft(templateHtml);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      this.setState({
        editorState: EditorState.createWithContent(state),
      });
    }
  }

  // 编辑富文本编辑框里的内容更改editorState
  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  // 富文本上传图片
  uploadImageCallBack = file => {
    const { activityManagement: { } } = this.props;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/activities/uploadPic/v1');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');
      xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      const data = new FormData();
      data.append('img', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve({ data: { link: response.picUrl } });
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  // 提交活动结果
  handleSubmitResult = () => {
    const { editorState } = this.state;
    let _this = this;
    const { activityManagement: { resultRecord, conditionParams } } = this.props;
    let templateContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.dispatch({
      type: 'activityManagement/addOrUpdateResults',
      payload: {
        id: resultRecord.activityId,
        result: templateContent,
      },
      callback(type, msg) {
        if(type == 'success') {
          _this.props.dispatch({
            type: 'activityManagement/updateState',
            payload: {
              showResultModal: false,
            },
          });
          message.success('操作成功！');
          _this.props.dispatch({
            type: 'activityManagement/v1',
            payload: {
              ...conditionParams,
            },
          });
        } else {
          message.error(msg);
        }
      }
    });
  }

  // 删除当前的活动结果
  handleDeleteResult = () => {
    let _this = this;
    const { activityManagement: { resultRecord, conditionParams } } = this.props;
    this.props.dispatch({
      type: 'activityManagement/addOrUpdateResults',
      payload: {
        id: resultRecord.activityId,
        result: "<p></p>",
        resultFlag: 2,
      },
      callback(type, msg) {
        if(type == 'success') {
          _this.props.dispatch({
            type: 'activityManagement/updateState',
            payload: {
              showResultModal: false,
            },
          });
          message.success('操作成功！');
          _this.props.dispatch({
            type: 'activityManagement/v1',
            payload: {
              ...conditionParams,
            },
          });
        } else {
          message.error(msg);
        }
      }
    });
  }

  // 关闭弹出框
  handleCancel = () => {
    this.props.dispatch({
      type: 'activityManagement/updateState',
      payload: {
        showResultModal: false,
      },
    });
  };

  render() {
    const { activityManagement: { showResultModal, resultRecord }, styles } = this.props;
    const { editorState } = this.state; 
    let modalTitle = `${resultRecord.activityName}--成果展示`;
    return (
      <Modal
        width="760px"
        title={modalTitle}
        visible={showResultModal}
        onCancel={this.handleCancel}
        footer=""
      >
        <div style={{ height: 560, border: '1px solid #ddd', overflow: 'auto' }}>
          <Editor
            editorState={editorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            localization={{ locale: 'zh' }}
            placeholder=" 请输入内容 "
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
              fontFamily: {
                options: [
                  '宋体',
                  '黑体',
                  '楷体',
                  '微软雅黑',
                  'Arial',
                  'Georgia',
                  'Impact',
                  'Tahoma',
                  'Times New Roman',
                  'Verdana',
                ],
              },
              image: {
                uploadCallback: this.uploadImageCallBack,
              },
            }}
          />
        </div>
        <div className={styles.result_action} span='24'>
            <Button onClick={this.handleSubmitResult} type='primary'>确定</Button>
            <Button onClick={this.handleDeleteResult} style={{color: 'red'}}>删除</Button>
            <Button onClick={this.handleCancel}>取消</Button>
        </div>
      </Modal>
    );
  }
}
