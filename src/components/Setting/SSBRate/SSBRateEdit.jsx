import React, { Component } from 'react'
import { main_url } from '../../../utils/CommonFunction';
import { SSBRateValidation } from '../SettingValidation';

export default class SSBRateEdit extends Component {
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

    handleSave = () => {
        const { data } = this.state;
        let status = 0;
        const validateErr = SSBRateValidation(data);
        this.setState({ validateErr })
        if (Object.keys(validateErr).length === 0) {
            fetch(`${main_url}sscSetting/editSscSetting/${data.id}`, {
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
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="date" className="col-sm-12">SSR Rate</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.type} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="percentage" className="col-sm-12">Percentage<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        id="percentage"
                                        className="form-control input-md"
                                        value={data.percentage}
                                        onChange={this.handleInputChange} 
                                        style={{ border: this.state.validateErr.percentErr && '1px solid red' }}
                                    />
                                    <i className="fa fa-percent" style={{ marginLeft: 5 }} aria-hidden="true"></i>
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