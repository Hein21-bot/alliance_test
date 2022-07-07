import React, { Component } from 'react'
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from "../../../utils/CommonFunction";
import DocumentList from '../../Common/DocumentList';
import moment from 'moment';

class BenefitExternalTrainingView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            status_info: [],
            doc: []
        }
    }
    componentDidMount() {
        this.getStatusInfo();
        this.getAvailableAmount();
        fetch(`${main_url}external_benefit/getDocument/` + this.props.data.external_training_id)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {

                this.setState({
                    doc: list
                })

            })
    }

    getAvailableAmount() {
        fetch(`${main_url}external_benefit/getExternalAvailableAmount/${this.state.data.user_id}/${moment().format('YYYY')}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    available_amount: list.amount
                })
            })
    }

    getStatusInfo() {
        fetch(`${main_url}external_benefit/getOneDetailInfo/${this.state.data.external_training_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div className="benefits benefit-external-training">
                <div className='row'>
                    <form className="form-group">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.data.fullname}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12">Please Enter The Training Type ? </label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.data.training_name} />
                                </div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-6">
                                <div><label htmlFor="date-of-training" className="col-sm-12">Please Enter The Date of Training ? </label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.data.training_date} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="available-amount" className="col-sm-12">Available Amount </label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.available_amount} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-period" className="col-sm-12">Please Enter The Training Period ? </label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.data.training_period} />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Please Enter The Request Amount ? </label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.data.request_amount} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-purpose" className="col-sm-12">Please Enter The Training Purpose ? </label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control' value={this.state.data.training_purpose} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="training-purpose" className="col-sm-12">Please Enter The Approve Amount ? </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        placeholder="Enter The Approve Amount"
                                        // onChange={this.handleApproveAmount}
                                        value={this.state.data.approve_amount}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row document-main">
                            {
                                this.state.doc.length > 0 ?
                                    <DocumentList title='External Training Document' doc={this.state.doc} path='external_benefit' />
                                    : ''
                            }
                        </div>
                    </form>
                </div>
                <div className="row approval-main">
                    {
                        !Array.isArray(this.state.status_info) ?

                            <div className="margin-top-20">
                                <ApprovalInformation status={this.state.status_info} />
                            </div>
                            : ''
                    }
                </div>
            </div>
        )
    }
}
export default BenefitExternalTrainingView