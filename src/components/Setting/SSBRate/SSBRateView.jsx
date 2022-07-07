import React, { Component } from 'react'

export default class SSBRateView extends Component {
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
                                <div><label htmlFor="ssb_rate" className="col-sm-12">SSB Rate</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='ssb_rate'
                                        className="form-control input-md"
                                        value={data.type}
                                        disabled />
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div><label htmlFor="percentage" className="col-sm-12">Percentage</label></div>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id='percentage'
                                        className="form-control input-md"
                                        value={data.percentage + ' %'}
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

