import React, { Component } from 'react';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from '../../../utils/CommonFunction';

export default class PetrolRequestByEmployeeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            status_info: []
        };
    }

    componentDidMount() {
        this.getStatusInfo();
    }

    getStatusInfo() {
        fetch(`${main_url}petrol_employee/getOneDetailInfoForEmployee/${this.state.data.petrol_employee_id}`)
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
            <div>
                <div className="container">
                    <div className="row">

                        <div className="form-horizontal" name="demo-form">

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="request-month">Request Month</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="request-month"
                                            value={this.state.data.request_month} className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="vehicle-number">Vehicle Number</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="vehicle-number"
                                            value={this.state.data.vehicle_number}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="opening-kilo-of-vehicle">Opening Kilo of Vehicle</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="opening-kilo-of-vehicle"
                                            value={this.state.data.opening_kilo}
                                            className="form-control"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="closing-kilo-of-vehicle">Closing Kilo of Vehicle</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="closing-kilo-of-vehicle"
                                            value={this.state.data.closing_kilo} className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="total-kilo">Total Kilo During The Period</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="total-kilo" value={this.state.data.total_kilo}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="deduction-kilo">Deduction Kilo of Personal Usage</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="deduction-kilo"
                                            value={this.state.data.deduction_kilo}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="net-kilo">Net Kilo Charged To Alliance</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="net-kilo" value={this.state.data.net_kilo}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="total-mile">Total Mile</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="total-mile" value={this.state.data.total_mile}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="col-sm-12" htmlFor="net-claim-amount">Net Claim Amount</label>
                                    <div className="col-sm-10">
                                        <input disabled type="text" id="net-claim-amount"
                                            value={this.state.data.net_claim_amount}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

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