import React, { Component } from 'react'
import Select from 'react-select'
import { main_url } from '../../../utils/CommonFunction';

export default class CareerPathView extends Component {
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
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="promotion_quota" className="col-sm-12">Promotion Quota</label></div>
                                <div className="col-sm-10">
                                <input
                                    type="text"
                                    id="promotion_quota"
                                    className="form-control input-md"
                                    value={data.promotion_quota ? data.promotion_quota : ''}
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

