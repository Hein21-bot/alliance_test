import React, { Component } from 'react';
import Select from 'react-select';
import CustomFileInput from '../CustomFileInput';
import '../../Benefits/Benefits.css';
import { toast, ToastContainer } from 'react-toastify';
import { main_url, getUserId, getCookieData, validate, alertText, stopSaving, startSaving, getBranch } from "../../../utils/CommonFunction";

let form_validate = true;
class BenefitOtherAddNew extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            employeeNameList: [],
            user_id: getUserId("user_info"),
            employeeId: '',
            description: '',
            amount: '',
            attachment: [],
            newDoc: [],
            branch: [],
            selected_location: [],
            withdraw_location: 0,
        }
    }

    async componentDidMount() {
        let that = this;
        let branch = await getBranch();
        that.setState({
            branch: branch
        })
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    handleEmployeeName = (event) => {

        this.setState({
            employeeId: event
        });
    };

    changeWithdrawLocation = e => {
        let data = this.state;
        data.withdraw_location = e.value;
        this.setState({
            selected_location: e,
            data: data
        })
    }

    handleDescription = (event) => {

        this.setState({
            description: event.target.value
        });
    };

    handleAmount = (event) => {
        this.setState({
            amount: event.target.value
        })
    };

    checkFiles(e) {
        var files = document.getElementById("attach_file").files;
        var attachment = this.state.attachment;
        if (files.length > 5) {
            toast.warning('You can only upload a maximum of 2 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                var getfile = document.querySelector("#attach_file").files[i];
                attachment.push(getfile)
            }
        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#attach_file").files[i];
            newDoc.push(getfile)
        }


        this.setState({
            attachment: attachment,
            newDoc: newDoc
        })
    }


    save = () => {
        stopSaving();
        if (validate('check_form') && this.state.attachment.length > 0) {

            var data = {
                createdBy: this.state.user_id,
                employeeId: this.state.user_info.user_id,
                description: this.state.description,
                amount: this.state.amount,
                withdraw_location: this.state.withdraw_location
            }
            const formdata = new FormData();
            for (var i = 0; i < this.state.attachment.length; i++) {
                formdata.append('uploadfile', this.state.attachment[i]);
            }
            formdata.append('info', JSON.stringify(data))
            let status = 0;

            fetch(`${main_url}benefit/addOtherBenefit`, {
                method: "POST",
                body: formdata
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        }
        else {

            toast.error(alertText, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            startSaving()
            form_validate = false;
        }
    }
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        var attch = this.state.attachment;
        attch.splice(index, 1);
        array.splice(index, 1);
        this.setState({
            newDoc: array,
            attachment: attch
        })
    }

    render() {
        return (
            <div className="benefits benefits-other">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <div className='row'>
                    <form className="form-group" id="check_form">
                        <div className="col-md-12">
                            <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                            <div className="col-sm-10">
                                {/* <Select
                                    options={this.state.employeeNameList}
                                    placeholder="Please Choose The Employee Name"
                                    onChange={this.handleEmployeeName}
                                    value={this.state.employeeId}
                                /> */}
                                <input
                                    type="text"
                                    className="form-control"
                                    disabled
                                    value={this.state.user_info.fullname}
                                />
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div><label htmlFor="description" className="col-sm-12">Please Enter The Description</label></div>
                            <div className="col-sm-10">
                                <textarea
                                    name="description"
                                    id="description"
                                    cols="30"
                                    rows="10"
                                    placeholder="Please Give The Description"
                                    className="form-control"
                                    onChange={this.handleDescription}
                                >

                                </textarea>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label htmlFor="amount" className="col-sm-12">Please Enter The Amount </label></div>
                            <div className="col-sm-10">
                                <input type="number"
                                    className="form-control checkValidate"
                                    placeholder="Enter The Amount"
                                    onChange={this.handleAmount}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label className='col-sm-12'>Withdraw Location</label></div>
                            <div className='col-sm-10'>
                                <Select
                                    data-name='withdraw_loction'
                                    value={this.state.selected_location}
                                    onChange={this.changeWithdrawLocation}
                                    options={this.state.branch}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                /></div>
                        </div>

                        <div className="form-group col-md-6">
                            <div>
                                <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or At Most Two
                                    Attachment</label>
                            </div>
                            <div className="col-sm-10">
                                <input className="dropZone " type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>
                            </div>
                        </div>

                    </form>

                </div>
                <div>
                    {this.state.newDoc.map((data, index) =>

                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                <div className="columns"><div className="column-thumbnail">
                                    <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                        <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                        </div></div><span className="fileuploader-action-popup"></span></div>
                                    <div className="column-title">
                                        <span className="own-text">
                                            {data.name}</span></div>
                                    <div className="column-actions">
                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                    </div></div></li></ul>
                        </div>
                    )
                    }
                </div>

                <div className="row save-btn">
                    <div className="float-right">
                        <div>
                            <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default BenefitOtherAddNew;