import React, { Component } from 'react'
import Select from 'react-select'

class BenefitView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }
    render() {
        // console.log("props is =====>", this.state.data)
        const { martial_status_options, benefit_type_options, level_options } = this.props;
        const { data } = this.state;
        const selectedMartialStatus = martial_status_options.find(v => Number(v.is_married) === Number(data.is_married));
        const selectedBenefitType = benefit_type_options.find(v => Number(v.benefit_type_id) === Number(data.benefit_type_id));
        const selectedAllowLevel = level_options.find(v => Number(v.career_level_id) === Number(data.allow_level));
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
                                        value={data.date} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="benefit_type_id" className="col-sm-12">Benefit Type</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder=""
                                        options={benefit_type_options}
                                        value={selectedBenefitType}
                                        isDisabled={true}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>
                        {
                            selectedBenefitType &&
                            <div className="row">
                                {
                                    selectedBenefitType.benefit_type_id === 6 &&
                                    <div className="form-group col-md-6">
                                        <div><label htmlFor="is_married" className="col-sm-12">Martial Status</label></div>
                                        <div className="col-sm-10">
                                            <Select
                                                placeholder=""
                                                options={martial_status_options}
                                                value={selectedMartialStatus}
                                                isDisabled={true}
                                                className='react-select-container  checkValidate'
                                                classNamePrefix="react-select" />
                                        </div>
                                    </div>
                                }
                                {
                                    selectedMartialStatus ?
                                        (selectedMartialStatus.is_married === 1 &&
                                            <div className="form-group col-md-6">
                                                <div><label htmlFor="no_of_child" className="col-sm-12">Child Count</label></div>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="number"
                                                        id='no_of_child'
                                                        className="form-control"
                                                        value={data.no_of_child}
                                                        disabled
                                                    />
                                                </div>
                                            </div>)
                                        :
                                        <></>
                                }
                            </div>
                        }
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="amount" className="col-sm-12">Amount</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        id='amount'
                                        className="form-control input-md"
                                        value={data.amount}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Description</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='description'
                                        className="form-control"
                                        value={data.description}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {selectedBenefitType != undefined && (selectedBenefitType.benefit_type_id == 7 || selectedBenefitType.benefit_type_id == 8) ? '' :
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="allow_service_year" className="col-sm-12">Allow Service Year</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            id='allow_service_year'
                                            className="form-control input-md"
                                            value={data.allow_service_year}
                                            disabled />
                                    </div>
                                </div>}
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' style={{ padding: 0 }}>
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="allow_level" className="col-sm-12">Allow Level</label></div>
                                        <div className="col-sm-12">
                                            <Select
                                                placeholder=""
                                                options={level_options}
                                                isDisabled={true}
                                                value={selectedAllowLevel}
                                                className='react-select-container  checkValidate'
                                                classNamePrefix="react-select" />
                                        </div>
                                    </div>
                                    <div className='col-md-4' style={{ padding: 0 }}>
                                        <div><label htmlFor="above_level" className="col-sm-12 text-center" style={{}}>Above Level</label></div>
                                        <div className="col-sm-12" style={{}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                                <input
                                                    className='checkbox_'
                                                    type="checkbox"
                                                    id={'above_level'}
                                                    checked={(data.above_level == 1 && data.above_level) ? true : false}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='remark'
                                        className="form-control input-md"
                                        value={data.remark}
                                        disabled />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default BenefitView