import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../Benefits/Benefits.css';
import $ from 'jquery';
import { main_url, getCookieData, validate, getUserId, alertText, stopSaving, startSaving } from "../../../utils/CommonFunction";

var form_validate = true;

class BenefitChildAddNew extends Component {
    constructor() {
        super();
        this.state = {
            user_info: getCookieData("user_info"),
            employeeName: [],
            user_id: '',
            designation: '',
            noOfChildren: '',
            status: 0,
            available_amount: 0,
            createdBy: getUserId("user_info"),
            updatedBy: getUserId("user_info"),
            attachment: [],
            newDoc: []
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    componentDidMount() {
        fetch(`${main_url}child_benefit/getChildAvailableAmount`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    available_amount: list.amount
                })
            })
    }

    handleNoOfChildren = (event) => {
        this.setState({
            noOfChildren: event.target.value,
        })
    };
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
        console.log('new doc',this.state.newDoc)
    }

    checkFiles(e) {
        var files = document.getElementById("attach_file").files;
       
        if (files.length > 2) {
            toast.warning('You can only upload a maximum of 2 files!')
        }
        
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#attach_file").files[i];
            newDoc.push(getfile)
        }
        document.getElementById('attach_file').value=''
        this.setState({
            // attachment: attachment,
            newDoc: newDoc
        })
    }
    //@kpk


    save() {
        console.log("new doc",this.state.newDoc)
        console.log("doc",this.state.doc)
       if(this.state.newDoc.length ==0){
        toast.error("Please Choose Attachment File!");

       }else{
        if (validate('check_form') && this.state.newDoc.length > 0) {
            console.log("save new doc",this.state.newDoc)
            $('#saving_button').attr('disabled', true);
            var data = {
                user_id: this.state.user_info.user_id,
                child_count: this.state.noOfChildren,
                available_amount: this.state.available_amount,
                status: this.state.status,
                createdBy: this.state.createdBy,
                updatedBy: this.state.updatedBy
            }
           

                const formdata = new FormData();


            // var obj = document.querySelector("#attach_file").files.length;
            // for (var i = 0; i < obj; i++) {
            //     var imagedata = document.querySelector("#attach_file").files[i];
            //     formdata.append('uploadfile', imagedata);
            // }
             var obj = this.state.newDoc.length;
             for (var i = 0; i < obj; i++) {
                var imagedata = this.state.newDoc[i];
                formdata.append('uploadfile', imagedata);
            }
           
            formdata.append('child_benefit', JSON.stringify(data))

                let status = 0;
                fetch(`${main_url}child_benefit/saveChildBenefit`, {
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
                startSaving();
                form_validate = false;
            }
        }

    }

    render() {
        return (

            <div className="benefits benefit-child-add-new">
                <ToastContainer />
                <div className='row'>
                    <form className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.user_info.fullname}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="designation" className="col-sm-12">Designation</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.user_info.designations}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="available_amount" className="col-sm-12">Available Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        // placeholder="Please Provide The Number Of Your Children"
                                        className="form-control checkValidate"
                                        value={this.state.available_amount}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="spouse-name" className="col-sm-12">Number Of Children</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        // placeholder="Please Provide The Number Of Your Children"
                                        className="form-control checkValidate"
                                        onChange={this.handleNoOfChildren}
                                        value={this.state.noOfChildren}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            {/* <div className="col-md-6">
                                <div><label htmlFor="total_amount" className="col-sm-12">Total Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.total_amount}
                                    />
                                </div>
                            </div> */}
                            {/* <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or At Most Two
                                    Attachment</label>
                                </div>
                                <div className="col-sm-10">
                                    <input className="full_width dropZone" type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>
                                </div>
                            </div> */}
                            <div className="form-group col-md-6">
                                <div>
                                    <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or At Most Two
                                        Attachment</label>
                                </div>
                                <div className="col-sm-10">
                                    <input className="dropZone " type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>
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

                <hr />

                {/* <div className="row">
                    <div className="result-area col-md-12">
                        <table className="table table-bordered table-responsive">
                            <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Designation</th>
                                <th>No Of Children</th>
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
                                                    <td>{item.noOfChildren}</td>
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
                </div> */}

            </div>
        )
    }
}

export default BenefitChildAddNew;