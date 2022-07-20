import React, { Component } from 'react';
import Select from 'react-select';
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserId, validate, startSaving, stopSaving } from "../../utils/CommonFunction";
import DatePicker from 'react-datetime';

var form_validate = true;

class StaffComplainEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedBy: getUserId("user_info"),
            complain: props.data,
            newDoc: [],
            doc: [],

        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }
    componentDidMount() {
        fetch(`${main_url}staff_complain/getDocument/` + this.props.data.staff_complain_id)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    doc: list
                })

            })

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
            newDoc: attachment
        })
    }

    removeOldDocument(index, event) {
        var array = this.state.doc;
        array.splice(index, 1);
        this.setState({
            doc: array
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    save = () => {
        stopSaving();
        if (validate('check_form')) {
            const formdata = new FormData();

            formdata.append('info', JSON.stringify(this.state.complain))
            formdata.append('updatedBy', JSON.stringify(this.state.updatedBy))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            var obj = document.querySelector("#staffEdit").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#staffEdit").files[i];

                formdata.append('uploadfile', imagedata);
            }


            let status = 0;

            fetch(`${main_url}staff_complain/edit/` + this.state.complain.staff_complain_id, {
                method: "POST",
                body: formdata
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {

                    if (status === 200) {
                        toast.success(text);
                        this.props.goToTable();
                    }
                    else toast.error(text);


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
                                Staff Complain Edit
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

                                        value={moment(this.state.complain.case_time).format('h:mm a')}
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
                                        value={this.state.complain.complain_text}
                                        onChange={this.handleDescription}
                                    >

                                    </textarea>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Choose File</label></div>
                                <div className="col-sm-10">
                                    <input type="file" className="dropZone" id="staffEdit" onChange={this.checkFiles.bind(this)} multiple />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div><label htmlFor="description" className="col-sm-2">Is Anonymous</label></div>
                                <div className="col-sm-1">

                                    <input
                                        // className="form-control"
                                        type="checkbox"
                                        onChange={this.changeAnonymous.bind(this)}
                                        checked=
                                        {this.state.complain.isAnonymous === true || this.state.complain.isAnonymous === 1 ? 'checked' : ''}

                                    />

                                </div>
                            </div>

                            <div className="col-md-12" style={{ overflowX: "auto" }}>

                                <div className="ibox float-e-margins">
                                    <div className="p-md col-md-12" style={{ float: 'left', }}>

                                        {this.state.doc.map((data, index) =>
                                            <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                    <div className="columns">
                                                        <div className="column-title">
                                                            <a href={`${main_url}staff_complain/getCRDocumentData/${data.name}`}
                                                                download target='_blank'
                                                                className="btn btn-primary document-body-bt document-width">
                                                                {data.name}
                                                            </a>
                                                        </div>
                                                        <div className="column-actions">
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                        </div>
                                                    </div>

                                                </li></ul>
                                            </div>
                                        )
                                        }

                                        {this.state.newDoc.map((data, index) =>

                                            <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                    <div className="columns">
                                                        <div className="column-title">
                                                            <a href='#'
                                                                className="btn btn-primary document-body-bt document-width">
                                                                {data.name}
                                                            </a>
                                                        </div>
                                                        <div className="column-actions">
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                        </div>
                                                    </div>

                                                </li></ul>
                                            </div>
                                        )
                                        }

                                    </div>
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

export default StaffComplainEdit;