import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import { main_url, getCOEmployeeList, getFXEmployeeList, validate, getCookieData, stopSaving, startSaving } from '../../../utils/CommonFunction';

var form_validate = true;
class PetrolRequestByBm extends Component {
    constructor(props) {
        super(props);
        var user_info = getCookieData("user_info");
        this.state = {
            one_info: [],
            user_id: user_info.user_id,
            co_list: [],
            amount: [],
            fx_list: [],
            selected_co: [],
            selected_fx: [],
            petrol_detail: [],
            branch_id: user_info.branch_id,
            petrol_main: {
                status: 0,
                branch_id: user_info.branch_id,
                createdBy: user_info.user_id,
                updatedBy: user_info.user_id,
                createdAt: new Date(),
                updatedAt: new Date(),
                selected_date: moment().format('YYYY-MM-DD')
            },
            detail: {
                kilo: 0,
                client_officer_id: 0,
                client_officer_name: '',
                designations_id: 0,
                fx_name: '',
                fx_id: 0,
                product: '',
                further_location: '',
                distance_location: 0,
                petrol_charges: 0
            }
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    async componentDidMount() {
        var co_info = await getCOEmployeeList(this.state.branch_id);
        var fx_list = await getFXEmployeeList(this.state.branch_id);
        this.getPreviousPetrolInfo();
        this.setState({
            co_list: co_info.co_list,
            amount: co_info.amount,
            fx_list: fx_list
        })
    }

    getPreviousPetrolInfo() {
        let date = this.state.petrol_main.selected_date;
        fetch(`${main_url}allowance/getPreviousPetrolInfo/${this.state.branch_id}/${moment(date).format('YYYY')}/${moment(date).format('MM')}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ petrol_detail: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    handleClientOfficerName(e) {
        let data = this.state.detail;
        data.client_officer_id = e.value;
        data.client_officer_name = e.label;
        data.designations_id = e.designations_id;
        this.setState({
            detail: data,
            selected_co: e
        });
    }

    handleProduct(e) {
        let data = this.state.detail;
        data.product = e.target.value;

        this.setState({
            detail: data
        });
    }

    getDefaultAmount(id) {
        var list = this.state.amount;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].designations_id === id) {
                    return list[i];
                }
            }
            return null;
        }
        return null;
    }

    handleFxName(e) {
        let data = this.state.detail;
        data.fx_name = e.label;
        data.fx_id = e.value;
        var co = this.state.selected_co;
        //console.log(co)
        if (Array.isArray(co)) {
            var amount = this.getDefaultAmount(e.designations_id);
            if (amount !== null) {
                data.petrol_charges = amount.default_amount;
                console.log(amount);
            }
        }
        this.setState({
            detail: data,
            selected_fx: e
        });

    }

    handleFurthestLocation(e) {
        let data = this.state.detail;
        data.further_location = e.target.value;

        this.setState({
            detail: data
        })
    }

    handleDistanceToFurthestLocation(e) { 
        let data = this.state.detail;
        data.distance_location = e.target.value;
        var fx = this.state.selected_fx;
        if(!Array.isArray(fx)){
            var amount = this.getDefaultAmount(fx.designations_id);
        }
        if(amount !== null){
            data.petrol_charges = (amount.per_kilo_amount * data.kilo) + amount.default_amount;
        }

        this.setState({
            detail: data
        });
    }

    handleKilo(e) {
        let data = this.state.detail;
        data.kilo = e.target.value;
        var co = this.state.selected_co;
        if (!Array.isArray(co)) {
            var amount = this.getDefaultAmount(co.designations_id);
            console.log(amount)
            if (amount !== null) {
                data.petrol_charges = (amount.per_kilo_amount * data.kilo) + amount.default_amount;
            }
        }

        this.setState({
            detail: data
        });
    }

    handlePetrolCharges(e) {
        let data = this.state.detail;
        data.petrol_charges = e.target.value;

        this.setState({
            detail: data
        });
    }

    handleMonth(e) {
        let data = this.state.petrol_main;
        data.selected_date = e.target.value;
        this.setState({
            petrol_main: data
        }, () => this.getPreviousPetrolInfo());
    }

    savePetrolByBm() {
        stopSaving();
        if (validate("check_form")) {
            stopSaving();
            var data = [];
            data = {
                data: this.state.petrol_main,
                detail: this.state.petrol_detail
            }
            if (data.detail.length > 0) {
                let status = 0;
                fetch(main_url + 'allowance/addPetrolByBm', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `info=${JSON.stringify(data)}`

                })
                    .then(res => {
                        status = res.status;
                        return res.text()
                    })
                    .then(text => {
                        this.props.showToast(status, text);
                    })
            } else this.props.showToast(500, 'Please fill all requirements!');
        } else {
            startSaving();
            form_validate = false
        }
    }

    add() {
        let data = this.state.petrol_detail;
        data.push(this.state.detail);

        this.setState({
            petrol_detail: data,
            selected_co: [],
            selected_fx: [],
            detail: {
                kilo: 0,
                client_officer_id: 0,
                client_officer_name: '',
                fx_name: '',
                fx_id: 0,
                product: '',
                further_location: '',
                distance_location: 0,
                petrol_charges: 0
            }
        });

    }

    handleRemove(e) {
        let newData = this.state.dataSource;
        newData.splice(e, 1);
        this.setState({
            dataSource: newData
        })
    }

    OneKiloChange = (index, e) => {
        var data = this.state.petrol_detail;
        data[index].kilo = e.target.value;
        var amount = this.getDefaultAmount(data[index].designations_id);
        if (amount !== null) {
            data[index].petrol_charges = (amount.per_kilo_amount * data[index].kilo) + amount.default_amount;
            console.log(data[index].petrol_charges);
        }

        this.setState({
            petrol_detail: data
        })
    }

    render() {

        return (
            <div id="check_form">
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group" title="Charges will be calculated automatically">
                            <div><label htmlFor="petrol-charges" className="col-sm-12">Month</label></div>
                            <div className="col-sm-10">
                                <input type="date" id="petrol-charges" className="form-control checkValidate"
                                    onChange={this.handleMonth.bind(this)} value={this.state.petrol_main.selected_date} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label htmlFor="client-officer-name" className="col-sm-12">Client Officer Name</label></div>
                            <div className="col-sm-10">

                                <Select
                                    placeholder="Please Choose"
                                    onChange={this.handleClientOfficerName.bind(this)}
                                    options={this.state.co_list}
                                    value={this.state.selected_co}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label htmlFor="fx-name" className="col-sm-12">FX</label></div>
                            <div className="col-sm-10">
                                <Select
                                    placeholder="Please Choose"
                                    onChange={this.handleFxName.bind(this)}
                                    options={this.state.fx_list}
                                    value={this.state.selected_fx}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label htmlFor="furthest-location" className="col-sm-12">Furthest Location</label></div>
                            <div className="col-sm-10">
                                <input type="text" id="furthest-location" className="form-control"
                                    placeholder="Please Enter" onChange={this.handleFurthestLocation.bind(this)} value={this.state.detail.further_location} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label htmlFor="distance-to-furthest-location" className="col-sm-12">Distance to Furthest Location</label></div>
                            <div className="col-sm-10">
                                <input type="number" id="distance-to-furthest-location"
                                    className="form-control" onChange={this.handleDistanceToFurthestLocation.bind(this)} value={this.state.detail.distance_location} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label htmlFor="kilo" className="col-sm-12">Kilo</label></div>
                            <div className="col-sm-10">
                                <input type="number" id="kilo" 
                                    className="form-control" onChange={this.handleKilo.bind(this)} value={this.state.detail.kilo} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label htmlFor="product" className="col-sm-12">Product</label></div>
                            <div className="col-sm-10">
                                <input type="text" id="product" placeholder="Enter Product Name"
                                    className="form-control" onChange={this.handleProduct.bind(this)} value={this.state.detail.product} />

                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group" title="Charges will be calculated automatically">
                            <div><label htmlFor="petrol-charges" className="col-sm-12">Petrol Charges</label></div>
                            <div className="col-sm-10">
                                <input type="number" id="petrol-charges"
                                    className="form-control"
                                    value={this.state.detail.petrol_charges}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* <br /> */}

                    <div className="col-md-1" style={{ display: "block", float: "right", marginRight: "54px" }}>
                        <div className="form-group">

                            <div className="col-sm-10" style={{ marginTop: 20 }}>
                                <button className="btn btn-primary" type="button" onClick={this.add.bind(this)}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>

                <hr />

                <br />

                <div className="result-area col-md-12">
                    <table className="table table-bordered table-responsive">
                        <thead>
                            <tr>
                                <th>Client Officer Name</th>
                                <th>Product</th>
                                <th>FX</th>
                                <th>Furthest Location</th>
                                <th>Distance to Furthest Location</th>
                                <th>Kilo</th>
                                <th>Petrol Charges</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                this.state.petrol_detail.length <= 0 ?
                                    <tr>
                                        <td colSpan="7" className="text-center">No Data To Show</td>
                                    </tr> :

                                    this.state.petrol_detail.map((data, index) =>
                                        <tr key={index}>
                                            <td>{data.client_officer_name}</td>
                                            <td>{data.product}</td>
                                            <td>{data.fx_name}</td>
                                            <td>{data.further_location}</td>
                                            <td>{data.distance_location}</td>
                                            <td id="petrol-bm">
                                                <input type="number"
                                                    // className="kilo-type"
                                                    onChange={this.OneKiloChange.bind(this, index)}
                                                    value={data.kilo}
                                                    disabled={data.client_officer_name !== null ? false : true}></input>
                                            </td>
                                            <td>{data.petrol_charges}</td>
                                            <td><button className="btn btn-primary btn-sm" onClick={this.handleRemove.bind(this, index)}>Remove</button></td>
                                        </tr>
                                    )
                            }

                        </tbody>
                    </table>
                </div>
                <div className="col-md-12 btn-rightend">
                    <button className="btn btn-primary" id="saving_button" onClick={this.savePetrolByBm.bind(this)} ><span>Confirm</span> </button>
                </div>

            </div>

        )

    }
}

export default PetrolRequestByBm;