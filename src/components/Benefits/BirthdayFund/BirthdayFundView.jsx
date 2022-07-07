import React, { Component } from 'react';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from "../../../utils/CommonFunction";
import moment from 'moment';

export default class BirthdayFund extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            status_info: [],
            desctription: '',
            birthdayList: [],
            //month: moment()
        }
    }

    componentDidMount() {
        this.getStatusInfo()
        this.getBirthdayFunList()
    }

    getStatusInfo() {
        fetch(`${main_url}birthday_benefit/getOneDetailInfo/${this.state.data.birthday_benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    getBirthdayFunList() {

        // console.log("BranchList>>>>",this.state.branch_id.value,this.state.month.format('M'))
        fetch(`${main_url}birthday_benefit/getBirthdayList/${moment(this.state.data.month).format('M')}/${this.state.data.branch_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    birthdayList: list
                })
            })
    }

    handleDescription = (event) => {
        let data = this.state.data;
        data.description = event.target.value;
        this.setState({
            data: data,
        });
    };

    render() {
        //console.log(">>>>>>>>>>>>>>>>>>",this.state.data.month.format('M'))
        return (
            <div className="benefits benefits-birthday-fund">
                <div className='row'>
                    <form className="form-group">
                        <div className="col-md-12">
                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12">Request By Branch/HO </label></div>
                                <div className="col-sm-10">
                                    <input type="text" disabled
                                        className="form-control"
                                        value={this.state.data.branch_name}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="month" className="col-sm-12">Please Enter The Month </label></div>
                                <div className="col-sm-10">
                                    <input type="text" disabled
                                        className="form-control"
                                        value={this.state.data.month} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Please Enter The Amount</label></div>
                                <div className="col-sm-10">
                                    <input type="text" disabled
                                        className="form-control"
                                        value={this.state.data.request_amount}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">

                            <div className="col-md-6">
                                <form
                                    className="form-group"
                                    id="check_form"
                                    style={{ marginBottom: 0 }}
                                >
                                    <label htmlFor="description" className="col-sm-12">
                                        Please Enter The Description
                                    </label>

                                    <div className="col-sm-10">
                                        <textarea
                                            name="description"
                                            id="description"
                                            cols="30"
                                            rows="6"
                                            value={this.state.data.description}
                                            className="form-control"
                                            onChange={this.handleDescription}
                                            disabled={true}
                                        ></textarea>
                                    </div>
                                </form>
                            </div>

                            <div className="funeral-detail col-md-6">
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Birthday List</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.birthdayList <= 0 ?
                                                <tr>
                                                    <td colSpan="7" className="text-center">No Data To Show</td>
                                                </tr> :

                                                this.state.birthdayList.map((data, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{data.fullname}</td>
                                                        </tr>
                                                    );
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>
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