import React, { Component } from 'react';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'
import { main_url } from '../../../utils/CommonFunction';
import PetrolRequestByBM from './PetrolRequestedByBm';
import PetrolRequestByEmployee from './PetrolRequestByEmployee';

const petrolType = [
    { value: 1, label: 'Petrol By BM' },
    { value: 2, label: 'Petrol By Employee' }
];
class PetrolRequestSelectType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedRequest: [],
            isBM: false,
            isEmployee: false
        }
        // this.handlePetrolRequestType = this.handlePetrolRequestType.bind(this);
    }

    addPetrolByBm = (PetrolData, PetrolDetail) => {
        var data = [];
        data = {
            data: PetrolData,
            detail: PetrolDetail
        }

        fetch(main_url + 'allowance/addPetrolByBm', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(data => data.text())
            .then(data => {
                if (data === 'success') {
                    // console.log("Success");
                    this.setState({

                        isAddnew: false
                    })
                    window.location.reload();

                }
                else {
                    toast.error('😰 Failed', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            });
    }
    handlePetrolRequestType = (event) => {
        if (event.value == 1) {
            this.setState({
                isBM: true,
                isEmployee: false,
                selectedRequest: { value: 1, label: 'Petrol By BM' }
            });

        } else {
            this.setState({
                isEmployee: true,
                isBM: false,
                selectedRequest: { value: 2, label: 'Petrol By Employee' }
            })
        }

    }

    handlePetrolType = (event) => {
        if (event.value == 1) {
            this.setState({
                isBM: true,
                isEmployee: false,
                selectedRequest: event
            });

        } else {
            this.setState({
                isEmployee: true,
                isBM: false,
                selectedRequest: event
            })
        }
    };

    render() {
        return (
            <div className="wrapper wrapper-content">
                <div className="row">
                    <div className="form-horizontal" name="demo-form">

                        {
                            this.state.isBM ?
                                <PetrolRequestByBM add={this.addPetrolByBm} showToast={this.props.showToast} /> :

                                this.state.isEmployee ?
                                    <PetrolRequestByEmployee data={[]} showToast={this.props.showToast} work_flow_status={this.state.work_flow_status} /> :
                                    <div className="col-md-4">
                                        <div>
                                            <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>

                                            <div className="col-sm-12">
                                                <Select
                                                    placeholder="Please Choose Petrol Request Type"
                                                    options={petrolType}
                                                    onChange={this.handlePetrolType.bind(this)}
                                                    value={this.state.selectedRequest}
                                                    className='react-select-container  checkValidate'
                                                    classNamePrefix="react-select" />
                                            </div>
                                        </div>
                                    </div>
                        }

                    </div>

                </div>
            </div>
        )

    }
}


export default PetrolRequestSelectType;
