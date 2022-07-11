import React, { Component } from 'react';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from '../../../utils/CommonFunction';
import DocumentList from '../../Common/DocumentList';

class WeddingBenefitView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datasource: this.props.data,
            status_info: [],
            document: []
        }
    }

    componentDidMount() {
        this.getStatusInfo();
        this.getDocument();
    }

    getStatusInfo() {
        fetch(`${main_url}wedding_benefit/getOneDetailInfo/${this.state.datasource.benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    getDocument() {
        fetch(`${main_url}wedding_benefit/getDocument/${this.state.datasource.benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    document: res
                })
            })
            .catch(error => console.log(error))
    }

    render() {
        console.log(this.state.datasource)
        return (
            <div className="container">
                <div className='row'>
                    <form>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input type='text' disabled className='form-control' value={this.state.datasource.employee_name} />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="designation" className="col-sm-12" >Designation</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.datasource.designations}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12" >Is Your Spouse An Alliance Staff
                                ?</label></div>
                                <div className="col-sm-10">
                                    <input type='text' disabled value={this.state.datasource.is_alliance_staff === 1 ? 'Yes' : 'No'} className='form-control' />

                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="spouse-name" className="col-sm-12" >Spouse Name</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={this.state.datasource.staff_spouse_name}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="available_amount" className="col-sm-12" >Available Amount </label></div>
                                <div className="col-sm-10">
                                    <input type='number' disabled value={this.state.datasource.available_amount} className='form-control' />

                                </div>
                            </div>
                        </div>
                        <div className="row document-main">
                            {
                                this.state.document.length > 0 ?
                                    <DocumentList title='Wedding Benefit Document' doc={this.state.document} path='wedding_benefit' />
                                    : 'hey'
                            }
                        </div>
                        {
                            !Array.isArray(this.state.status_info) ?

                                <div className="row approval-main margin-top-20">
                                    <ApprovalInformation status={this.state.status_info} />
                                </div>
                                : ''
                        }

                    </form>

                </div>

            </div>
        )
    }
}

export default WeddingBenefitView;