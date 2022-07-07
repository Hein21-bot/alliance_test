import React, { Component } from 'react';
import Select from 'react-select';

import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserId, validate, stopSaving, startSaving } from "../../utils/CommonFunction";
import DatePicker from 'react-datetime';

var form_validate = true;
class StaffComplainAddNew extends Component {
    constructor() {
        super();
        this.state = {

            complain: {
                user_id: getUserId("user_info"),
                case_date: new Date(),
                case_time: new Date(),
                isAnonymous: true,
                complain_text: '',
                createdBy: getUserId("user_info"),
            },
            attachment: []

        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    checkFiles(e) {

        var files = e.target.files;
        var attachment = [];
        if (files.length > 3) {
            toast.warning('You can only upload a maximum of 3 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                attachment.push(files[i])
            }
        }

        this.setState({
            attachment: attachment
        })
    }



    save = () => {
        stopSaving();
        if (validate('check_form')) {
            const formdata = new FormData();

            formdata.append('info', JSON.stringify(this.state.complain))

            var obj = document.querySelector("#attach_file").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#attach_file").files[i];

                formdata.append('uploadfile', imagedata);
            }

            let status = 0;

            fetch(`${main_url}staff_complain/add`, {
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
        } else {
            startSaving();
            form_validate = false;
        }

    }

    changeCaseDate(value) {
        let data = this.state.complain;
        data.case_date = value
        this.setState({
            complain: data
        })

    }

    changeCaseTime(value) {
        let data = this.state.complain;
        data.case_time = value
        this.setState({
            complain: data
        })

    }
    handleDescription = (event) => {
        let data = this.state.complain
        data.complain_text = event.target.value
        this.setState({
            complain: data
        });
    };

    changeAnonymous(event) {
        let data = this.state.complain
        data.isAnonymous = event.target.checked
        this.setState({ complain: data })
    }

    render() {
        return (
            <div className="benefits benefits-other">
                <ToastContainer />
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Staff Complain
                                </li>
                            <li>
                                Staff Complain Add New
                                </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: '2%' }}>
                        <button className="btn btn-primary" onClick={this.props.goBack}>Back To List</button>
                    </div>
                </div>
                <div className="form-horizontal mt20" name="demo-form" id="check_form">
                    <div className='row'>
                        <form className="form-group">
                            <div className="col-md-6">
                                <div><label className="col-sm-12">Case Date</label></div>
                                <div className="col-sm-10">
                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        className="checkValidate"
                                        value={this.state.complain.case_date}
                                        timeFormat={false}
                                        onChange={this.changeCaseDate.bind(this)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label className="col-sm-12">Case Time</label></div>
                                <div className="col-sm-10">
                                    <DatePicker
                                        className="checkValidate"
                                        timeFormat={true}
                                        value={this.state.complain.case_time}
                                        dateFormat={false}

                                        onChange={this.changeCaseTime.bind(this)}
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
                                        rows="5"
                                        placeholder="Please Give The Description"
                                        className="form-control checkValidate"
                                        onChange={this.handleDescription}
                                    >

                                    </textarea>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Choose File</label></div>
                                <div className="col-sm-10">
                                    <input type="file" className="dropZone" id="attach_file" onChange={this.checkFiles.bind(this)} multiple />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div><label htmlFor="description" className="col-sm-2">Is Anonymous</label></div>
                                <div className="col-sm-1">

                                    <input
                                        // className="form-control"
                                        type="checkbox"
                                        onChange={this.changeAnonymous.bind(this)}
                                        checked={this.state.complain.isAnonymous === true ? 'checked' : ''}

                                    />

                                </div>
                            </div>


                        </form>

                    </div>

                    <div className="row save-btn">
                        <div className="float-right">
                            <div>
                                <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button>
                            </div>

                        </div>
                    </div>
                </div>

            </div >
        )
    }
}

export default StaffComplainAddNew;