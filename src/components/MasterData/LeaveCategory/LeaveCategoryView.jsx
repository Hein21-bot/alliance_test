import React, { Component } from 'react'
import Select from 'react-select'

class LeaveCategoryView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
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
                                <div><label htmlFor="leave_category" className="col-sm-12">Leave Category</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.leave_category} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Description</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.description} disabled />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="leave_quota" className="col-sm-12">Leave Quota</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        id='leave_quota'
                                        className="form-control input-md"
                                        value={data.leave_quota}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' style={{ padding: 0 }}>
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="leave_policy" className="col-sm-12">Leave Policy Description</label></div>
                                        <div className="col-sm-12">
                                            <input
                                                type="text"
                                                id='leave_policy'
                                                className="form-control"
                                                value={data.leave_policy}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4' style={{ padding: 0 }}>
                                        <div><label htmlFor="allow_leave_count" className="col-sm-12 text-center" style={{}}>Allow Leave Count <br />({data.allow_leave_count == 1 ? 'Working Day' : 'Calendar Day'})</label></div>
                                        <div className="col-sm-12" style={{}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                                <input
                                                    type="checkbox"
                                                    id={'allow_leave_count'}
                                                    checked={data.allow_leave_count === 0 ? false : true}
                                                    disabled
                                                />
                                            </div>
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

export default LeaveCategoryView