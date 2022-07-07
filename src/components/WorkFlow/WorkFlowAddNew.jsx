import React, { Component } from 'react'
import Select from 'react-select';
import { main_url, validate, getUserId, getDesignation, getLevel } from '../../utils/CommonFunction';

var form_validate = true;
const workflow_type = [{ label: 'Work Flow', value: 1 }, { label: 'Work Flow Wiht Branch', value: 2 }]
export default class WorkFlowAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            designation: [],
            permissionType: [],
            permissionTitle: [],
            level: [],
            selectedPermissionTitle: [],
            selectedPermissionType: [],
            selectedRequest: [],
            selectedCheck: [],
            selectedVerify: [],
            selectedApprove: [],
            selected_work_flow: workflow_type[this.props.type - 1],
            data: {
                createdBy: getUserId("user_info"),
                permission_title_id: '',
                permission_type_id: '',
                request_status: 0,
                request_by: '',
                request_condition: '',
                check_status: 0,
                check_by: '',
                check_condition: '',
                verify_status: 0,
                verify_by: '',
                verify_condition: '',
                approve_status: 0,
                approve_by: '',
                approve_condition: ''
            }
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {

        this.getPermissionType();
        let designation = await getDesignation();
        let level = await getLevel();
        this.setState({
            designation: designation,
            level: level
        })

    }

    getPermissionType() {

        fetch(main_url + "permission/getPermissionTypeByActive")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this.setState({ permissionType: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }
    getPermissionTitle(id) {

        fetch(main_url + "permission/getPermissionTitleByPermissionType/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {
                    this.setState({ permissionTitle: res })
                }
                else {

                    this.setState({ permissionTitle: [] })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    handleSelectedWorkFlow = (event) => {
        this.setState({
            selected_work_flow: event
        })
    }

    handleSelectedPermissionTitle = (event) => {
        let data = this.state.data;
        data.permission_title_id = event.value;
        this.setState({
            data: data,
            selectedPermissionTitle: event
        })
    }
    handleSelectedPermissionType = (event) => {
        let data = this.state.data;
        data.permission_type_id = event.value;
        this.setState({
            data: data,
            selectedPermissionType: event
        }, () => this.getPermissionTitle(event.value))
    }
    handleLevel = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.request_status = 0;
        }
        this.setState({
            data: data
        })
    }
    handleCheckLevel = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.check_status = 0;
        }
        this.setState({
            data: data
        })
    }
    handleApproveLevel = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.approve_status = 0;
        }
        this.setState({
            data: data
        })
    }
    handleVerifyLevel = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.verify_status = 0;
        }
        this.setState({
            data: data
        })
    }
    handleRequestDesignation = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.request_status = 1;
        }
        this.setState({
            data: data
        })
    }

    handleCheckDesignation = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.check_status = 1;
        }
        this.setState({
            data: data
        })
    }
    handleVerifyDesignation = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.verify_status = 1;
        }
        this.setState({
            data: data
        })
    }
    handleApproveDesignation = (event) => {
        let data = this.state.data;
        if (event.target.checked) {
            data.approve_status = 1;
        }
        this.setState({
            data: data
        })
    }
    handleRequestBy = (event) => {
        let data = this.state.data;
        data.request_by = event.value;

        this.setState({ data: data, selectedRequest: event })
    }
    // handleSelectedLevelRequestBy = (event) => {
    //     let data = this.state.data;
    //     data.request_by = event

    //     this.setState({ data: data, sele: event })
    // }

    handleVerifyBy = (event) => {
        let data = this.state.data;
        data.verify_by = event.value;
        this.setState({ data: data, selectedVerify: event })
    }

    handleCheckBy = (event) => {
        let data = this.state.data;
        data.check_by = event.value;

        this.setState({ data: data, selectedCheck: event })
    }

    handleApproveBy = (event) => {
        let data = this.state.data;
        data.approve_by = event.value;

        this.setState({ data: data, selectedApprove: event })
    }

    check = () => {
        if (validate('check_form')) {
            let status = 0;
            fetch(main_url + 'workflow/addWorkFlow', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `info=${JSON.stringify(this.state.data)}`

            })
                .then(data => {
                    status = data.status;
                    return data.text();
                })
                .then(data => {

                    this.props.showToast(status, data);
                })
        }
        else form_validate = false;
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
                                        <Select
                                            placeholder="Choose Permission Type"
                                            value={this.state.selected_work_flow}
                                            onChange={this.props.changeWorkFlow}
                                            options={workflow_type}
                                            className='react-select-container checkValidate'
                                            classNamePrefix="react-select"
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Permission Type<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <Select
                                            placeholder="Choose Permission Type"
                                            value={this.state.data.selectedPermissionType}
                                            onChange={this.handleSelectedPermissionType}
                                            options={this.state.permissionType}
                                            className='react-select-container checkValidate'
                                            classNamePrefix="react-select"
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Permission Title<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <Select
                                            placeholder="Choose Permission Title"
                                            value={this.state.data.selectedPermissionTitle}
                                            onChange={this.handleSelectedPermissionTitle}
                                            options={this.state.permissionTitle}
                                            className='react-select-container checkValidate'
                                            classNamePrefix="react-select"
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
                                                checked={this.state.data.request_status === 0 ? 'checked' : ''} />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="request"
                                                onChange={this.handleRequestDesignation.bind(this)}
                                                checked={this.state.data.request_status === 1 ? 'checked' : ''} />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.request_status === 1 ?
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.state.selectedRequest}
                                                    onChange={this.handleRequestBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                            :
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.state.selectedRequest}
                                                        onChange={this.handleRequestBy}
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

                                                        // checked={this.state.data.isRequestLevel === true ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                                checked={this.state.data.check_status === 0 ? 'checked' : ''}
                                            />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="check"
                                                onChange={this.handleCheckDesignation.bind(this)}
                                                checked={this.state.data.check_status === 1 ? 'checked' : ''} />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        this.state.data.check_status === 1 ?
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.state.selectedCheck}
                                                    onChange={this.handleCheckBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                            :
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.state.selectedCheck}
                                                        onChange={this.handleCheckBy}
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

                                                        // checked={this.state.data.isRequestLevel === true ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

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
                                                checked={this.state.data.verify_status === 0 ? 'checked' : ''} />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="verify"
                                                onChange={this.handleVerifyDesignation.bind(this)}
                                                checked={this.state.data.verify_status === 1 ? 'checked' : ''} />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.verify_status === 1 ?
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.state.selectedVerify}
                                                    onChange={this.handleVerifyBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                            :
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.state.selectedVerify}
                                                        onChange={this.handleVerifyBy}
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

                                                        // checked={this.state.data.isRequestLevel === true ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                                checked={this.state.data.approve_status === 0 ? 'checked' : ''} />
                                            <div className="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div className="pretty p-default p-curve">
                                            <input type="radio" name="approve"
                                                onChange={this.handleApproveDesignation.bind(this)}
                                                checked={this.state.data.approve_status === 1 ? 'checked' : ''} />
                                            <div className="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.approve_status === 1 ?
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <Select
                                                    placeholder="Choose Designation"
                                                    value={this.state.selectedApprove}
                                                    onChange={this.handleApproveBy}
                                                    options={this.state.designation}
                                                />
                                            </div>

                                            :
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <Select
                                                        placeholder="Choose Level"
                                                        value={this.state.selectedApprove}
                                                        onChange={this.handleApproveBy}
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

                                                        // checked={this.state.data.isRequestLevel === true ? 'checked' : ''}
                                                        />
                                                        <div className="state p-success-o">
                                                            <label>Above Level</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="row mt20">
                            <div className="col-md-12 btn-rightend" >

                                <button onClick={this.check.bind(this)} className="btn btn-primary"><span>Confirm</span> </button>
                            </div>
                        </div>
                    </div>


                </div >
            </div >
        )
    }
}