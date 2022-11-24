import { relativeTimeThreshold } from 'moment';
import React, { Component } from 'react';
import Rodal from 'rodal';
import { checkAmount, checkLimitAmount } from '../../utils/CommonFunction';

export default class ApprovalForm1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            refer_visible: false,
            comment: ''
        }
    }


    haveAllPermission(permission) {
        let count = 0;

        if (permission.check_by === 1) count++;
        if (permission.verify_by === 1) count++;
        if (permission.approve_by === 1) count++;
        if (count > 1) return true;
        else return false;
    }

    showModal() {
        this.setState({ visible: true });
    }
    show_Refer_Modal() {
        this.setState({ refer_visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    hide_refer() {
        this.setState({ refer_visible: false });
    }

    checkRejectState() {
        let status = this.props.status;
        let permission = this.props.work_flow;
        if (permission.check_by > 0 && status === 0) return false;
        else if (permission.verify_by > 0 && status == 1) return false;
        else if (permission.approve_by > 0 && status == 2) return false;
        else if (status === 5) return true;
        else return true;
    }

    checkCEO() {
        let check = checkAmount(this.props.total_amount);
        return check;
    }

    checkLimitAmount() {
        let check = checkLimitAmount(this.props.total_amount);
        return check;
    }

    render() {
        const permission = this.props.work_flow;
        return (

            <div>
                {
                    this.checkCEO() ?
                        <div className="float-right m-b-10" >
                            <button className="btn btn_approved" onClick={() => this.props.approvalStatus('approved', this.state.comment)} >
                                <i className="fa fa-check"></i> Approve </button>
                            < button className="btn btn_reject"
                                disabled={this.checkRejectState()}
                                onClick={this.showModal.bind(this)} > <i className="fa fa-times"></i> Reject </button >

                        </div > :
                        this.haveAllPermission(permission) ?
                            <div className="float-right m-b-10" >
                                {permission.check_by > 0 || permission.verify_by > 0 || permission.approve_by > 0 ?
                                    <button className="btn btn-primary m-r-10" onClick={this.show_Refer_Modal.bind(this)} disabled={this.props.status === 3 || this.props.status === 4 || this.props.status === 5 ? true : false}>
                                        <i className="fa fa-check"></i> ReferBack </button> : ''}
                                {permission.check_by > 0 ?
                                    <button className="btn btn-primary m-r-10" onClick={() => this.props.approvalStatus('checked', this.state.comment)} disabled={this.props.status === 0 || this.props.status == null ? false : this.props.status === 5 ? true : true}>
                                        <i className="fa fa-check"></i> Check </button> : ''}
                                {permission.verify_by > 0 ?
                                    <button className="btn btn_verified" onClick={() => this.props.approvalStatus('verified', this.state.comment)} disabled={this.props.status === 1 ? false : this.props.status === 5 ? true : true}>
                                        <i className="fa fa-check"></i> Verify </button> : ''}
                                {permission.approve_by > 0 ?
                                    <button className="btn btn_approved" onClick={() => this.props.approvalStatus('approved', this.state.comment)} disabled={this.props.status === 2 ? false : this.props.status === 5 ? true : true}>
                                        <i className="fa fa-check"></i> Approve </button>
                                    : ''}
                                < button className="btn btn_reject"
                                    disabled={this.checkRejectState()}
                                    onClick={this.showModal.bind(this)} > <i className="fa fa-times"></i> Reject </button >

                            </div >
                            :
                            <div className="float-right m-b-10 row" >
                                <button className="btn btn-primary m-r-10" onClick={this.show_Refer_Modal.bind(this)} disabled={this.props.status === 3 || this.props.status === 4 || this.props.status === 5 ? true : permission.check_by > 0 && this.props.status !== 0 ? true : permission.verify_by > 0 && this.props.status !== 1 ? true : permission.approve_by > 0 && this.props.status !== 2 ? true : false}>
                                    <i className="fa fa-check"></i> ReferBack </button>
                                {
                                    // permission.check_by > 0 || permission.verify_by > 0 || permission.approve_by > 0 ?
                                    //     <button className="btn btn-primary m-r-10" onClick={() => this.props.approvalStatus('referback', this.state.comment)} disabled={this.props.status === 3 || this.props.status === 4 ? true : false}>
                                    //         <i className="fa fa-check"></i> ReferBack </button>

                                    // :
                                    permission.check_by > 0 ?

                                        <button className="btn btn-primary m-r-10" onClick={() => this.props.approvalStatus('checked', this.state.comment)} disabled={this.props.status === 0 || this.props.status == null ? false : this.props.status === 5 ? true : true}>
                                            <i className="fa fa-check"></i> Check </button>

                                        : permission.verify_by > 0 ?
                                            <button className="btn btn_verified" onClick={() => this.props.approvalStatus('verified', this.state.comment)} disabled={this.props.status === 1 ? false : this.props.status === 5 ? true : true}>
                                                <i className="fa fa-check"></i> Verify </button>
                                            : permission.approve_by > 0 ?
                                                <button className="btn btn_approved" onClick={() => this.props.approvalStatus('approved', this.state.comment)} disabled={this.props.status === 2  ? false : this.props.status === 5 ? true : true}>
                                                    <i className="fa fa-check"></i> Approve </button>
                                                : ''}
                                < button className="btn btn_reject"
                                    disabled={this.checkRejectState()}
                                    onClick={this.showModal.bind(this)}
                                //  onClick={() => this.props.approvalStatus('rejected')}
                                > <i className="fa fa-times"></i> Reject </button >
                            </div >
                }
                <Rodal width={500} height={150} visible={this.state.visible} onClose={this.hide.bind(this)} >
                    <div className="col-md-12 "><h4>Reject Comment  </h4>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>
                        <div className="col-md-3">Comment </div>
                        <div className="col-md-7">
                            <input type="text" className="full_width" onChange={(e) => this.setState({ rejected_comment: e.target.value })}></input>
                        </div>
                        <div className="col-md-2 btn-rightend" >

                            <button className="btn btn-primary" onClick={() => this.props.approvalStatus('rejected', this.state.rejected_comment)}><span>Submit</span> </button>

                        </div>
                    </div>
                </Rodal>
                <Rodal width={500} height={150} visible={this.state.refer_visible} onClose={this.hide_refer.bind(this)} >
                    <div className="col-md-12 "><h4>ReferBack Comment  </h4>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>
                        <div className="col-md-3">Comment </div>
                        <div className="col-md-7">
                            <input type="text" className="full_width" onChange={(e) => this.setState({ referback_comment: e.target.value })}></input>
                        </div>
                        <div className="col-md-2 btn-rightend" >

                            <button className="btn btn-primary" onClick={() => this.props.approvalStatus('referback', this.state.referback_comment)}><span>Submit</span> </button>

                        </div>
                    </div>
                </Rodal>
            </div>
        )
    }
}