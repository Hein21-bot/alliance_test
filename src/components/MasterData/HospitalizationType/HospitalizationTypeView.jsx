import React, { Component } from 'react'
import Select from 'react-select'

class HospitalizationTypeView extends Component {
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
                                <div><label htmlFor="hospitalization_type" className="col-sm-12">Hospitalization Type</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control input-md"
                                        value={data.hospitalization_type} disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className='col-sm-10' style={{ padding: 0 }}>
                                    <div className='col-md-8' style={{ padding: 0 }}>
                                        <div><label htmlFor="remark" className="col-sm-12">Reamrk</label></div>
                                        <div className="col-sm-12">
                                            <input
                                                type="text"
                                                id='remark'
                                                className="form-control"
                                                value={data.remark}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4' style={{ padding: 0 }}>
                                        <div><label htmlFor="active" className="col-sm-12 text-center" style={{}}>Active</label></div>
                                        <div className="col-sm-12" style={{}}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                                                <input
                                                    type="checkbox"
                                                    id={'active'}
                                                    checked={data.active === 0 ? false : true}
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

export default HospitalizationTypeView