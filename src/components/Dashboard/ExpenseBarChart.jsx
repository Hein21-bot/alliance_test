import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { main_url, getFirstDayOfMonth } from "../../utils/CommonFunction";
import DatePicker from 'react-datetime';
import moment from "moment";

export default class ExpenseBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            id: {
                branchId: { value: 0, label: 'All' },
                deptId: { value: 0, label: 'All' },
            },
            branchData: [],
            xAxisDept: [],
            countDataDept: [],
            deptData: [],
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),

        }
    }

    componentDidMount() {
        this.setChartOption()
        this.getBranch();
        this.getDesignation();
    }
    handleStartDate = (event) => {
        this.setState({
            s_date: event,
        });
    };

    handleEndDate = (event) => {
        this.setState({
            e_date: event,
        });
    };

    getBranch = () => {

        fetch(main_url + `main/getBranch`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((res1) => {
                res1.unshift({ label: 'All', value: 0 })
                this.setState({ branchData: res1 });

            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
    };
    handleSelectedBranch = async (event) => {
        let data = this.state.id
        data.branchId = event
        this.setState({
            id: data
        })
    };
    getDesignation = () => {
        fetch(main_url + `main/getDepartment`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((res1) => {
                res1.unshift({ label: 'All', value: 0 })
                this.setState({ deptData: res1 });
            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
    };
    handleSelectedDepartment = async (event) => {
        let data = this.state.id
        data.deptId = event
        this.setState({
            id: data
        })
    }
    getExpense() {

    }
    filter() {
        let s_date = moment(this.state.s_date).format("YYYY-MM-DD");
        let e_date = moment(this.state.e_date).format("YYYY-MM-DD");
        let branch_id = Array.isArray(this.state.selected_branch)
            ? 0
            : this.state.selected_branch.value;
        this.getTravelRequestFilter(
            s_date,
            e_date,
            this.state.user_info.user_id,
            branch_id
        );
    }

    setChartOption = () => {
        const chartOptions = {
            chart: {
                type: 'bar',
                height: '250px',
            },
            title: {
                text: '',
            },

            xAxis: {
                categories: ['Maintenance', 'Petrol', 'Salary Advance', 'Travel'],
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: 'Count',
                },
            },
            tooltip: {
                // valueSuffix: ' millions'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'center',
                verticalAlign: 'top',
            },
            boost: {
                useGPUTranslations: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Allowance Expense',
                colorByPoint: true,
                data: [15, 10, 20, 6],
                colors: ['#1f4545', '#3d86dy', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5']
            }]
        }

        this.setState({ chartOptions })
    }

    render() {
        return (
            <div
                className='text-center margin-y'
                style={{
                    background: '#fff',
                    color: '#222',
                    boxShadow: '3px 3px 3px #e5e5e5',
                    borderRadius: 6,
                    padding: '2px 0px 2px 0px'
                }}
            >
                <h3 className='' style={{ padding: '10px 0px 0px 0px', marginBottom: '20px' }}>Allowance Expense</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px' }}>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: '10px'
                    }}>
                        <label>Start Date</label>
                        <div style={{
                            width: '90px'
                        }}>
                            <DatePicker
                                dateFormat="DD/MM/YYYY"
                                value={this.state.s_date}
                                onChange={this.handleStartDate}
                                timeFormat={false} style={{

                                }}
                            />
                        </div>
                    </div>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: '10px'
                    }}>
                        <label htmlFor="">End Date</label>
                        <div style={{
                            width: '90px'
                        }}>
                            <DatePicker
                                dateFormat="DD/MM/YYYY"
                                value={this.state.e_date}
                                onChange={this.handleEndDate}
                                timeFormat={false}
                            />
                        </div>
                    </div>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: '10px'
                    }}>
                        <label htmlFor="">Branch</label>
                        <Select
                            styles={{
                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 90,

                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                })
                            }}
                            placeholder="All"
                            options={this.state.branchData}
                            onChange={this.handleSelectedBranch}
                            value={this.state.id.branchId}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: '10px'
                    }}>
                        <label htmlFor="">Department</label>
                        <Select
                            styles={{

                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 90,

                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                })
                            }}
                            placeholder="All"
                            options={this.state.deptData}
                            onChange={this.handleSelectedDepartment}
                            value={this.state.id.deptId}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={this.filter.bind(this)}>Search</button>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.chartOptions}
                    containerProps={{ className: "w-100" }} />
            </div>

        )
    }

}
