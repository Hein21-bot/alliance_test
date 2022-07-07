import React, { Component } from 'react';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from '../../../utils/CommonFunction';

export default class PetrolRequestByBmView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            status_info: [],
            co_detail: [],
            fx_detail: []
        }
    }

    componentDidMount() {
        this.getStatusInfo();
        this.getDetailInfo(this.state.data.petrol_bm_id);
    }

    getDetailInfo(id) {
        fetch(main_url + "allowance/getCOAndFXInfo/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ co_detail: res.co_detail, fx_detail: res.fx_detail })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getStatusInfo() {
        fetch(`${main_url}petrol_bm/getOneDetailInfoForBM/${this.state.data.petrol_bm_id}`)
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
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label htmlFor="client-officer-name" className="col-sm-12">Form No</label></div>
                                    <div className="col-sm-10">

                                        <input
                                            disabled
                                            className='form-control'
                                            value={this.state.data.form_no}
                                        />

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label htmlFor="fx-name" className="col-sm-12">Date</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            disabled
                                            className='form-control'
                                            value={this.state.data.selected_date}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row margin-top-20">
                        <div className="result-area col-md-12">
                            <table className="table table-bordered table-responsive">
                                <thead>
                                    <tr>
                                        <th>Client Officer Name</th>
                                        <th>Product</th>
                                        <th>FX</th>
                                        <th>Furthest Location</th>
                                        <th>Distance to Furthest Location</th>
                                        <th>Kilo</th>
                                        <th>Petrol Charges</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.co_detail.length <= 0 ?
                                            <tr>
                                                <td colSpan="7" className="text-center">No Data To Show</td>
                                            </tr> :

                                            this.state.co_detail.map((data, index) =>
                                                <tr key={index}>
                                                    <td>{data.client_officer_name}</td>
                                                    <td>{data.product}</td>
                                                    <td>{data.fx_name}</td>
                                                    <td>{data.further_location}</td>
                                                    <td>{data.distance_location}</td>
                                                    <td>{data.kilo}</td>
                                                    <td>{data.petrol_charges}</td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row margin-top-20">
                        <div className="result-area col-md-12">
                            <table className="table table-bordered table-responsive">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Employee Code</th>
                                        <th>FX</th>
                                        <th>No. of COs</th>
                                        <th>Petrol Charges</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                        this.state.fx_detail.length <= 0 ?
                                            <tr>
                                                <td colSpan="7" className="text-center">No Data To Show</td>
                                            </tr> :

                                            this.state.fx_detail.map((data, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1} </td>
                                                    <td>{data.employee_code}</td>
                                                    <td>{data.fx_name}</td>
                                                    <td>{data.no_of_co}</td>
                                                    <td>{data.petrol_charges}</td>
                                                </tr>

                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {
                        !Array.isArray(this.state.status_info) ?

                            <div className="row approval-main">
                                <ApprovalInformation status={this.state.status_info} />
                            </div>
                            : ''
                    }

                </div>
            </div>
        )
    }


}