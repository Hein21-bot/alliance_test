import React, { Component } from 'react'
import Select from 'react-select'
import { main_url } from '../../../utils/CommonFunction';
import { BenefitValidation } from '../SettingValidation';
import moment from 'moment';

class BenefitEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            validateErr: {},
        }
    }
    handleInputChange = (e) => {
        const obj = { ...this.state.data };
        obj[e.target.id] = e.target.value;
        this.setState({
            data: obj
        })
    }
    handleSelectorChange = (val, key) => {
        const { martial_status_options, benefit_type_options, level_options, hospitalizationTypeOptions } = this.props;
        const value = key === 'is_married' ?
            ((martial_status_options.find(v => Number(v.is_married) === Number(val.is_married))).is_married) :
            key === 'benefit_type_id' ?
                ((benefit_type_options.find(v => Number(v.benefit_type_id) === Number(val.benefit_type_id))).benefit_type_id) :
                key === 'hospitalization_id' ?
                    hospitalizationTypeOptions.find(v => Number(v.hospitalization_id) === Number(val.hospitalization_id)).hospitalization_id :
                ((level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id))).career_level_id);

        const obj = { ...this.state.data };
        obj[key] = value;
        this.setState({
            data: obj
        })
    }
    handleCheckChange = (e) => {
        const id = e.target.id;
        const val = e.target.checked ? 1 : 0;
        const obj = { ...this.state.data };
        obj[id] = val;
        this.setState({
            data: obj
        })
    }
    handleSave = () => {
        const { data } = this.state;
        const validateErr = BenefitValidation(data);
        this.setState({ validateErr })
        let status = 0;
        if (Object.keys(validateErr).length === 0) {
            fetch(`${main_url}benefitSetup/editBenefit/${data.benefit_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${JSON.stringify(data)}`

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            this.props.showToast(status, 'Please Add Fully Information.');

        }
    }
    render() {
        const { martial_status_options, benefit_type_options, level_options, hospitalizationTypeOptions } = this.props;
        const { data } = this.state;
        // console.log('data ', data)
        const selectedMartialStatus = martial_status_options.find(v => Number(v.is_married) === Number(data.is_married));
        const selectedBenefitType = benefit_type_options.find(v => Number(v.benefit_type_id) === Number(data.benefit_type_id));
        const selectedAllowLevel = level_options.find(v => Number(v.career_level_id) === Number(data.allow_level));
        const selectedHospitalizationType = hospitalizationTypeOptions.find(v => Number(v.hospitalization_id) === Number(data.hospitalization_id))
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
                                        value={moment(data.date).format('YYYY-MM-DD')} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="benefit_type_id" className="col-sm-12">Benefit Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={benefit_type_options}
                                        onChange={(val) => this.handleSelectorChange(val, 'benefit_type_id')}
                                        value={selectedBenefitType}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: provided => ({
                                                ...provided,
                                                border: this.state.validateErr.benefitTypeErr ? '1px solid red' : '1px solid #e5e5e5',
                                                cursor: "pointer"
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            selectedBenefitType &&
                            <div className="row">
                                {
                                    selectedBenefitType.benefit_type_id === 6 &&
                                    <div className="form-group col-md-6">
                                        <div><label htmlFor="is_married" className="col-sm-12">Martial Status<span className="text-danger">*</span></label></div>
                                        <div className="col-sm-10">
                                            <Select
                                                placeholder="Please Choose An Option"
                                                options={martial_status_options}
                                                onChange={(val) => this.handleSelectorChange(val, 'is_married')}
                                                value={selectedMartialStatus}
                                                className='react-select-container  checkValidate'
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: provided => ({
                                                        ...provided,
                                                        border: this.state.validateErr.isMartialErr ? '1px solid red' : '1px solid #e5e5e5',
                                                        cursor: "pointer"
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                                {
                                    selectedMartialStatus ?
                                        (selectedMartialStatus.is_married === 1 &&
                                            <div className="form-group col-md-6">
                                                <div><label htmlFor="no_of_child" className="col-sm-12">Child Count<span className="text-danger">*</span></label></div>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="number"
                                                        id='no_of_child'
                                                        className="form-control"
                                                        value={data.no_of_child}
                                                        onChange={this.handleInputChange}
                                                        style={{ border: this.state.validateErr.childCntErr && '1px solid red' }}
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
                                <div><label htmlFor="amount" className="col-sm-12">Amount<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        id='amount'
                                        className="form-control input-md"
                                        value={data.amount}
                                        onChange={this.handleInputChange}
                                        style={{ border: this.state.validateErr.amountErr && '1px solid red' }}
                                    />
                                </div>
                            </div>
                            {
                                selectedBenefitType && selectedBenefitType.benefit_type_id != 9 ?
                                    <div className="form-group col-md-6">
                                        <div><label htmlFor="description" className="col-sm-12">Description</label></div>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                id='description'
                                                className="form-control"
                                                value={data.description}
                                                onChange={this.handleInputChange}

                                            />
                                        </div>
                                    </div> :
                                    <div className="form-group col-md-6">
                                        <div><label htmlFor="description" className="col-sm-12">Hospitalization</label></div>
                                        <div className="col-sm-10">
                                            <Select
                                                placeholder="Please Choose An Option"
                                                options={hospitalizationTypeOptions}
                                                onChange={(val) => this.handleSelectorChange(val, 'hospitalization_id')}
                                                value={selectedHospitalizationType}
                                                className='react-select-container  checkValidate'
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: provided => ({
                                                        ...provided,
                                                        border: this.state.validateErr.isMartialErr ? '1px solid red' : '1px solid #e5e5e5',
                                                        cursor: "pointer"
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className="row">
                            {selectedBenefitType != undefined && (selectedBenefitType.benefit_type_id == 7 || selectedBenefitType.benefit_type_id == 8) ? '' :
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="allow_service_year" className="col-sm-12">Allow Service Year<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="number"
                                            id='allow_service_year'
                                            className="form-control input-md"
                                            value={data.allow_service_year}
                                            onChange={this.handleInputChange}
                                            style={{ border: this.state.validateErr.allowServiceYrErr && '1px solid red' }}
                                        />
                                    </div>
                                </div>}
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' style={{ padding: 0 }}>
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="allow_level" className="col-sm-12">Allow Level<span className="text-danger">*</span></label></div>
                                        <div className="col-sm-12">
                                            <Select
                                                placeholder="Please Choose An Option"
                                                options={level_options}
                                                onChange={(val) => this.handleSelectorChange(val, 'allow_level')}
                                                value={selectedAllowLevel}
                                                className='react-select-container  checkValidate'
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: provided => ({
                                                        ...provided,
                                                        border: this.state.validateErr.allowLevelErr ? '1px solid red' : '1px solid #e5e5e5',
                                                        cursor: "pointer"
                                                    })
                                                }}
                                            />
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
                                                    onChange={(e) => this.handleCheckChange(e)}
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
                                        onChange={this.handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row save-btn">
                            <div className="float-right">
                                {/* this.save.bind(this) */}
                                <button onClick={() => this.handleSave()} className="btn btn-primary" id="saving_button" type="button">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default BenefitEdit