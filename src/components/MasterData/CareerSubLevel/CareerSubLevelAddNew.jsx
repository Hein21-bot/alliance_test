import React, { Component } from 'react'
import { main_url, validate, stopSaving, startSaving, alertText } from '../../../utils/CommonFunction';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'

var form_validate = true;

class CareerSubLevelAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            career_level: '',
            remark: '',
            active: 1,
            career_sub_level: '',
            career_level_id: ''
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    handleInputChange = (e) => {
        const id = e.target.id;
        const val = e.target.value;
        const setState = {};
        setState[id] = val;
        this.setState(setState)
    }
    handleCheckChange = (e) => {
        const id = e.target.id;
        const val = e.target.checked ? 1 : 0;
        const setState = {};
        setState[id] = val;
        this.setState(setState)
    }
    handleSelectorChange = (val, key) => {
        const { level_options } = this.props;
        const value =
            (level_options.find(v => Number(v.career_level_id) === Number(val.career_level_id))).career_level_id;
        const setState = {};
        setState[key] = value;

        this.setState(setState)
    }
    handleSave = () => {
        stopSaving();
        if (validate('check_form')) {
            let status = 0;
            const { career_sub_level, career_level, career_level_id, remark, active } = this.state;
            const data = {
                career_sub_level, career_level, career_level_id, remark, active
            }
            console.log("add data is ===>", data)
            fetch(`${main_url}careerSubLevel/addCareerSubLevel`, {
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
            toast.error(alertText, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            startSaving();
            form_validate = false;
        }
    }
    render() {
        // const { career_level,  active } = this.state;
        // console.log("this.state.data is ====>", this.state.data)
        const { level_options } = this.props;
        const { career_sub_level, career_level, career_level_id, remark, active } = this.state;
        const selectedAllowLevel = level_options.find(v => Number(v.career_level_id) === Number(career_level_id));
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-12">
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="career_level" className="col-sm-12">Career Level</label></div>
                                    <div className="col-sm-12">
                                        <Select
                                            placeholder="Please Choose An Option"
                                            options={level_options}
                                            onChange={(val) => this.handleSelectorChange(val, 'career_level')}
                                            value={selectedAllowLevel}
                                            className='react-select-container  checkValidate'
                                            classNamePrefix="react-select" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="career_sub_level" className="col-sm-12">Career Sub Level</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            id='career_sub_level'
                                            className="form-control checkValidate input-md"
                                            value={career_sub_level}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                {/* <div className='col-sm-10' style={{ padding: 0 }}> */}
                                <div className='col-md-8' >
                                    <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                    <div className="col-sm-12">
                                        <input
                                            type="text"
                                            id='remark'
                                            className="form-control  input-md"
                                            value={remark}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className='col-md-4' style={{ padding: 0 }}>
                                    <div><label htmlFor="active" className="col-sm-12 text-center" style={{}}>Active</label></div>
                                    <div className="col-sm-12" style={{}}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                            <input
                                                type="checkbox"
                                                id={'active'}
                                                checked={(active === 1) ? true : false}
                                                onChange={(e) => this.handleCheckChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* </div> */}
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

export default CareerSubLevelAddNew