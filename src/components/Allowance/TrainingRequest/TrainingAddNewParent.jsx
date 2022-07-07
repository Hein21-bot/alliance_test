import React, { Component } from 'react'
import Select from 'react-select';
import TrainingAdvancedAddNew from './TrainingAdvancedAddNew';
import TrainingClaimRequestAddNew from './TrainingClaimRequestAddNew';

const type = [{
    value: 1,
    label: 'Advanced'
},
{
    value: 2,
    label: 'Claim Request'
}]

export default class TrainingAddNewParent
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestTypeId: '',
            requestType: type,
            selectedRequest: '',
            isAdvanced: false,
            isClaim: false,
        }
    }

    handleSelectedRequestType = (event) => {

        if (event.value === 1) {

            this.setState({
                selectedRequest: event,
                requestTypeId: event.value,
                isAdvanced: true,
                isClaim: false
            }
            )
        }
        else {
            this.setState({
                selectedRequest: event,
                requestTypeId: event.value,
                isClaim: true,
                isAdvanced: false
            })

        }

    }

    render() {
        return (
            <div className="wrapper wrapper-content row  border-bottom white-bg dashboard-header">
                <div className="row">

                    <div className="form-horizontal" name="demo-form">

                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.selectedRequest}
                                        onChange={this.handleSelectedRequestType}
                                        options={this.state.requestType}
                                    />
                                </div>
                            </div>

                        </div>
                        <div>
                            {
                                this.state.isAdvanced ? <TrainingAdvancedAddNew goBack={this.goBack} data={this.state.requestTypeId} checkAvailableRoom={this.props.checkAvailableRoom} addAdvancedTraining={this.props.addAdvancedTraining}

                                /> : ''
                            }
                            {
                                this.state.isClaim ? <TrainingClaimRequestAddNew goBack={this.goBack} checkAvailableRoom={this.props.checkAvailableRoom} addClaimRequest={this.props.addClaimRequest} /> : ''
                            }


                        </div>


                    </div>

                </div>

            </div>
        )
    }
}