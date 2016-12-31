import React, { Component, PropTypes } from 'react'
import { ipcRenderer } from 'electron'
import TinyMCE from 'react-tinymce'

class RichEditor extends Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: props.value
    }
    this.handleFinishUploadFile = this.handleFinishUploadFile.bind(this)
  }

  componentWillMount() {
    ipcRenderer.on("finish-add-file", this.handleFinishUploadFile)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("finish-add-file", this.handleFinishUploadFile)
  }

  handleFinishUploadFile(e, fileUrl) {
		console.log("finishUploadFile", fileUrl)
		tinymce.getEditor("tinymce").execCommand('mceInsertContent',false,'<img src="'+fileUrl+'" />');
	}

  getContent() {
    return this.state.value
  }

	handleChange(e) {
		this.setState({
			value: e.target.getContent()
		})
	}

  render() {
    const { value } = this.props

    return (
			<div className="tinymce">
	      <TinyMCE id="tinymce"
					content={value}
				 	config={{
						plugins: 'link media table textcolor contextmenu hr preview',
	          toolbar: 'styleselect bold italic forecolor | alignleft aligncenter alignright outdent indent | bullist numlist table | link image media',
						contextmenu: "link",
						menubar: "",
						resize: false,
						statusbar: false,
						height: '100%',
						file_picker_types: 'image'
					}}
					onDrop={(e) => {console.log(e)}}
					onChange={this.handleChange.bind(this)} />
			</div>
    )
  }
}

RichEditor.propTypes = {
  value: PropTypes.string.isRequired
}

export default RichEditor
