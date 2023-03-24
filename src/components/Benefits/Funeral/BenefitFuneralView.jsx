import React, { Component } from 'react';
import DocumentList from '../../Common/DocumentList';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from '../../../utils/CommonFunction';

class FuneralBenefitView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datasource: props.data.data[0],
            detail: props.data.detail,
            doc: props.data.doc,
            status_info: [],
            document: []
        }
    }

    getAvailableAmount() {
        fetch(`${main_url}funeral_benefit/getFuneralAvailableAmount`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    available_amount: list.amount
                })
            })
    }

    componentDidMount() {
        this.getStatusInfo();
        this.getAvailableAmount();
    }

    getStatusInfo() {
        fetch(`${main_url}funeral_benefit/getOneDetailInfo/${this.state.datasource.funeral_benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    getTotalAmount(amount) {
        let arr = this.state.detail;

        let tot = 0;
        for (let i = 0; i < arr.length; i++) {
            tot += amount/arr[i].headNo;
        }
        return tot;
    }

    render() {

        return (
            <div className="benefits benefit-funeral-add-new">
                <div className='row'>
                    <div className="form-group">

                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input disabled type='text' className='form-control'
                                        value={this.state.datasource.fullname}
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

                        <div className="row">
                            {/* <div className="ownspacing"></div> */}
                            <div className="col-md-10 funeral-detail" >
                                <h4>Benefit Funeral Person</h4>
                            </div>
                            <div className="col-md-10 funeral-detail" >
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Person Type</th>

                                            <th>Head No</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.detail.length <= 0 ?

                                                (<td colSpan="3" class="text-center">No data</td>) :
                                                (this.state.detail.map((data, index) => {
                                                    return (


                                                        <tr key={index}>
                                                            <td>{data.selected_personName}</td>

                                                            <td>{data.headNo}</td>

                                                        </tr>
                                                    )
                                                }
                                                ))

                                        }
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div><label className="col-sm-12">Available Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.getTotalAmount(this.state.datasource.total_amount)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label className="col-sm-12">Total Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.datasource.total_amount}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row document-main">
                        {
                            this.state.doc.length > 0 ?
                                <DocumentList title='Funeral Benefit Document' doc={this.state.doc} path='funeral_benefit' />
                                : ''
                        }
                    </div>
                    {
                        !Array.isArray(this.state.status_info) ?

                            <div className="row approval-main margin-top-20">
                                <ApprovalInformation status={this.state.status_info} />
                            </div>
                            : ''
                    }
                </div>
            </div>
        )
    }
}
export default FuneralBenefitView;