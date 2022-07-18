import React, { Component } from 'react';
import Select from 'react-select';
import CustomFileInput from '../CustomFileInput';
import DocumentList from '../../Common/DocumentList';
import ApprovalInformation from '../../Common/ApprovalInformation';
import '../../Benefits/Benefits.css';
import { main_url, getUserId, getBranch } from "../../../utils/CommonFunction";

class BenefitOtherView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
            doc: [],
            status_info: [],
            selected_location: [],
            withdraw_location: 0,
        }
    }

    async componentDidMount() {
        this.getStatusInfo()
        fetch(`${main_url}benefit/getDocument/` + this.props.data.other_benefit_id)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {

                this.setState({
                    doc: list
                })
            })
        let branch = await getBranch();
        let selected_location = this.getSelectedLocation(branch, this.props.data.withdraw_location);
        this.setState({
            branch: branch,
            selected_location: selected_location
        })
    }

    getSelectedLocation(branch, location) {
        let selected = branch.filter(function (b) { return b.value == location })
        return selected;
    }

    getStatusInfo() {
        fetch(`${main_url}benefit/getOneDetailInfo/${this.state.data.other_benefit_id}`)
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
            <div className="benefits benefits-other">
                <div className='row'>
                    <form className="form-group">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        value={this.state.data.fullname}
                                        placeholder="Please Choose The Employee Name"
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        value={this.state.data.amount}
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12"> Description</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={this.state.data.description}
                                        cols="20"
                                        rows="5"
                                        placeholder="Please Give The Description"
                                        className="form-control"
                                        disabled
                                    >

                                    </textarea>
                                </div>
                            </div>
                            <div className="col-md-6 form-group">
                                <div><label className="col-sm-12" >WithDraw Location<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        data-name='withdraw_loction'
                                        value={this.state.selected_location}
                                        isDisabled={true}
                                        // onChange={this.changeWithdrawLocation}
                                        // options={this.state.branch}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="row document-main">
                            {
                                this.state.doc.length > 0 ?
                                    <DocumentList title='Other Benefit Document' doc={this.state.doc} path='other_benefit' />
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

export default BenefitOtherView;