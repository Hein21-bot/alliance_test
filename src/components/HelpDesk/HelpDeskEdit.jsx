import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import HelpDeskRequesterInfo from './HelpDeskRequesterInfo';
import Select from 'react-select';
import {
    main_url, validate, getTicketMainCategory, getTicketStatus, getBranch, getDepartment,
    getPriority, getUserId, getSeverity, startSaving, stopSaving, getTicketCategoryType, getTicketSubCategory
} from '../../utils/CommonFunction';

const user_status = [{ value: 1, label: 'Accept' }, { value: 2, label: 'Reject' }];

var form_validate = true;

export default class HelpDeskView
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketType: [],
            allMainCategory: [],
            allSubCategory: [],
            mainCategory: [],
            assignPerson: [],
            ticketStatus: [],
            subCategory: [],
            priority: [],
            branch: [],
            department: [],
            requested_dept: [],
            selected_requested_dept: [],
            updatedBy: getUserId("user_info"),
            data: props.data.helpDesk[0],
            document: props.data.doc,
            newDoc: [],
            selectedSeverity: [],
            selectedPriority: [],
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#HDEdit").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#HDEdit").files[i];
            newDoc.push(getfile)
        }
        this.setState({
            newDoc: newDoc
        })

    }

    getOpenAndCloseStatus(status) {
        let ticket = status.filter(function (s) { return s.value === 1 || s.value === 6 })
        return ticket;
    }

    async componentDidMount() {
        this.getAssignPersonByBranchAndDepartment(this.props.data.helpDesk[0].departmentId, this.props.data.helpDesk[0].branchId)
        let mainCategory = await getTicketMainCategory();
        let subCategory = await getTicketSubCategory();
        let department = await getDepartment();
        let ticketStatus = await getTicketStatus();
        let ticketType = await getTicketCategoryType();
        if (this.props.data.helpDesk[0].createdBy === this.state.updatedBy) {
            ticketStatus = this.getOpenAndCloseStatus(ticketStatus);
        }
        let branch = await getBranch();
        let priority = await getPriority();
        let severity = await getSeverity();
        let dept = await getDepartment();
        var data = this.props.data.helpDesk[0];
        this.setState({
            allMainCategory: mainCategory,
            allSubCategory: subCategory,
            ticketStatus: ticketStatus,
            ticketType: ticketType,
            branch: branch,
            requested_dept: dept,
            department: department,
            priority: priority,
            severity: severity,
            selected_requested_dept: { value: data.requestedDept, label: data.requestedDeptname },
            selectedPriority: { value: data.priority, label: data.priorityName },
            selectedSeverity: { value: data.severity, label: data.severityName }
        }, () => {
            this.setTicketMainCategory();
            this.setTicketSubCategory(data.mainCategoryId)
        })

        // const socket = openSocket('http://localhost:8082');
        // socket.on('helpdesk', data => {
        // })

    }

    getRequestTypeName(id) {
        let type = this.state.ticketType;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];

                break;
            }
        }
        return result;
    }

    handleSelectedSeverity = (event) => {
        let data = this.state.data
        data.severity = event.value
        this.setState({
            data: data,
            selectedSeverity: event
        })
    }

    getLocationBranchName(id) {
        let branch = this.state.branch;
        let result = [];
        for (let i = 0; i < branch.length; i++) {

            if (id == branch[i].value) {
                result = branch[i];
                break;
            }
        }
        return result;
    }

    getDepartmentName(id) {
        let department = this.state.department;
        let result = [];
        for (let i = 0; i < department.length; i++) {

            if (id === department[i].value) {
                result = department[i];
                break;
            }
        }
        return result;
    }

    getTicketStatusName(id) {
        let status = this.state.ticketStatus;
        let result = [];
        for (let i = 0; i < status.length; i++) {

            if (id === status[i].value) {
                result = status[i];
                break;
            }
        }
        return result;
    }

    getTicketMainCategoryName(id) {
        let category = this.state.mainCategory;
        let result = [];
        for (let i = 0; i < category.length; i++) {

            if (id === category[i].value) {
                result = category[i];
                break;
            }
        }
        return result;
    }

    getTicketSubCategoryName(id) {
        let category = this.state.subCategory;
        let result = [];
        for (let i = 0; i < category.length; i++) {

            if (id === category[i].value) {
                result = category[i];
                break;
            }
        }
        return result;
    }

    getAssignPersonName(id) {
        let person = this.state.assignPerson;
        let result = [];
        for (let i = 0; i < person.length; i++) {

            if (id === person[i].value) {
                result = person[i];
                break;
            }
        }
        return result;
    }

    setTicketMainCategory() {
        let all = this.state.allMainCategory;
        let deptID = this.state.data.departmentId;
        let data = this.state.data;
        let ticketType = data.ticketType !== '' ? data.ticketType : 0;
        let main = [];
        let sub = this.state.subCategory;
        if (deptID > 0 || ticketType > 0) {
            if (ticketType > 0) {
                all = all.filter(function (a) {
                    return a.ticket_category_type === ticketType
                })
            }
            if (deptID > 0) {
                all = all.filter(function (a) {
                    return a.departments_id === deptID
                })
            }
            main = all;
        }
        this.setState({
            mainCategory: main,
            subCategory: []
        })

    }

    setTicketSubCategory(main_id) {
        let all = this.state.allSubCategory;
        let sub = all.filter(function (a) { return a.main_category_id === main_id });
        this.setState({
            subCategory: sub
        })
    }

    handleSelectedTicketType = (event) => {
        let data = this.state.data
        data.ticketType = event.value;
        data.mainCategoryId = '';
        data.subCategoryId = '';
        this.setState({
            data: data
        }, () => this.setTicketMainCategory())
    }

    handleSelectedTicketMainCategory = (event) => {
        let data = this.state.data
        data.mainCategoryId = event.value
        data.subCategoryId = ''
        this.setState({
            data: data

        }, () => this.setTicketSubCategory(event.value))
    }

    handleSelectedRequestedDept = (event) => {
        let data = this.state.data;
        data.requestedDept = event.value;
        data.mainCategoryId = '';
        data.subCategoryId = '';
        this.setState({
            data: data,
            selected_requested_dept: event
        }, () => this.setTicketMainCategory())
    }

    getSubCategoryByMain(mainCategoryId) {
        fetch(main_url + "helpDesk/getTicketSubCategoryByMainCategory/" + mainCategoryId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this.setState({ subCategory: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    changeText = (e) => {
        let data = this.state.data;
        let name = e.target.dataset.name;
        data[name] = e.target.value;

        this.setState({
            data: data
        })
    }

    handleSelectedTicketSubCategory = (event) => {
        let data = this.state.data
        data.subCategoryId = event.value;
        data.priority = event.priority_id;
        data.severity = event.severity_id;
        let selectedPriority = { label: event.priority, value: event.priority_id };
        let selectedSeverity = { label: event.severity_name, value: event.severity_id }
        this.setState({
            data: data,
            selectedPriority: selectedPriority,
            selectedSeverity: selectedSeverity
        })
    }

    handleSelectedTicketStatus = (event) => {
        let data = this.state.data
        data.ticket_status_id = event.value
        this.setState({
            data: data
        })
    }

    handleSelectedPriority = (event) => {
        let data = this.state.data
        data.priority = event.value
        this.setState({
            data: data,
            selectedPriority: event
        })
    }

    handleSelectedAssignPerson = (event) => {
        let data = this.state.data
        data.assign_person_id = event.value
        this.setState({
            data: data
        })
    }

    handleSelectedActionStatus = (event) => {
        let data = this.state.data
        data.action_status = event.value
        this.setState({
            data: data
        })
    }

    changeComment = (event) => {
        let data = this.state.data
        data.request_comment = event.target.value
        this.setState({
            data: data
        })
    }

    handleSelectedBranch = async (event) => {
        let data = this.state.data
        data.branchId = event.value
        data.assign_person_id = ''
        this.setState({
            data: data
        }, () => this.getAssignPersonByBranchAndDepartment(data.departmentId, event.value))
    }

    handleSelectedDepartment = (event) => {
        let data = this.state.data
        data.departmentId = event.value;
        data.mainCategoryId = '';
        data.assign_person_id = '';
        this.setState({
            data: data
        }, () => {
            this.setTicketMainCategory()
            this.getAssignPersonByBranchAndDepartment(event.value, data.branchId.value)
        })
    }

    getAssignPersonByBranchAndDepartment(departmentId, branchId) {
        if (branchId === undefined) branchId = 0;
        fetch(main_url + "helpDesk/getAssignPersonByBranchAndDepartment/" + departmentId + "/" + branchId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this.setState({ assignPerson: res, })
                } else {
                    this.setState({ assignPerson: [] })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }


    removeOldDocument(index, event) {
        var array = this.state.document;
        array.splice(index, 1);
        this.setState({
            document: array
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            this.props.editHelpDesk(this.state.updatedBy, this.state.data, this.state.document);
        } else {
            startSaving();
            form_validate = false;
        }
    }

    getActionStatus(status) {
        var action = user_status.filter(function (one) { return one.value === status });
        return action;
    }

    getActionStatusForCreateUser(status) {
        if (status === 0) return { label: 'Request', value: 0 };
        else {
            var action = user_status.filter(function (one) { return Number(one.value) === Number(status) });
            return action[0];
        }
    }

    checkCreateUser() {
        if (this.state.updatedBy === this.state.data.createdBy) return true;
        else return false;
    }


    render() {
        return (
            <div>
                <div className="form-horizontal mt20" name="demo-form" id="check_form">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.getRequestTypeName(this.state.data.ticketType)}
                                        onChange={this.handleSelectedTicketType}
                                        options={this.state.ticketType}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group"   >
                                <div><label className="col-sm-12" >Ticket Name<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10" >

                                    <input
                                        className="form-control input-md checkValidate"
                                        value={this.state.data.ticket_name}
                                        data-name='ticket_name'
                                        onChange={this.changeText}

                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12" >Requested Department<span className="text-danger">*</span></label></div>
                                {
                                    this.checkCreateUser() ?
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control full_width"
                                                value={this.getDepartmentName(this.state.data.departmentId).label}
                                                disabled="true"></input></div> :
                                        <div className="col-sm-10">
                                            <Select
                                                placeholder="Please Choose Type"
                                                value={this.getDepartmentName(this.state.data.departmentId)}
                                                onChange={this.handleSelectedDepartment}
                                                options={this.state.department}
                                                className='react-select-container checkValidate'
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                }
                            </div>

                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Ticket Main Category<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.getTicketMainCategoryName(this.state.data.mainCategoryId)}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        onChange={this.handleSelectedTicketMainCategory}
                                        options={this.state.mainCategory}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20">Ticket Sub Category<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.getTicketSubCategoryName(this.state.data.subCategoryId)}
                                        onChange={this.handleSelectedTicketSubCategory}
                                        options={this.state.subCategory}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Ticket Status<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.getTicketStatusName(this.state.data.ticket_status_id)}
                                        onChange={this.handleSelectedTicketStatus}
                                        options={this.state.ticketStatus}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Severity<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    {/* <Select
                                        placeholder="Please Choose Severity"
                                        value={this.state.selectedSeverity}
                                        onChange={this.handleSelectedSeverity}
                                        options={this.state.severity}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    /> */}
                                    <input type="text" className="form-control full_width" value={this.state.selectedSeverity !== '' ? this.state.selectedSeverity.label : ''} disabled></input>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Priority<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    {/* <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.selectedPriority}
                                        onChange={this.handleSelectedPriority}
                                        options={this.state.priority}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    /> */}
                                    <input type="text" className="form-control full_width" value={this.state.selectedPriority !== '' ? this.state.selectedPriority.label : ''} disabled></input>

                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group"  >
                                <div><label className="col-sm-12 mt20" >Location Branch<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.getLocationBranchName(this.state.data.branchId)}
                                        onChange={this.handleSelectedBranch}
                                        options={this.state.branch}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="row">

                        <div className="col-md-4">
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20" >Assign Person<span className="text-danger">*</span></label></div>
                                {
                                    this.checkCreateUser() ?
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control full_width" value={this.getAssignPersonName(this.state.data.assign_person_id).label} disabled="true">
                                            </input>
                                        </div> :

                                        <div className="col-sm-10">
                                            <Select
                                                placeholder="Please Choose Type"
                                                value={this.getAssignPersonName(this.state.data.assign_person_id)}
                                                onChange={this.handleSelectedAssignPerson}
                                                options={this.state.assignPerson}
                                                className='react-select-container checkValidate'
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                }

                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20" >Action Status</label></div>
                                {
                                    this.checkCreateUser() ?
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control full_width" value={this.getActionStatusForCreateUser(this.state.data.action_status).label} disabled="true">
                                            </input>
                                        </div> :

                                        <div className="col-sm-10">
                                            <Select
                                                placeholder="Please Choose Action"
                                                value={this.getActionStatus(this.state.data.action_status)}
                                                onChange={this.handleSelectedActionStatus}
                                                options={user_status}
                                                className='react-select-container checkValidate'
                                                classNamePrefix="react-select"
                                                disabled={this.state.updatedBy === this.state.data.createdBy ? true : false}
                                            />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group"   >
                                <div><label className="col-sm-12 mt20" >Ticket Description</label></div>
                                <div className="col-sm-10" >
                                    <textarea className="form-control"
                                        cols="20"
                                        rows="5"
                                        data-name='ticket_desc'
                                        value={this.state.data.ticket_desc}
                                        onChange={this.changeText}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6" >
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20">Comment</label></div>
                                <div className="col-md-10">
                                    <textarea className="form-control"
                                        cols="20"
                                        rows="5"
                                        value={this.state.data.request_comment}
                                        placeholder="Enter Comment"
                                        onChange={this.changeComment}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4" >
                            <div className="form-group" >
                                <div><label className="col-sm-12 mt20" >Help Desk Document</label></div>
                                <div className="col-md-12">
                                    <input type="file" id="HDEdit" className="dropZone form-control" onChange={this.handlefileChanged.bind(this)} multiple />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="ibox float-e-margins">
                            <div className="p-md col-md-12" style={{ float: 'left', }}>

                                {this.state.document.map((data, index) =>
                                    <div key={index} className="fileuploader-items col-md-4">
                                        <ul className="fileuploader-items-list">
                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                <div className="columns">
                                                    <div className="column-title">
                                                        <a href={`${main_url}helpDesk/getCRDocumentData/${data.name}`}
                                                            download target='_blank'
                                                            className="btn btn-primary document-body-bt document-width">
                                                            {data.name.split("&@")[1]}
                                                        </a>
                                                    </div>
                                                    {this.state.data.createdBy == this.state.updatedBy ? <div className="column-actions">
                                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                    </div> : ""}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )

                                }

                                {this.state.newDoc.map((data, index) =>

                                    <div className="fileuploader-items col-md-4">
                                        <ul className="fileuploader-items-list">

                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                <div className="columns">
                                                    <div className="column-title">
                                                        <a href='#'

                                                            className="btn btn-primary document-body-bt document-width">
                                                            {data.name}
                                                        </a>
                                                    </div>
                                                    {this.state.data.createdBy == this.state.updatedBy ?
                                                        <div className="column-actions">
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                        </div> : ""}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <HelpDeskRequesterInfo user_id={this.state.data.createdBy} />
                    </div>
                    <div className="row margin-top-20">
                        <div className="col-md-12 btn-rightend">
                            <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

