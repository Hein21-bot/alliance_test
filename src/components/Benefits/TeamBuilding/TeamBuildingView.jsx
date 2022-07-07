import React, { Component } from 'react';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from '../../../utils/CommonFunction';

class TeamBuildingView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datasource: this.props.data,
            document: [],
            employee_list: [],
            status_info: []
        }
    }

    componentDidMount() {
        this.getTeamBuildingDetail(this.state.datasource.benefit_id);
        this.getStatusInfo();
    }

    getTeamBuildingDetail(id) {
        fetch(`${main_url}team_building/getTeamBuildingDetail/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
            })
    }

    getStatusInfo() {
        fetch(`${main_url}team_building/getOneDetailInfo/${this.state.datasource.benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    render() {
        this.total_amount = 0;
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12"> Location Name</label></div>
                                <div className="col-sm-10">

                                    <input type="text" className="form-control input-md"
                                        value={this.state.datasource.branch_name} disabled />


                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="designation" className="col-sm-12"> Quater</label></div>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control input-md"
                                        value={this.state.datasource.name} disabled />


                                    {/* <input
                                        type="text"
                                        // placeholder="Please Provide The Designation"
                                        className="form-control"
                                        value={this.state.user_info.designations}
                                        disabled
                                    /> */}
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Total Amount</label></div>
                                <div className="col-sm-10">

                                    <input type="number" className="form-control input-md" value={this.state.total_amount} disabled />

                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="funeral-detail col-md-11">
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.employee_list.length <= 0 ?
                                                <tr>
                                                    <td colSpan="7" className="text-center">No Data To Show</td>
                                                </tr> :

                                                this.state.employee_list.map((data, index) => {
                                                    this.total_amount += Number(data.amount)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{data.fullname}</td>
                                                            <td>
                                                                {data.amount}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        }
                                        <tr>
                                            <td>Total Amount</td>
                                            <td>
                                                {this.total_amount}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <input type="number" className="hidden" id="total_amount" value={this.total_amount} />
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

export default TeamBuildingView;