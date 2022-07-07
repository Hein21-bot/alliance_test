import React, { Component } from 'react'
import Select from 'react-select'
import { main_url } from '../../../utils/CommonFunction';

class CareerLevelView extends Component {
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
                                <div><label htmlFor="career_level" className="col-sm-12">Career Level</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='career_level'
                                        className="form-control input-md"
                                        value={data.career_level}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' style={{ padding: 0 }}>
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                        <div className="col-sm-12">
                                            <input
                                                type="text"
                                                id='remark'
                                                className="form-control input-md"
                                                value={data.remark}
                                                disabled />
                                        </div>
                                    </div>
                                    <div className='col-md-4' style={{ padding: 0 }}>
                                        <div><label htmlFor="active" className="col-sm-12 text-center" style={{}}>Active</label></div>
                                        <div className="col-sm-12" style={{}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                                <input
                                                    type="checkbox"
                                                    id={'above_level'}
                                                    checked={(data.active === 1) ? true : false}
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

export default CareerLevelView