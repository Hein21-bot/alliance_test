import React, { Component } from 'react'
import Select from 'react-select'
import { main_url } from '../../../utils/CommonFunction';
import { CareerPathValidation } from '../SettingValidation';

export default class CareerPathEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            validateErr: {}
        }
    }

    handleInputChange = (e) => {
        const id = e.target.id;
        const val = e.target.value;
        const newObj = { ...this.state.data };
        newObj[id] = val;
        this.setState({ data: newObj })
    }
    handleSelectorChange = (val, key) => {
        const { sub_level_options, level_options } = this.props;
        const value = key === 'career_level' ?
            ((level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id))).career_level_id) :
            ((sub_level_options.find(v => Number(v.career_sub_level_id) === Number(val.career_sub_level_id))).career_sub_level_id);

        const newObj = { ...this.state.data };
        newObj[key] = value;
        this.setState({ data: newObj })
    }

    handleSave = () => {
        let status = 0;
        const { data } = this.state;
        const validateErr = CareerPathValidation(data);
        this.setState({ validateErr })
        console.log(validateErr)
        if (Object.keys(validateErr).length === 0) {
            fetch(`${main_url}careerPathSetting/editCareerPath/${data.id}`, {
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
            this.props.showToast(0, 'Please Add Fully Information.');
        }
    }

    render() {
        const { data } = this.state;
        const { level_options, sub_level_options } = this.props;
        const selectedCareerLevel = level_options.find(v => Number(v.career_level_id) === Number(data.career_level));
        const selectedCareerSubLevel = sub_level_options.find(v => Number(v.career_sub_level_id) === Number(data.career_sub_level));
        const FilteredCareerSubLevel = data.career_level ? sub_level_options.filter(v => Number(v.career_level_id) === Number(data.career_level)) : sub_level_options;

        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_level" className="col-sm-12">Career Level<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={level_options}
                                        onChange={(val) => this.handleSelectorChange(val, 'career_level')}
                                        value={selectedCareerLevel ? selectedCareerLevel : null}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: provided => ({
                                                ...provided,
                                                border: this.state.validateErr.careerLevelErr ? '1px solid red' : '1px solid #e5e5e5',
                                                cursor: "pointer"
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_level" className="col-sm-12">Career Sub Level<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={FilteredCareerSubLevel}
                                        onChange={(val) => this.handleSelectorChange(val, 'career_sub_level')}
                                        value={selectedCareerSubLevel ? selectedCareerSubLevel : null}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: provided => ({
                                                ...provided,
                                                border: this.state.validateErr.careerSubLevelErr ? '1px solid red' : '1px solid #e5e5e5',
                                                cursor: "pointer"
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="promotion_quota" className="col-sm-12">Promotion Quota<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id="promotion_quota"
                                        className="form-control input-md"
                                        value={data.promotion_quota ? data.promotion_quota : ''}
                                        onChange={this.handleInputChange}
                                        style={{ border: this.state.validateErr.promotionQuotaErr && '1px solid red' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row save-btn">
                            <div className="float-right">
                                <button onClick={() => this.handleSave()} className="btn btn-primary" id="saving_button" type="button">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

