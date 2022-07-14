import React, { Component } from 'react'
import Select from 'react-select';
import TravelAdvancedAddNew from './TravelAdvancedAddNew';
import TravelClaimRequestAddNew from './TravelClaimRequestAddNew';


const type = [{
    value: 1,
    label: 'Advanced'
},
{
    value: 2,
    label: 'Claim Request'
}]

export default class TravelAddNewParent
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


    handleSelectedRequestType = event => {
        console.log("handleselectedRequesttype===>",event)
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

                        <div className="col-md-6">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <Select
                                        placeholder="Please Choose Type"
                                        value={this.state.selectedRequest}
                                        onChange={this.handleSelectedRequestType.bind(this)}
                                        options={this.state.requestType}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                this.state.isAdvanced ? <TravelAdvancedAddNew goBack={this.goBack} data={this.state.requestTypeId} add={this.props.add} />
                                    : this.state.isClaim ?
                                        <TravelClaimRequestAddNew goBack={this.goBack} addClaimRequest={this.props.addClaimRequest} />
                                        : ''
                            }


                        </div>


                    </div>

                </div>

            </div>

        )
    }
}