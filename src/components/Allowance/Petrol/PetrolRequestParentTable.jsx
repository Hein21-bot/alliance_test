import React, { Component } from 'react';
import Select from 'react-select';
import { main_url, getCookieData } from '../../../utils/CommonFunction';
import PetrolRequestByBmTable from "./PetrolRequestByBmTable";
import PetrolRequestByEmployeeTable from "./PetrolRequestByEmployeeTable";


export default class PetrolRequestParentTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_info: getCookieData("user_info"),
            dataSource: [],
            permission_bm: this.props.permission_bm,
            permission_staff: this.permission_staff,
            PetrolOptions: [
                { value: 1, label: 'Petrol By BM' },
                { value: 2, label: 'Petrol By Employee' }
            ],

            selectedRequest: {
                value: 1, label: 'Petrol By BM'
            },

            //for startup display purpose
            isBM: true,
            isEmployee: false
        };

        this.handlePetrolRequestType = this.handlePetrolRequestType.bind(this);
    }

    componentDidMount() {
        this._getPetrolBmData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.permission_bm !== this.props.permission_bm || prevProps.permission_staff !== this.props.permission_staff) {
            console.log("hello")
            this.setState({
                permission_bm: this.props.permission_bm,
                permission_staff: this.props.permission_staff
            })
        }
    }

    handlePetrolRequestType(event) {
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

    _getPetrolBmData() {
        fetch(main_url + "allowance/getPetrolBmData/" + this.state.user_info.user_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ dataSource: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }


    render() {
        return (
            <div>
                <div className="row  border-bottom white-bg dashboard-header">
                    <div className="row btn-rightend" style={{ marginTop: 18 }}>
                        <div className="col-md-4">
                            <Select
                                options={this.state.PetrolOptions}
                                placeholder="Please Choose Petrol Request Type"
                                onChange={this.handlePetrolRequestType}
                                value={this.state.selectedRequest}
                            />
                        </div>
                    </div>

                    <div>

                        {
                            this.state.isBM ?
                                <PetrolRequestByBmTable data={this.state.dataSource} goToViewForm={this.props.goToBMViewForm}
                                    goToEditForm={this.props.goToBMEditForm} permission={this.state.permission_bm}
                                /> :
                                <PetrolRequestByEmployeeTable data={this.props.data} goToViewForm={this.props.goToEmployeeViewForm}
                                    goToEditForm={this.props.goToEmployeeEditForm} permission={this.state.permission_staff}
                                />
                        }

                    </div>

                </div>

            </div >
        )
    }
}

