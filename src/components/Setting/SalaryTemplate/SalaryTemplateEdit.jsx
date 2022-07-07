import React, { Component } from 'react'
import Select from 'react-select'
import DatePicker from "react-datetime";
import moment from 'moment'
import { main_url } from '../../../utils/CommonFunction';
import { SalarytemplateValidation } from '../SettingValidation';

export default class SalaryTemplateEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            validateErr: {}
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
        const { sub_level_options, level_options } = this.props;
        const value = key === 'career_level' ?
            ((level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id))).career_level_id) :
            ((sub_level_options.find(v => Number(v.career_sub_level_id) === Number(val.career_sub_level_id))).career_sub_level_id);

        const obj = { ...this.state.data };
        obj[key] = value;
        this.setState({
            data: obj
        })
    }
    handleSave = () => {
        let status = 0;
        const { data } = this.state;
        const validateErr = SalarytemplateValidation(data);
        this.setState({ validateErr })

        if (Object.keys(validateErr).length === 0) {
            fetch(`${main_url}salaryTemplate/editSalaryTemplate/${data.id}`, {
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
                                <div><label htmlFor="date" className="col-sm-12">Date</label></div>
                                <div className="col-sm-10">
                                    {/* <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.date ? moment(data.date).format("MM-DD-YYYY") : ''} disabled /> */}
                                    <DatePicker
                                        dateFormat="MM-DD-YYYY"
                                        value={data.date ? moment(data.date).format("MM-DD-YYYY") : ''}
                                        timeFormat={false}
                                        open={false}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_level" className="col-sm-12">Career Level</label></div>
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
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="career_level" className="col-sm-12">Career Sub Level</label></div>
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
                            <div className="form-group col-md-6">
                                <div><label htmlFor="basic_salary" className="col-sm-12">Basic Salary</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        id='basic_salary'
                                        className="form-control input-md"
                                        value={data.basic_salary}
                                        onChange={this.handleInputChange}
                                        style={{ border: this.state.validateErr.basicSalaryErr && '1px solid red' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        className="form-control"
                                        id='remark'
                                        cols="40"
                                        rows="2"
                                        value={data.remark}
                                        onChange={this.handleInputChange}
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

