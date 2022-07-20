import React, { Component } from 'react'
import Select from 'react-select'
import moment from 'moment';

class TaxReliefView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }
    render() {
        const { allowance_reason_option } = this.props
        const { data } = this.state;
        const selectedAllowanceReason = allowance_reason_option.find(v => v.value == Number(data.allowance_reason_id));
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="date" className="col-sm-12">Date</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.date != null ? moment(data.date).format('YYYY-MM-DD') : ''} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="allowance_reason" className="col-sm-12">Allowance Reason</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose Level"
                                        options={allowance_reason_option}
                                        // onChange={(val) => this.handleSelectorChange(val, 'allowance_reason_id')}
                                        value={selectedAllowanceReason}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        disabled />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="allowance_percent" className="col-sm-12">Allowance Percent</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='job_title'
                                        className="form-control input-md"
                                        value={data.allowance_percent}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="allowance_amount" className="col-sm-12">Allowance Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.allowance_amount} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' style={{ padding: 0 }}>
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="remark" className="col-sm-12">Reamrk</label></div>
                                        <div className="col-sm-12">
                                            <input
                                                type="text"
                                                id='remark'
                                                className="form-control"
                                                value={data.remark}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default TaxReliefView