import React, { Component } from 'react'
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from "../../../utils/CommonFunction";
import DocumentList from '../../Common/DocumentList';

class BenefitChildView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datasource: props.data,
            status_info: [],
            available_amount: 0,
            doc: []
        }
    }
    componentDidMount() {
        this.getStatusInfo();
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

    getStatusInfo() {
        fetch(`${main_url}child_benefit/getOneDetailInfo/${this.state.datasource.child_benefit_id}`)
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
            <div className="benefits benefit-child-add-new">
                <div className='row'>
                    <form className="form-group">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input type='text ' disabled className='form-control' value={this.state.datasource.fullname} />

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
                        <div className="row">
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
                                        disabled
                                        className='form-control'
                                        value={this.state.datasource.child_count}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
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

                        <div className="row document-main">
                            {
                                this.state.doc.length > 0 ?
                                    <DocumentList title='Child Benefit Document' doc={this.state.doc} path='child_benefit' />
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

                {/* <div className="row save-btn">
                <div className="float-right">
                    <div>
                        <button className="btn btn-info" type="button" onClick={this.save.bind(this)}>Save</button>
                    </div>

                </div>
            </div> */}

            </div>
        )
    }
}

export default BenefitChildView;