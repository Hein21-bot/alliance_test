import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import {
    main_url, getUserId, getActionStatus, validate, havePermission, getWorkFlowStatus,alertText,
    stopSaving, startSaving
} from "../../../utils/CommonFunction";
import ApprovalForm from '../../Common/ApprovalForm';
import DocumentList from '../../Common/DocumentList';

var form_validate = true;
class BenefitChildEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updatedBy: getUserId("user_info"),
            datasource: props.data,
            doc: [],
            newDoc: [],
            is_main_role: false,
            available_amount: 0,
            status_title: '',
            work_flow_status: {},
            comment: ''
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    async componentDidMount() {
        this.getDocument();
        var work_flow = await getWorkFlowStatus(this.state.datasource.user_id, this.state.updatedBy, 'Child Benefit', 'Benefit');
        this.setState({
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
    }

    getDocument() {
        fetch(main_url + "child_benefit/getDocument/" + this.props.data.child_benefit_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {

                    this.setState({
                        doc: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    // getAvailableAmount() {
    //     fetch(`${main_url}child_benefit/getChildAvailableAmount`)
    //         .then(res => { if (res.ok) return res.json() })
    //         .then(list => {
    //             this.setState({
    //                 available_amount: list.amount
    //             })
    //         })
    // }

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#dropEditChildBenefit").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#dropEditChildBenefit").files[i];
            newDoc.push(getfile)

        }

        this.setState({
            newDoc: newDoc,
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

    handleNoOfChildren = (event) => {
        let data = this.state.datasource
        data.child_count = event.target.value
        this.setState({
            datasource: data
        })
    };

    // getEmployeeName(id) {
    //     let type = this.state.employeeName;
    //     let result = [];
    //     for (let i = 0; i < type.length; i++) {

    //         if (id === type[i].value) {
    //             result = type[i];

    //             break;
    //         }
    //     }
    //     return result;
    // }
    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment },
            () => this.save())
    }

    save() {
        stopSaving();
        if (validate('check_form') && (this.state.newDoc.length > 0 || this.state.doc.length > 0)) {
            var { status_title, is_main_role } = this.state;
            var data = {
                status: this.state.datasource.status == 5 ? 0 : this.state.datasource.status,
                updatedBy: this.state.updatedBy,
                child_count: this.state.datasource.child_count,
            }
            const formdata = new FormData();
            var obj = document.querySelector("#dropEditChildBenefit").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#dropEditChildBenefit").files[i];
                formdata.append('uploadfile', imagedata);
            }

            let status = 0;

            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.datasource, this.state.updatedBy, this.state.comment);
                data.referback_by = action.referback_by;
                data.checked_by = action.checked_by;
                data.verified_by = action.verified_by;
                data.approved_by = action.approved_by;
                data.rejected_by = action.rejected_by;
                data.referback_date = action.referback_date;
                data.checked_date = action.checked_date;
                data.verified_date = action.verified_date;
                data.approved_date = action.approved_date;
                data.rejected_date = action.rejected_date;
                data.referback_comment = action.referback_comment;
                data.checked_comment = action.checked_comment;
                data.verified_comment = action.verified_comment;
                data.approved_comment = action.approved_comment;
                data.status = action.status;
    
            }
            formdata.append('child_benefit', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            fetch(`${main_url}child_benefit/editChildBenefit/` + this.state.datasource.child_benefit_id, {
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

    render() {
        let { is_main_role } = this.state;

        return (
            <div className="benefits benefit-child-add-new">
                <form className="form-group" id="check_form">
                    <div className='row'>
                        <div className="col-md-6">
                            <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                            <div className="col-sm-10">
                                <input
                                    className="form-control"
                                    value={this.state.datasource.fullname}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div><label htmlFor="designation" className="col-sm-12">Designation</label></div>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    // placeholder="Please Provide The Designation"
                                    className="form-control"
                                    disabled
                                    // onChange={this.handleDesignation.bind(this)}
                                    value={this.state.datasource.designations}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row margin-top-20">
                        <div className="col-md-6">
                            <div><label className="col-sm-12">Available Amount</label></div>
                            <div className="col-sm-10">

                                <input
                                    type="text"
                                    // placeholder="Please Provide The Number Of Your Children"
                                    className="form-control checkValidate"
                                    value={this.state.datasource.available_amount}
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
                                    value={this.state.datasource.child_count}
                                // disabled={is_main_role ? true : false}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="row margin-top-20">
                        <div className="col-md-6">
                            <div><label htmlFor="total_amount" className="col-sm-12">Total Amount</label></div>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    disabled
                                    value={this.state.available_amount * this.state.datasource.child_count}
                                />
                            </div>
                        </div>
                    </div> */}
                    {is_main_role ?
                        this.state.doc.length > 0 ?
                            <div className="row document-main">
                                <input className="full_width hidden dropZone" type="file" id="dropEditChildBenefit" ></input>

                                <DocumentList title='Child Benefit Document' doc={this.state.doc} path="child_benefit" />
                            </div> : <input className="full_width hidden dropZone" type="file" id="dropEditChildBenefit" ></input>
                        :

                        <div className="row">
                            <div className="col-md-12" style={{ overflowX: "auto" }}>
                                <div className="ownspacing"></div>
                                <h4>Child Benefit Document</h4>
                                <div className="col-md-12">
                                    <input type="file" className="dropZone" id="dropEditChildBenefit" onChange={this.handlefileChanged.bind(this)} multiple /></div>

                                <div className="ibox float-e-margins">
                                    <div className="p-md col-md-12" style={{ float: 'left', }}>

                                        {this.state.doc.map((data, index) =>
                                            <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                    <div className="columns">
                                                        <div className="column-title">
                                                            <a href={`${main_url}child_benefit/getCRDocumentData/${data.name}`}
                                                                download target='_blank'
                                                                className="btn btn-primary document-body-bt document-width">
                                                                {data.name.split("&@")[1]}
                                                            </a>
                                                        </div>
                                                        <div className="column-actions">
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                        </div>
                                                    </div></li></ul>

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
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                        </div>
                                                    </div></li></ul>
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </form>
                <div className="row save-btn">
                    {
                        havePermission(this.state.work_flow_status) ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.datasource.status} work_flow={this.state.work_flow_status} total_amount={this.state.available_amount} />
                            :
                            <div className="col-md-12 btn-rightend">
                                {this.state.datasource.status == undefined || this.state.datasource.status == 5 ?
                                    <div>
                                        <button onClick={this.save.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                    </div>
                                    :
                                    ''
                                }
                                {/* <button onClick={this.save.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button> */}
                            </div>
                    }
                </div>

            </div>
        )
    }
}

export default BenefitChildEdit;