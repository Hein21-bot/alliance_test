import React, { Component } from 'react';
import '../../Benefits/Benefits.css';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData, validate, alertText, stopSaving, startSaving } from "../../../utils/CommonFunction";
import moment from 'moment';

var form_validate = true;
class BenefitFuneralAddNew extends Component {
    constructor(props) {
        super(props);
        var user_info = getCookieData("user_info");
        this.state = {
            one_benefit: this.props.data,
            employee_name: user_info.fullname,
            designations: user_info.designations,
            user_id: user_info.user_id,
            training_type: '',
            available_amount: 0,
            training_date: '',
            request_amount: '',
            purpose: '',
            training_period: '',
            dataSource: [],
            selectedDeadPerson: '',
            status: 0,
            createdBy: user_info.user_id,
            updatedBy: user_info.user_id,
            attachment: [],
            newDoc: []
        }
    }

    componentDidMount() {
        this.getAvailableAmount();
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    getAvailableAmount() {
        fetch(`${main_url}external_benefit/getExternalAvailableAmount/${this.state.user_id}/${moment().format('YYYY')}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    available_amount: list.amount
                })
            })
    }

    handleTrainingType = (event) => {
        this.setState({
            training_type: event.target.value
        })
    }

    handleAvailableAmount = (event) => {
        this.setState({
            available_amount: event.target.value
        })
    }

    handleTrainingDate = (event) => {
        this.setState({
            training_date: event.target.value
        }, () => this.getAvailableAmount(this.state.training_date))
    }

    handleAmount = (event) => {
        this.setState({
            request_amount: event.target.value
        })
    }

    handlePurpose = (event) => {
        this.setState({
            purpose: event.target.value
        })
    }

    handlePeriod = (event) => {
        this.setState({
            training_period: event.target.value
        })
    }
    //@kpk
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    save() {
        if(this.state.attachment.length == 0){
            toast.error("Please Choose Attachment File!")
        }else{
            if (validate("check_form") && this.state.attachment.length > 0) {
                $('#saving_button').attr('disabled', true);
                var data = {
                    user_id: this.state.user_id,
                    available_amount: this.state.available_amount,
                    training_name: this.state.training_type,
                    training_date: this.state.training_date,
                    training_period: this.state.training_period,
                    request_amount: this.state.request_amount,
                    training_purpose: this.state.purpose,
                    status: this.state.status,
                    createdBy: this.state.createdBy,
                    updatedBy: this.state.updatedBy
                }
    
                const formdata = new FormData();
    
                var obj = this.state.newDoc.length;
                for (var i = 0; i < obj; i++) {
                    var imagedata = this.state.newDoc[i];
                    formdata.append('uploadfile', imagedata);
                }
    
                formdata.append('external_benefit', JSON.stringify(data))
    
                let path = 'saveExternalBenefit';
                if (!Array.isArray(this.state.one_benefit) && this.state.one_benefit !== null) {
                    path = `editExternalBenefit/${this.state.one_benefit.external_training_id}`;
                }
                let status = 0;
                fetch(`${main_url}external_benefit/${path}`, {
                    method: "POST",
                    body: formdata
                })
                    .then(res => {
                        status = res.status;
                        return res.text()
                    })
                    .then(text => {
                        if (status !== 200) {
                            this.setState({
                                status: this.state.status
                            })
                        }
                        this.props.showToast(status, text)
                    })
            }
            else {
                startSaving();
                form_validate = false;
                toast.error(alertText, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }
        
    }

    checkFiles(e) {
        var files = e.target.files;
        var attachment = [];
        if (files.length > 2) {
            toast.warning('You can only upload a maximum of 2 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                attachment.push(files[i])
            }
        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var j = 0; j < obj; j++) {
            var getfile = document.querySelector("#attach_file").files[j];
            newDoc.push(getfile)
        }
        this.setState({
            newDoc: newDoc,
            attachment: attachment
        })
    }

    render() {
        return (
            <div className="benefits benefit-external-training">
                {/* <ToastContainer /> */}
                <div className='row'>
                    <form className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control'
                                        value={this.state.employee_name}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12">Please Enter The Training Type ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control checkValidate"
                                        placeholder="What is your training type"
                                        onChange={this.handleTrainingType}
                                        value={this.state.training_type}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="date-of-training" className="col-sm-12">Please Enter The Date of Training ? </label></div>
                                <div className="col-sm-10">
                                    <input type="date"
                                        className="form-control checkValidate"
                                        placeholder="Provide The Date Of Training"
                                        onChange={this.handleTrainingDate}
                                        value={this.state.training_date}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="available-amount" className="col-sm-12">Available Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control"
                                        placeholder="Enter The Available Amount"
                                        onChange={this.handleAvailableAmount}
                                        value={this.state.available_amount}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-period" className="col-sm-12">Please Enter The Training Period ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control checkValidate"
                                        placeholder="Enter The Training Period"
                                        onChange={this.handlePeriod}
                                        value={this.state.training_period}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Please Enter The Request Amount ? </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control checkValidate"
                                        placeholder="Enter The Amount"
                                        onChange={this.handleAmount}
                                        value={this.state.request_amount}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-purpose" className="col-sm-12">Please Enter The Training Purpose ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Enter The Training Purpose"
                                        onChange={this.handlePurpose}
                                        value={this.state.purpose}
                                    />
                                </div>
                            </div>

                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or At Most Two
                                Attachment</label>
                                </div>

                                <div className="col-sm-10">
                                    <input className="full_width dropZone" type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>

                                    {/* <CustomFileInput
                                        btnName="Upload"
                                        onChange={this.checkFiles.bind(this)}
                                        id="attach_file"
                                    /> */}
                                </div>
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
                                            {data.name}
                                        </span></div>
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

                <hr />

                {/* <div className="row">
                    <div className="result-area col-md-12">
                        <table className="table table-bordered table-responsive">
                            <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Designation</th>
                                <th>Dead Person</th>
                                <th>Head Number</th>
                                <th>Action</th>
                            </tr>
                            </thead>


                            <tbody>

                            {
                                (this.state.dataSource.length <= 0) ?
                                    ( <tr><td colSpan="8" className="text-center font-weight-bold text-white bg-danger">
                                        No Data To Show
                                    </td></tr> ) :
                                    (this.state.dataSource.map((item, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td>{item.employeeName}</td>
                                                    <td>{item.designation}</td>
                                                    <td>{item.deadPerson}</td>
                                                    <td>{item.headNo}</td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={this.handleRemove.bind(this, index)}>Remove</button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )
                            }
                            </tbody>

                        </table>
                    </div>
                </div>
                 */}

            </div>
        )
    }
}

export default BenefitFuneralAddNew;