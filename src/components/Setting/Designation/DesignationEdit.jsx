import React, { Component } from 'react'
import Select from 'react-select'

class DesignationEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }
    handleInputChange = (e) => {
        const obj = { ...this.state.data };
        obj[e.target.id] = e.target.value;
        this.setState({
            data: obj
        })
    }
    render() {
        const { data } = this.state;
        return (
            <div className="container">
                <div className='row'>
                    <form id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="designation" className="col-sm-12">Designation</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.designation} />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="level" className="col-sm-12">Level</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={[]}
                                        // onChange={this.handleSpouseCompanyOptions.bind(this)}
                                        value={data.level}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="department" className="col-sm-12">Department</label></div>
                                <div className="col-sm-10">
                                    <Select
                                        placeholder="Please Choose An Option"
                                        options={[]}
                                        // onChange={this.handleSpouseCompanyOptions.bind(this)}
                                        value={data.department}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select" />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='remark'
                                        className="form-control"
                                        value={data.remark}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="active" className="col-sm-12">Active</label></div>
                                <div className="col-sm-10">
                                    <div style={{display: 'flex', alignItems: 'center'}} onChange={()=> console.log('sd')}>
                                        <input className='radio-style' type="radio" value={1} name="yes" checked={data.active == 1 ? true : false} /> Yes
                                        <input className='radio-style' type="radio" value={0} name="no" checked={data.active == 0 ? true : false} /> No
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row save-btn">
                            <div className="float-right">
                                {/* this.save.bind(this) */}
                                <button onClick={() => console.log('save btn')} className="btn btn-primary" id="saving_button" type="button">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default DesignationEdit