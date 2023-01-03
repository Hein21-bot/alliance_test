import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import { main_url } from "../../../utils/CommonFunction";
import SettingHeader from "../SettingHeader";
import HolidayAddNew from "./HolidayAddNew";
import HolidayEdit from "./HolidayEdit";
import HolidayTable from "./HolidayTable";
import HolidayTimeline from "./HolidayTimeline";
import HolidayView from "./HolidayView";

export default class Holiday extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            selectedYear: 2023,
            selectedMonth: 1,
            datasource: [],
            editData:{}
        };
    }

    async componentDidMount(){
        const { selectedMonth, selectedYear } = this.state;
        const datasource = await this.getHolidaySetup(selectedMonth, selectedYear);
        this.setState({
            datasource
        })
    }

    getHolidaySetup = async(month,year) => {
        var res = await fetch(`${main_url}holidaySetup/getHoliday/${month}/${year}`);
        if (res.ok) return res.json();
        else return [];
    }

    setupForm = () => {
        this.setState({
            isAddNew: true,
            isEdit: false,
            isTable: false
        });
    };

    handleSelectMonth = (selectedMonth) => {
        this.setState({
            selectedMonth
        },() => this.goToTable())
    }

    handleSelectYear = (val) => {
        this.setState({
            selectedYear: val.value
        },() => this.goToTable())
    }

    goToTable = async() => {
        const { selectedMonth, selectedYear } = this.state;
        const datasource = await this.getHolidaySetup(selectedMonth, selectedYear);
        this.setState({
            datasource
        })
        this.setState({
            isAddNew: false,
            isView: false,
            isTable: true,
            isEdit: false,
            editData: {}
        })
    }

    goToEditForm = (data) => {
        this.setState({
            isAddnew: false,
            isTable: false,
            isView: false,
            isEdit: true,
            editData: data
        })
    }

    goToViewForm = (data) => {
        this.setState({
            isAddnew: false,
            isTable: false,
            isView: true,
            isEdit: false,
            editData: data
        })
    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            window.location.reload();
        }
        else {
            toast.error(text);
        }

    }

    render() {
        const { selectedYear,selectedMonth } = this.state;
        return (
            <div className="holiday-setup border-bottom white-bg dashboard-header">
                <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                <SettingHeader
                    pageTitle="Holiday"
                    setupForm={this.setupForm}
                    isAddNew={this.state.isAddNew}
                    isView={this.state.isView}
                    isEdit={this.state.isEdit}
                    permission={{ isAddNew: true }}
                />
                <div className="row margin-y" >
                    <HolidayTimeline 
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        month_options={month_options}
                        handleSelectMonth={this.handleSelectMonth}
                        handleSelectYear={this.handleSelectYear}
                    />
                     {
                    this.state.isTable ?
                        <HolidayTable
                            data={this.state.datasource}
                            selectedMonth={month_options.find(v=> v.value === selectedMonth).label}
                            goToEditForm={this.goToEditForm}
                            goToViewForm={this.goToViewForm}
                        /> : ''
                }
                {
                    this.state.isAddNew ?
                        <HolidayAddNew
                            goToTable={this.goToTable}
                            data={this.state.datasource}
                            showToast={this.showToast}
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                        /> : ''
                }
                {
                    this.state.isView ?
                        <HolidayView
                            goToTable={this.goToTable}
                            data={this.state.editData}
                        /> : ''
                }
                {
                    this.state.isEdit ?
                        <HolidayEdit
                            goToTable={this.goToTable}
                            data={this.state.editData}
                            showToast={this.showToast}
                        /> : ''
                }
                </div>
            </div>
        );
    }
}


const month_options = [
    { label: 'January', value: 1},
    { label: 'February', value: 2},
    { label: 'March', value: 3},
    { label: 'April', value: 4},
    { label: 'May', value: 5},
    { label: 'June', value: 6},
    { label: 'July', value: 7},
    { label: 'August', value: 8},
    { label: 'September', value: 9},
    { label: 'October', value: 10},
    { label: 'Novenber', value: 11},
    { label: 'December', value: 12},
]


const tableData = [
    {event_name: 'test 1', start_date: '04-01-2022', end_date: '04-01-2022', holiday_count: 2, remark: 'remark 1'},
    {event_name: 'test 2', start_date: '04-01-2022', end_date: '04-01-2022', holiday_count: 3, remark: 'remark 2'}
]