/*
* Custom File Input
*
* This Component Is Only For Good Look Of Input Type Files.
* Visit github page for documentation and usages
*
* @author RTDev
*
* @version 0.1.0
*
*
*/
import React, {Component} from 'react';

const customFile = {
	position: 'relative',
	cursor: 'pointer'
};
		
const customFileInputContainer = {
	width: '100%',
	display: 'block',
	border: '1px solid #e5e6e7',
	borderRadius: '1px',
	outline: 'none',
	padding: '8px 12px'
};

const customFileInput = {
	width:'0',
	height:'0',
	opacity: '0'
};

const customFileLabel = {
	position: 'absolute',
	right: '0',
	color: '#495057',
	background: '#e9ecef',
	border: '1px solid #ced4da',
	borderRadius: '2px',
	padding: '9px 13px',
	textAlign: 'center',
	cursor: 'pointer'
};

const placeHolder = {
	color: '#999',
	fontSize: '14px',
	lineHeight: '1.428'
};

const noOfFiles = {
	padding: '3px',
    borderRadius: '2px',
    textAlign: 'center'
};

class CustomFileInput extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let localDocument = document;

		if(this.props.btnBg) {
			localDocument.querySelector('.customFileLabel').style.backgroundColor = this.props.btnBg;
		}

		if(this.props.btnColor) {
			localDocument.querySelector('.customFileLabel').style.color = this.props.btnColor;
		}

		if(this.props.isMultiple === "true") {
			localDocument.querySelector('.customFileInput').setAttribute('multiple', 'multiple');
		}


		//when the input was clicked open the file select box
		localDocument.querySelector('.customFile').onclick = function() {
			localDocument.querySelector('.customFileInput').click();
		};

		//show file name when file is select
		localDocument.querySelector('.customFileInput').onchange = function() {
			let fileName = this.value.split("\\").pop();
			let defaultName = localDocument.querySelector('.placeHolder').innerHTML;

			if(fileName != "") {
				localDocument.querySelector('.placeHolder').innerHTML = fileName;
			} else {
				localDocument.querySelector('.placeHolder').innerHTML = defaultName;

			}
		}


	}

	handleChange(event) {
		let noOfFiles = event.target.files.length;
		document.querySelector('.noOfFiles .number').innerHTML = noOfFiles;
		this.props.onChange(event);
	}

	render() {
		return(
			<div style = {customFile} className="customFile">
				<span style = {customFileLabel} className="customFileLabel">{this.props.buttonName ? this.props.buttonName : 'Browse'}</span>

				<div style = {customFileInputContainer} className="customFileInputContainer">
					<span className="placeHolder" style={placeHolder}>
						{
							(this.props.value) ? this.props.value : 'Choose Files'
						}
					</span>


					<input
						type="file"
						style = {customFileInput}
						className="customFileInput"
                        multiple
						onChange={this.handleChange.bind(this)}
						id={this.props.id ? this.props.id : ''}
					/>

				</div>
                <div className="noOfFiles bg-info" style={noOfFiles}><span className="number"> 0 </span> Files Selected</div>

			</div>
		);
	}
}

export default CustomFileInput;