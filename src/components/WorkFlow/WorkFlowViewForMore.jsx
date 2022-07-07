import React, { Component } from 'react'
const workflow_type = [{ label: 'Work Flow', value: 1 }, { label: 'Work Flow Wiht Branch', value: 2 }]

export default class WorkFlowAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.data[0],
            request: props.data.request[0],
            approve: props.data.approve[0],
            check: props.data.check[0],
            selected_work_flow: workflow_type[this.props.type - 1],
            verify: props.data.verify[0]
        }
    }

    render() {
        return (
            <div>

                <div className="wrapper wrapper-content animated fadeInRight" id="check_form">

                    <div className="form-horizontal" name="demo-form">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Type<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input type="text"
                                            placeholder="Choose Permission Type"
                                            value={this.state.selected_work_flow.label}
                                            className='form-control'
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Permission Type<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input
                                            placeholder="Choose Permission Type"
                                            value={this.state.data.permission_type}
                                            className='form-control'
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Permission Title<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input
                                            placeholder="Choose Permission Title"
                                            value={this.state.data.permission_title}
                                            className='form-control'
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div className="col-md-12"><label>Branch</label></div>
                                    <div className="col-md-10">
                                        <input type="text"
                                            value={this.state.data.branch_name}
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div className="col-md-12"><label>Department</label></div>
                                    <div className="col-md-10">
                                        <input type="text"
                                            value={this.state.data.deptname}
                                            className='form-control'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3" style={{ paddingTop: 20 }}>
                                <div className="form-group">
                                    <div className="pretty p-default p-curve">
                                        <input type="checkbox" name="limitAmount"
                                            checked={this.state.data.over_limit_amount === 1 ? "checked" : ""}
                                        />
                                        <div className="state p-success-o">
                                            <label>Above Limit Amount</label>
                                        </div>
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
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="request"

                                                checked={this.state.data.request_status === 0 ? 'checked' : ''}
                                            />
                                            <div class="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="request"

                                                checked={this.state.data.request_status === 1 ? 'checked' : ''}
                                            />
                                            <div class="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.request_status === 1 ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <input
                                                    placeholder="Choose Designation"
                                                    value={this.state.request.designations}
                                                    className="form-control"
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.request_status === 0 ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <input
                                                        placeholder="Choose Level"
                                                        value={this.state.request.career_level}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div class="pretty p-default p-curve">
                                                        <input type="checkbox" name="requestlevel"

                                                            checked={this.state.data.request_condition === 1 ? 'checked' : ''}
                                                        />
                                                        <div class="state p-success-o">
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
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="check"

                                                checked={this.state.data.check_status === 0 ? 'checked' : ''}
                                            />
                                            <div class="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="check"

                                                checked={this.state.data.check_status === 1 ? 'checked' : ''}
                                            />
                                            <div class="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.check_status === 1 ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <input
                                                    placeholder="Choose Designation"
                                                    value={this.state.check.designations}
                                                    className="form-control"
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.check_status === 0 ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <input
                                                        className="form-control"
                                                        value={this.state.check.career_level}

                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div class="pretty p-default p-curve">
                                                        <input type="checkbox" name="requestlevel"

                                                            checked={this.state.data.check_condition === 1 ? 'checked' : ''}
                                                        />
                                                        <div class="state p-success-o">
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
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="verify"

                                                checked={this.state.data.verify_status === 0 ? 'checked' : ''}
                                            />
                                            <div class="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="verify"

                                                checked={this.state.data.verify_status === 1 ? 'checked' : ''}
                                            />
                                            <div class="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.verify_status === 1 ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <input
                                                    placeholder="Choose Designation"
                                                    value={this.state.verify.designations}
                                                    className="form-control"
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.verify_status === 0 ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <input
                                                        placeholder="Choose Level"
                                                        value={this.state.verify.career_level}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div class="pretty p-default p-curve">
                                                        <input type="checkbox" name="verifylevel"

                                                            checked={this.state.data.verify_condition === 1 ? 'checked' : ''}
                                                        />
                                                        <div class="state p-success-o">
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
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="approve"

                                                checked={this.state.data.approve_status === 0 ? 'checked' : ''}
                                            />
                                            <div class="state p-success-o">
                                                <label>Is Level</label>
                                            </div>
                                        </div>
                                        <div class="pretty p-default p-curve">
                                            <input type="radio" name="approve"

                                                checked={this.state.data.approve_status === 1 ? 'checked' : ''}
                                            />
                                            <div class="state p-warning-o">
                                                <label>Is Designation</label>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        this.state.data.approve_status === 1 ? (
                                            <div className="col-md-4" style={{ marginTop: 14 }}>
                                                <input
                                                    placeholder="Choose Designation"
                                                    value={this.state.approve.designations}
                                                    className="form-control"
                                                />
                                            </div>

                                        ) :
                                            (<span></span>)
                                    }
                                    {
                                        this.state.data.approve_status === 0 ? (
                                            <div>
                                                <div className="col-md-4" style={{ marginTop: 14 }}>
                                                    <input
                                                        placeholder="Choose Level"
                                                        value={this.state.approve.career_level}
                                                        className="form-control"
                                                    />
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: 20 }}>
                                                    <div class="pretty p-default p-curve">
                                                        <input type="checkbox" name="approvelevel"

                                                            checked={this.state.data.approve_condition === 1 ? 'checked' : ''}
                                                        />
                                                        <div class="state p-success-o">
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

                    </div>


                </div >


            </div >
        )
    }
}