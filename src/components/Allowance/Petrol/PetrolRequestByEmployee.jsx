import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import ApprovalForm from '../../Common/ApprovalForm';
import { main_url, getUserId, validate, getActionStatus, havePermission, getWorkFlowStatus, stopSaving, startSaving } from '../../../utils/CommonFunction';

var form_validate = true;
class PetrolRequestByEmployee extends Component {

    constructor(props) {
        super(props);
        var user_id = getUserId("user_info");
        this.state = {
            main_data: {
                form_no: '',
                request_month: moment().format('YYYY-MM-DD'),
                createdBy: user_id,
                updatedBy: user_id,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 0
            },
            detail_data: {
                vehicle_number: '',
                opening_kilo: 0,
                closing_kilo: 0,
                total_kilo: 0,
                deduction_kilo: 0,
                net_kilo: 0,
                total_mile: 0,
                net_claim_amount: 0,
                description: ''
            },
            data_arr: [],
            user_id: user_id,
            is_main_role: false,
            status_title: '',
            work_flow_status: {},
            attachment: [],
            newDoc: []
        };

    }

    async componentDidMount() {
        if (!Array.isArray(this.props.data) && this.props.data !== null) {
            var one = this.props.data;
            one.updatedBy = this.state.user_id;
            one.updatedAt = new Date();
            var work_flow = await getWorkFlowStatus(this.props.data.createdBy, this.state.user_id, 'Petrol By Staff', 'Allowance');
            this.setState({
                main_data: this.props.data,
                work_flow_status: work_flow,
                is_main_role: havePermission(work_flow)
            })
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    handleRequestMonth = (index, event) => {
        let data = this.state.main_data;
        data.request_month = event.target.value;

        this.setState({
            main_data: data
        });
    };

    handleVehicleNumber = (index, event) => {
        if (index !== null) {
            let data = this.state.data_arr;
            data[index].vehicle_number = event.target.value;

            this.setState({
                data_arr: data
            });
        } else {
            let data = this.state.detail_data;
            data.vehicle_number = event.target.value;

            this.setState({
                detail_data: data
            });
        }

    };

    handleOpeningKiloOfVehicle = (index, event) => {
        if (index !== null) {
            let data = this.state.data_arr;
            data[index].opening_kilo = event.target.value;

            this.setState({
                data_arr: data
            }, () => this.calculateKilo(data, index));
        } else {
            let data = this.state.detail_data;
            data.opening_kilo = Number(event.target.value);

            this.setState({
                detail_data: data
            }, () => this.calculateKilo(data, index));
        }
    };

    handleClosingKiloOfVehicle = (index, event) => {
        if (index !== null) {
            let data = this.state.data_arr;
            data[index].closing_kilo = event.target.value;

            this.setState({
                data_arr: data
            }, () => this.calculateKilo(data, index));
        } else {
            let data = this.state.detail_data;
            data.closing_kilo = Number(event.target.value);

            this.setState({
                detail_data: data
            }, () => this.calculateKilo(data, index));
        }
    };

    handleTotalKilo() {
        let data = this.state.detail_data;
        if (data.opening_kilo > 0 && data.closing_kilo > 0 && data.opening_kilo <= data.closing_kilo) {
            data.total_kilo = data.closing_kilo - data.opening_kilo;
        }
        else data.total_kilo = 0;

        this.setState({
            detail_data: data
        });
    };

    handleDeductionKilo = (index, event) => {
        if (index !== null) {
            let data = this.state.data_arr;
            data[index].deduction_kilo = event.target.value;

            this.setState({
                data_arr: data
            }, () => this.calculateKilo(data, index));
        } else {
            let data = this.state.detail_data;
            data.deduction_kilo = Number(event.target.value);

            this.setState({
                detail_data: data
            }, () => this.calculateKilo(data, index));
        }
    };

    handleNetKilo() {
        let data = this.state.detail_data;
        if (data.total_kilo > 0) {
            data.net_kilo = data.total_kilo - data.deduction_kilo;
        }
        else data.net_kilo = 0;

        this.setState({
            detail_data: data
        });
    }

    // handleTotalMile = (index, event) => {
    //     let data = this.state.detail_data;
    //     data.total_mile = event.target.value;

    //     this.setState({
    //         detail_data: data
    //     });
    // }

    // handleNetClaimAmount = (index, event) => {
    //     let data = this.state.detail_data;
    //     data.net_claim_amount = event.target.value;

    //     this.setState({
    //         detail_data: data
    //     });
    // }

    handleDescription = (index, event) => {
        if (index !== null) {
            let data = this.state.data_arr;
            data[index].description = event.target.value;

            this.setState({
                data_arr: data
            });
        } else {
            let data = this.state.detail_data;
            data.description = event.target.value;

            this.setState({
                detail_data: data
            });
        }
    }

    calculateKilo(info, index) {
        let data;
        if (index !== null) {
            data = info[index];
        } else {
            data = info;
        }

        if (data.opening_kilo > 0 && data.closing_kilo > 0 && data.opening_kilo <= data.closing_kilo) {
            data.total_kilo = data.closing_kilo - data.opening_kilo;
        }
        else data.total_kilo = 0;
        if (data.total_kilo > 0) {
            data.net_kilo = data.total_kilo - data.deduction_kilo;
        }
        else data.net_kilo = 0;
        data.total_mile = data.net_kilo / 1.6;
        data.net_claim_amount = data.total_mile * 60;

        if (index !== null) {
            info[index] = data;
            this.setState({
                data_arr: info
            })
        } else {
            this.setState({
                detail_data: data
            });
        }
    }

    //@kpk
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    addData() {
        if (validate("check_form")) {
            // stopSaving();
            var arr = this.state.data_arr;
            arr.push(this.state.detail_data);
            this.setState({
                data_arr: arr,
                detail_data: {
                    vehicle_number: '',
                    opening_kilo: 0,
                    closing_kilo: 0,
                    total_kilo: 0,
                    deduction_kilo: 0,
                    net_kilo: 0,
                    total_mile: 0,
                    net_claim_amount: 0,
                    description: ''
                }
            })
        }
    }

    //@kpk
    checkFiles(e) {
        var files = document.getElementById("attach_file").files;
        var attachment = [];
        if (files.length > 5) {
            toast.warning('You can only upload a maximum of 5 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                attachment.push(files[i])
            }
        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#attach_file").files[i];
            newDoc.push(getfile)
        }

        this.setState({
            attachment: attachment,
            newDoc: newDoc
        })
    }

    handleRemove(e) {
        let data = this.state.data_arr;
        data.splice(e, 1);
        this.setState({
            data_arr: data
        })
    }

    approvalStatus = (text) => {
        this.setState({ status_title: text }, () => this.save())
    }

    save() {
        stopSaving();
        if (this.state.data_arr.length > 0 && this.state.attachment.length > 0) {
            let data = this.state.main_data;
            let status = 0;
            let path = '';
            var one = this.props.data;
            let { status_title, is_main_role } = this.state;
            if (!Array.isArray(one) && one !== null) {
                if (status_title !== '' && is_main_role) {
                    var action = getActionStatus(status_title, one, this.state.user_id);
                    data.referback_by = action.referback_by;
                    data.checked_by = action.checked_by;
                    data.verified_by = action.verified_by;
                    data.approved_by = action.approved_by;
                    data.rejected_by = action.rejected_by;
                    data.referback_date = action.referback_date;
                    data.checked_date = action.checked_date;
                    data.verified_date = action.verified_date;
                    data.approved_date = action.approved_date;
                    data.rejected_date = action.rejected_date;
                    data.referback_comment = action.referback_comment;
                    data.checked_comment = action.checked_comment;
                    data.verified_comment = action.verified_comment;
                    data.approved_comment = action.approved_comment;
                    data.status = action.status;
                }
                path = `editPetrolEmployee/${one.petrol_employee_id}`;
            }
            else {
                path = `addPetrolEmployee`;
            }

            const formdata = new FormData();

            var obj = document.querySelector("#attach_file").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#attach_file").files[i];
                formdata.append('uploadfile', imagedata);
            }
            let info = {
                main_data: data,
                detail_data: this.state.data_arr
            };
            formdata.append('info', JSON.stringify(info))

            fetch(`${main_url}allowance/${path}`, {
                method: "POST",
                body: formdata

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            startSaving();
            form_validate = false;
        }

    }

    render() {
        let is_main_role = this.state.is_main_role;
        return (
            <div className="container" id="check_form">
                <ToastContainer />
                <div className="row">
                    {/* <div className="col-md-4">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="request-month">Request Type</label>
                            <div className="col-sm-10">
                                <input type="text" id="request-month"
                                    value='Petrol By Employee' className="form-control"
                                />
                            </div>
                        </div>
                    </div> */}
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="request-month">Request Month</label>
                            <div className="col-sm-10">
                                <input type="date" id="request-month"
                                    className="form-control checkValidate"
                                    value={this.state.main_data.request_month} className="form-control"
                                    onChange={this.handleRequestMonth} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="vehicle-number">Vehicle Number</label>
                            <div className="col-sm-10">
                                <input type="text" id="vehicle-number"
                                    value={this.state.detail_data.vehicle_number}
                                    placeholder="Enter Vehicle Number"
                                    className="form-control checkValidate"
                                    onChange={this.handleVehicleNumber.bind(this, null)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="opening-kilo-of-vehicle">Opening Kilo of Vehicle</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="0.01" id="opening-kilo-of-vehicle"
                                    value={this.state.detail_data.opening_kilo}
                                    placeholder="0" className="form-control checkValidate"
                                    onChange={this.handleOpeningKiloOfVehicle.bind(this, null)} />
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="closing-kilo-of-vehicle">Closing Kilo of Vehicle</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="0.01" id="closing-kilo-of-vehicle"
                                    value={this.state.detail_data.closing_kilo}
                                    placeholder="0" className="form-control checkValidate"
                                    onChange={this.handleClosingKiloOfVehicle.bind(this, null)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="total-kilo">Total Kilo During The Period</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="0.01" id="total-kilo" value={this.state.detail_data.total_kilo}
                                    placeholder="0" className="form-control" disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="deduction-kilo">Deduction Kilo of Personal Usage</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="0.01" id="deduction-kilo"
                                    value={this.state.detail_data.deduction_kilo}
                                    placeholder="0" className="form-control checkValidate"
                                    onChange={this.handleDeductionKilo.bind(this, null)} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="net-kilo">Net Kilo Charged To Alliance</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="0.01" id="net-kilo" value={this.state.detail_data.net_kilo}
                                    placeholder="0 " className="form-control " disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="total-mile">Total Mile</label>
                            <div className="col-sm-10">
                                <input type="number" min="0" step="0.01" id="total-mile" value={this.state.detail_data.total_mile}
                                    placeholder="0" className="form-control "
                                    disabled />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="net-claim-amount">Net Claim Amount</label>
                            <div className="col-sm-10">
                                <input type="number" id="net-claim-amount" min="0" step="0.01"
                                    value={this.state.detail_data.net_claim_amount}
                                    placeholder="0" className="form-control"
                                    disabled />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="col-sm-12" htmlFor="net-claim-amount">Description</label>
                            <div className="col-sm-10">
                                <textarea
                                    row="3"
                                    columns="50"
                                    value={this.state.detail_data.description}
                                    onChange={this.handleDescription.bind(this, null)}
                                    placeholder="Enter text" className="form-control checkValidate"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="col-sm-11  btn-rightend">
                            <button className="btn-primary btn" onClick={() => this.addData()} style={{ marginTop: 20 }}>Add</button>
                        </div>
                    </div>
                </div>
                <div className="row margin-top-20">
                    <div className="col-md-12">
                        <table className="table table-bordered table-responsive">
                            <thead>
                                <tr>
                                    <th>Vehicle Number</th>
                                    <th>Opening Kilo</th>
                                    <th>Closing Kilo</th>
                                    <th>Total Kilo</th>
                                    <th>Deduction Kilo</th>
                                    <th>Net Kilo</th>
                                    <th>Total Mile</th>
                                    <th>Net Claim Amount</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.data_arr.map((d, i) =>
                                        <tr>
                                            <td>
                                                <input type="text"
                                                    className="form-control"
                                                    onChange={this.handleVehicleNumber.bind(this, i)}
                                                    value={d.vehicle_number}
                                                />
                                            </td>
                                            <td>
                                                <input type="text"
                                                    className="form-control"
                                                    onChange={this.handleOpeningKiloOfVehicle.bind(this, i)}
                                                    value={d.opening_kilo}
                                                />
                                            </td>
                                            <td>
                                                <input type="text"
                                                    className="form-control"
                                                    onChange={this.handleClosingKiloOfVehicle.bind(this, i)}
                                                    value={d.closing_kilo}
                                                />
                                            </td>
                                            <td>{d.total_kilo}</td>
                                            <td>
                                                <input type="text"
                                                    className="form-control"
                                                    onChange={this.handleDeductionKilo.bind(this, i)}
                                                    value={d.deduction_kilo}
                                                />
                                            </td>
                                            <td>{d.net_kilo}</td>
                                            <td>{d.total_mile}</td>
                                            <td>{d.net_claim_amount}</td>
                                            <td>
                                                <input type="text"
                                                    className="form-control"
                                                    onChange={this.handleDescription.bind(this, i)}
                                                    value={d.description}
                                                />
                                            </td>
                                            <td><button className="btn btn-primary btn-sm" onClick={this.handleRemove.bind(this, i)}>Remove</button></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div>
                            <label htmlFor="attachment" className="col-sm-12 custom-file-label">Attachment</label>
                        </div>
                        <div className="col-sm-10">
                            <input className="full_width dropZone" type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.newDoc.map((data, index) =>

                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                <div className="columns"><div className="column-thumbnail">
                                    <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                        <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                        </div></div><span className="fileuploader-action-popup"></span></div>
                                    <div className="column-title">
                                        <span className="own-text">
                                            {data.name}
                                        </span></div>
                                    <div className="column-actions">
                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                    </div></div></li></ul>
                        </div>
                    )
                    }
                </div>
                <div className="row save-btn ">
                    {
                        !Array.isArray(this.props.data) && havePermission(this.state.work_flow_status) ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.main_data.status} work_flow={this.state.work_flow_status} />

                            :
                            <div className="float-right">
                                <div>
                                    <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button>
                                </div>
                            </div>
                    }

                </div>
            </div>
        )

    }
}

export default PetrolRequestByEmployee;