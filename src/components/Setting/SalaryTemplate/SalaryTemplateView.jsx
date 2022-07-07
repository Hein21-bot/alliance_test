import React, { Component } from 'react'
import Select from 'react-select'
import DatePicker from "react-datetime";
import moment from 'moment'

export default class SalaryTemplateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
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
                                        isDisabled={true}
                                        value={selectedCareerLevel ? selectedCareerLevel : null}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
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
                                        isDisabled={true}
                                        value={selectedCareerSubLevel ? selectedCareerSubLevel : null}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
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
                                        disabled />
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
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

