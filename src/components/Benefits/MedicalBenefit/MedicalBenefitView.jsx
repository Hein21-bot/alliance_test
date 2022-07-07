import React, { Component } from 'react'
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from "../../../utils/CommonFunction";
import DocumentList from '../../Common/DocumentList';

class MedicalBenefitView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            document: [],
            status_info: []
        }
        
    }
    

    componentDidMount() {
        this.getMedicalDocument();
        this.getStatusInfo();
    }

    getMedicalDocument() {
        fetch(`${main_url}medical_benefit/getDocument/${this.state.data.medical_benefit_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    document: res
                })
            })
            .catch(error => console.log(error))
    }

    getStatusInfo() {
        fetch(`${main_url}medical_benefit/getOneDetailInfo/${this.state.data.medical_benefit_id}`)
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
            <div className="benefits benefit-medical  wrapper border-bottom white-bg page-heading">
                <div className='row '>
                    <form className="form-group">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Employee Name</label></div>
                                <div className="col-sm-10">
                                    <input type='text' className='form-control' value={this.state.data.fullname}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12"> Available Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control"
                                        disabled
                                        value={this.state.data.available_amount}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="available-amount" className="col-sm-12"> Beneficiary </label></div>
                                <div className="col-sm-10">
                                    <input
                                        type='text ' disabled className='form-control' value={this.state.data.type_name}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="name-of-beneficiary" className="col-sm-12">Name of Beneficiary </label></div>
                                <div className="col-sm-10">
                                    <input type="text"
                                        className="form-control"
                                        disabled
                                        value={this.state.data.beneficary_name}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Request Amount </label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control"
                                        disabled
                                        value={this.state.data.request_amount}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Description </label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        cols="10"
                                        rows="3"
                                        value={this.state.data.description}
                                    >

                                    </textarea>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                <div className="row document-main">
                    {
                        this.state.document.length > 0 ?
                            <DocumentList title='Medical Benefit Document' doc={this.state.document} path='medical_benefit' />
                            : ''
                    }
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
            </div >
        )
    }
}

export default MedicalBenefitView