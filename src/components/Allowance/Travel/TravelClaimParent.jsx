import React, { Component } from 'react'
import Select from 'react-select';
import TrainingClaimRequestAddNew from './TravelClaimRequestAddNew';
import TrainingAdvancedClaimAddNew from './TrainingAdvancedClaimAddNew';
import { main_url } from '../../../utils/CommonFunction';
const type = [{
    value: 1,
    label: 'Advanced Claim'
}, {
    value: 2,
    label: 'Claim Request'
}]

export default class TraininigClaimParent
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            claimTypeId: '',
            claimType: type,
            selectedType: '',
            isAdvancedClaim: false,
            isClaimRequest: false,
            advancedNo: [],
        }
    }

    componentDidMount() {
        this.getUnClaimTrainingAdvanced()

    }

    getUnClaimTrainingAdvanced() {
        fetch(main_url + "allowance/getUnClaimTrainingAdvanced")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ advancedNo: res })

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    handleChangeClaim = (event) => {

        if (event.value === 1) {

            this.setState({
                selectedType: event,
                claimTypeId: event.value,
                isAdvancedClaim: true,
                isClaimRequest: false
            }
            )
        }
        else {
            this.setState({
                selectedType: event,
                claimTypeId: event.value,
                isAdvancedClaim: false,
                isClaimRequest: true
            })

        }

    }

    render() {
        return (
            <div>
                <div className="col-md-4">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div><label className="col-sm-12" >Claim Type<span className="text-danger">*</span></label></div>
                        <div className="col-sm-10">

                            <Select
                                placeholder="Please Choose Type"
                                value={this.state.selectedType}
                                onChange={this.handleChangeClaim}
                                options={this.state.claimType}
                            />

                        </div>
                    </div>
                </div>


                <div>
                    {
                        this.state.isAdvancedClaim ? <TrainingAdvancedClaimAddNew goBack={this.goBack} data={this.state.advancedNo}

                        /> : ''
                    }
                    {
                        this.state.isClaimRequest ?
                            <TrainingClaimRequestAddNew /> : ''
                    }

                </div>
            </div>


        )
    }
}