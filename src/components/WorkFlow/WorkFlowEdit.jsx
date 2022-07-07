import React, { Component } from 'react'
import Select from 'react-select';
import { main_url, validate, getUserId, getDesignation, getLevel } from '../../utils/CommonFunction';

var form_validate = true;
const workflow_type = [{ label: 'Work Flow', value: 1 }, { label: 'Work Flow Wiht Branch', value: 2 }]

export default class WorkFlowEdit
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designation: [],
            permissionType: [],
            permissionTitle: [],
            level: [],
            selected_work_flow: workflow_type[this.props.type - 1],
            updatedBy: getUserId("user_info"),
            data: props.data.data[0],
            check: props.data.check[0],
            verify: props.data.verify[0],
            approve: props.data.approve[0]

        }
    }


    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {
        let designation = await getDesignation();
        let level = await getLevel();
        this.setState({
            designation: designation,
            level: level
        })
    }

    handleLevel = (event) => {
        let data = this.state.data;
        data.isRequestLevel = event.target.checked
        data.isRequestDesignation = !event.target.checked
        data.request_status = 0
        this.setState({
            data: data
        })
    }
    handleCheckLevel = (event) => {
        let data = this.state.data;
        data.isCheckLevel = event.target.checked
        data.isCheckDesignation = !event.target.checked
        data.check_status = 0
        this.setState({
            data: data
        })
    }
    handleApproveLevel = (event) => {
        let data = this.state.data;
        data.isApproveLevel = event.target.checked
        data.isApproveDesignation = !event.target.checked
        data.approve_status = 0
        this.setState({
            data: data
        })
    }
    handleVerifyLevel = (event) => {
        let data = this.state.data;
        data.isVerifyLevel = event.target.checked
        data.isVerifyDesignation = !event.target.checked
        data.verify_status = 0
        this.setState({
            data: data
        })
    }
    handleRequestDesignation = (event) => {
        let data = this.state.data;
        data.isRequestDesignation = event.target.checked
        data.isRequestLevel = !event.target.checked
        data.request_status = 1
        this.setState({
            data: data
        })
    }

    handleCheckDesignation = (event) => {
        let data = this.state.data;
        data.isCheckDesignation = event.target.checked
        data.isCheckLevel = !event.target.checked
        data.check_status = 1
        this.setState({
            data: data
        })
    }
    handleVerifyDesignation = (event) => {
        let data = this.state.data;
        data.isVerifyDesignation = event.target.checked
        data.isVerifyLevel = !event.target.checked
        data.verify_status = 1
        this.setState({
            data: data
        })
    }
    handleApproveDesignation = (event) => {
        let data = this.state.data;
        data.isApproveDesignation = event.target.checked
        data.isApproveLevel = !event.target.checked
        data.approve_status = 1
        this.setState({
            data: data
        })
    }
    handleSelectedDesignationRequestBy = (event) => {
        let data = this.state.data;
        data.request_by = event.value

        this.setState({ data: data })
    }
    handleSelectedLevelRequestBy = (event) => {
        let data = this.state.data;
        data.request_by = event.value

        this.setState({ data: data })
    }

    handleSelectedDesignationVerifyBy = (event) => {
        let data = this.state.data;
        data.verify_by = event.value

        this.setState({ data: data })
    }
    handleSelectedLevelVerifyBy = (event) => {
        let data = this.state.data;
        data.verify_by = event.value

        this.setState({ data: data })
    }
    handleSelectedDesignationCheckBy = (event) => {
        let data = this.state.data;
        data.check_by = event.value

        this.setState({ data: data })
    }
    handleSelectedLevelCheckBy = (event) => {
        let data = this.state.data;
        data.check_by = event.value

        this.setState({ data: data })
    }
    handleSelectedDesignationApproveBy = (event) => {
        let data = this.state.data;
        data.approve_by = event.value

        this.setState({ data: data })
    }
    handleSelectedLevelApproveBy = (event) => {
        let data = this.state.data;
        data.approve_by = event.value

        this.setState({ data: data })
    }

    check = () => {
        var data = this.state.data;
        data.updatedBy = this.state.updatedBy;

        let status = 0;
        fetch(main_url + 'workflow/editWorkFlow/' + data.workflow_id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(data => {
                status = data.status;
                return data.text();
            })
            .then(data => {

                this.props.showToast(status, data);
            })
    }

    getPermissionTypeName(id) {

        let type = this.state.permissionType;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];
                break;
            }
        }
        return result.label;
    }

    getPermissionTitleName(id) {

        let title = this.state.permissionTitle;
        let result = [];
        for (let i = 0; i < title.length; i++) {

            if (id === title[i].value) {

                result = title[i];
                break;
            }
        }
        return result.label;
    }
    getRequestName(id) {

        if (this.state.data.request_status === 0) {
            let title = this.state.level;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }
            return result;
        }
        else if (this.state.data.request_status === 1) {
            let title = this.state.designation;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }
            return result;

        }

    }
    getCheckByName(id) {

        if (this.state.data.check_status === 0) {
            let title = this.state.level;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }

            return result;
        }
        else if (this.state.data.check_status === 1) {
            let title = this.state.designation;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }

            return result;

        }

    }
    getVerifyName(id) {

        if (this.state.data.verify_status === 0) {
            let title = this.state.level;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }
            return result;
        }
        else if (this.state.data.verify_status === 1) {
            let title = this.state.designation;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }
            return result;

        }

    }
    getApproveName(id) {

        if (this.state.data.approve_status === 0) {
            let title = this.state.level;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }
            return result;
        }
        else if (this.state.data.approve_status === 1) {
            let title = this.state.designation;
            let result = [];
            for (let i = 0; i < title.length; i++) {

                if (id === title[i].value) {

                    result = title[i];
                    break;
                }
            }
            return result;

        }

    }
    render() {

        return (
            <div>

                <div className="wrapper wrapper-content" id="check_form">
                    <div className="form-horizontal" name="demo-form">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Type<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input type="text"
                                            value={this.state.selected_work_flow.label}
                                            className="form-control"
                                            disabled
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Permission Type<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            value={this.state.data.permission_type}
                                            className='form-control'
                                            disabled
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Permission Title<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.data.permission_title}
                                            className='form-control'
                                            disabled
                                        />

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="main-info">
                                <div className="header-info1 col-sm-12">
                                    <h4>Request</h4>
                                </div>
                                <div className="ibox-content ownpt">
                                    <div className="col-md-3" style={{ paddingTop: 20 }}>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="request"
                                                onChange={this.handleLevel.bind(this)}
                                                checked={this.state.data.request_status === 0 || this.state.data.request_status === false ? 'checked' : ''}
                                            />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="request"
                                                onChange={this.handleRequestDesignation.bind(this)}
                                                checked={this.state.data.request_status === 1 || this.state.data.request_status === true ? 'checked' : ''}
                                            />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.request_status === 1 ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.getRequestName(this.state.data.request_by)}
                                                    onChange={this.handleSelectedDesignationRequestBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.request_status === 0 ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.getRequestName(this.state.data.request_by)}
                                                        onChange={this.handleSelectedLevelRequestBy}
                                                        options={this.state.level}
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div className="pretty p-default p-curve">
                                                        <input type="checkbox" name="requestlevel"

                                                            onChange={(e) => {
                                                                let data = this.state.data;
                                                                data.request_condition = e.target.checked
                                                                this.setState({
                                                                    data: data
                                                                })
                                                            }
                                                            }

                                                            checked={this.state.data.request_condition === 1 || this.state.data.request_condition === true ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="main-info">
                                <div className="header-info1 col-sm-12">
                                    <h4>Checked</h4>
                                </div>
                                <div className="ibox-content ownpt">
                                    <div className="col-md-3" style={{ paddingTop: 20 }}>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="check"
                                                onChange={this.handleCheckLevel.bind(this)}
                                                checked={this.state.data.check_status === 0 || this.state.data.check_status === false ? 'checked' : ''}
                                            />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="check"
                                                onChange={this.handleCheckDesignation.bind(this)}
                                                checked={this.state.data.check_status === 1 || this.state.data.check_status === true ? 'checked' : ''}
                                            />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.check_status === 1 || this.state.check_status === true ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.getCheckByName(this.state.data.check_by)}
                                                    onChange={this.handleSelectedDesignationCheckBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.check_status === 0 || this.state.data.check_status === false ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.getCheckByName(this.state.data.check_by)}
                                                        onChange={this.handleSelectedLevelCheckBy}
                                                        options={this.state.level}
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div className="pretty p-default p-curve">
                                                        <input type="checkbox" name="requestlevel"
                                                            onChange={(e) => {
                                                                let data = this.state.data;
                                                                data.check_condition = e.target.checked
                                                                this.setState({
                                                                    data: data
                                                                })
                                                            }
                                                            }

                                                            checked={this.state.data.check_condition === true || this.state.data.check_condition === 1 ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="main-info">
                                <div className="header-info1 col-sm-12">
                                    <h4>Verified</h4>
                                </div>
                                <div className="ibox-content ownpt">
                                    <div className="col-md-3" style={{ paddingTop: 20 }}>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="verify"
                                                onChange={this.handleVerifyLevel.bind(this)}
                                                checked={this.state.data.verify_status === 0 || this.state.data.verify_status === false ? 'checked' : ''}
                                            />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="verify"
                                                onChange={this.handleVerifyDesignation.bind(this)}
                                                checked={this.state.data.verify_status === 1 || this.state.data.verify_status === true ? 'checked' : ''}
                                            />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.verify_status === 1 || this.state.verify_status === true ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.getVerifyName(this.state.data.verify_by)}
                                                    onChange={this.handleSelectedDesignationVerifyBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.verify_status === 0 || this.state.verify_status === false ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.getVerifyName(this.state.data.verify_by)}
                                                        onChange={this.handleSelectedLevelVerifyBy}
                                                        options={this.state.level}
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div className="pretty p-default p-curve">
                                                        <input type="checkbox" name="verifylevel"
                                                            onChange={(e) => {
                                                                let data = this.state.data;
                                                                data.verify_condition = e.target.checked
                                                                this.setState({
                                                                    data: data
                                                                })
                                                            }
                                                            }

                                                            checked={this.state.data.verify_condition === true || this.state.data.verify_condition === 1 ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="main-info">
                                <div className="header-info1 col-sm-12">
                                    <h4>Approved</h4>
                                </div>
                                <div className="ibox-content ownpt">
                                    <div className="col-md-3" style={{ paddingTop: 20 }}>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="approve"
                                                onChange={this.handleApproveLevel.bind(this)}
                                                checked={this.state.data.approve_status === 0 || this.state.data.approve_status === false ? 'checked' : ''}
                                            />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="approve"
                                                onChange={this.handleApproveDesignation.bind(this)}
                                                checked={this.state.data.approve_status === 1 || this.state.data.approve_status === true ? 'checked' : ''}
                                            />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.approve_status === 1 || this.state.approve_status === true ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.getApproveName(this.state.data.approve_by)}
                                                    onChange={this.handleSelectedDesignationApproveBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.approve_status === 0 || this.state.data.approve_status === false ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.getApproveName(this.state.data.approve_by)}
                                                        onChange={this.handleSelectedLevelApproveBy}
                                                        options={this.state.level}
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div className="pretty p-default p-curve">
                                                        <input type="checkbox" name="approvelevel"
                                                            onChange={(e) => {
                                                                let data = this.state.data;
                                                                data.approve_condition = e.target.checked
                                                                this.setState({
                                                                    data: data
                                                                })
                                                            }
                                                            }

                                                            checked={this.state.data.approve_condition === 1 || this.state.data.approve_condition === true ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="row mt20">
                            <div className="col-md-12 btn-rightend">

                                <button onClick={this.check.bind(this)} className="btn btn-primary"><span>Confirm</span> </button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}