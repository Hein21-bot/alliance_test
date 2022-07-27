import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import moment from 'moment';
import DatePicker from 'react-datetime';
import { getBranch, getDepartment, main_url, getFirstDayOfMonth } from '../../utils/CommonFunction';

//resignRegion/branch/department/startDate/endDate
//resignExitStaff/startDate/endDate 

class ResignBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            exitStaffOptions: {},
            branch: [],
            department: [],
            toDate: new Date(),
            fromDate: getFirstDayOfMonth(),
            exitToDate: new Date(),
            exitFromDate: getFirstDayOfMonth(),
            data: {
                branchId: 0,
                departmentId: 0
            },
            resignData: [],
            resignCount: [],
            exitStaffData: [],
            exitStaffCount: [],
        }
    }


    async componentDidMount() {
        await this.setChartOption();
        await this.getResignData();
        await this.getExitStaffData();
        let branch = await getBranch();
        branch.unshift({ label: 'All', vlaue: 0 });
        let department = await getDepartment();
        department.unshift({ label: 'All', vlaue: 0 });
        this.setState({
            branch: branch,
            department: department,
        })
    }

    async getResignData() {
        fetch(`${main_url}dashboard/resignRegion/${this.state.data.branchId.value}/${this.state.data.departmentId.value}/${moment(this.state.fromDate).format('YYYY-MM-DD')}/${moment(this.state.toDate).format('YYYY-MM-DD')} `)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                console.log('resignData ===>', res)
                if (res) {
                    var label = [];
                    var count = [];
                    if (res.length < 5) {
                        label.push(null, null)
                        count.push(null, null)
                        res.map((v, i) => {
                            label.push(v.branch_name);
                            count.push(v.count)
                        })
                        label.push(null, null)
                        count.push(null, null)
                    } else {
                        res.map((v, i) => {
                            label.push(v.branch_name);
                            count.push(v.count)
                        })
                    }


                    this.setState({ resignData: label, resignCount: count })
                }
                this.setChartOption()
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    async getExitStaffData() {
        fetch(`${main_url}dashboard/resignExitStaff/${moment(this.state.exitFromDate).format('YYYY-MM-DD')}/${moment(this.state.exitToDate).format('YYYY-MM-DD')}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                console.log('exitStaffData ===>', res)
                if (res) {
                    var label = [];
                    var count = [];
                    if (res.length < 5) {
                        label.push(null, null)
                        count.push(null, null)
                        res.map((v, i) => {
                            label.push(v.branch_name);
                            count.push(v.count)
                        })
                        label.push(null, null)
                        count.push(null, null)
                    } else {
                        res.map((v, i) => {
                            label.push(v.branch_name);
                            count.push(v.count)
                        })
                    }
                    this.setState({ exitStaffData: label, exitStaffCount: count })
                }
                // this.setChartOption()
                this.setExitStaffOption()
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    setChartOption = async () => {
        const chartOptions = {
            chart: {
                type: 'bar',
                height: '350px',
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: this.state.resignData,
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
                enabled: false,
            },
            boost: {
                useGPUTranslations: true
            },
            credits: {
                enabled: false
            },
            series: [{
                colorByPoint: true,
                data: this.state.resignCount
            }]
        }

        this.setState({ chartOptions: chartOptions })
    }
    setExitStaffOption = async () => {
        const exitStaffOptions = {
            chart: {
                type: 'bar',
                height: '350px',
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: this.state.exitStaffData,
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
                enabled: false,
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
                colorByPoint: true,
                data: this.state.exitStaffCount
            }]
        }

        this.setState({ exitStaffOptions: exitStaffOptions })
    }
    handleToDate = (event) => {
        this.setState({
            toDate: event
        });
    };
    handleFromDate = (event) => {
        this.setState({
            fromDate: event
        });
    };
    handleExitToDate = (event) => {
        this.setState({
            exitToDate: event
        });
    };
    handleExitFromDate = (event) => {
        this.setState({
            exitFromDate: event
        });
    };
    handleSelectedBranch = async (event) => {
        let data = this.state.data
        data.branchId = event
        this.setState({
            data: data
        })
    }

    handleSelectedDepartment = async (event) => {
        let data = this.state.data
        data.departmentId = event
        this.setState({
            data: data
        })
    }

    onClickResignStaffSearch = () => {
        this.getResignData();
    }
    onClickExitStaffSearch = () => {
        this.getExitStaffData();
    }

    render() {
        console.log('data is ===>', this.state.data.branchId, this.state.data.departmentId)
        return (

            <div
                className='text-center margin-y'
                style={{

                    color: '#222',
                    // boxShadow: '3px 3px 3px #e5e5e5',
                    borderRadius: 6,
                    padding: '2px 0px 2px 0px',

                }}
            >
                <div
                    className='text-center margin-y'
                    style={{
                        background: '#fff',
                        color: '#222',
                        boxShadow: '3px 3px 3px #e5e5e5',
                        borderRadius: 6,
                        padding: '2px 0px 2px 0px',

                    }}
                >
                    <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>Resign Graph</h3>

                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
                        <DatePicker className='fromdate'

                            dateFormat="DD/MM/YYYY"
                            value={this.state.fromDate}
                            onChange={this.handleFromDate}
                            timeFormat={false} />
                        < DatePicker className='fromdate'
                            dateFormat="DD/MM/YYYY"
                            value={this.state.toDate}
                            onChange={this.handleToDate}
                            timeFormat={false} />
                        <Select
                            styles={{
                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 150
                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                }),

                            }}
                            placeholder="Branch"
                            options={this.state.branch}
                            onChange={this.handleSelectedBranch}
                            value={this.state.data.branchId}
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        <Select
                            styles={{
                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 150,
                                    marginLeft: 10
                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                }),

                            }}
                            placeholder="Department"
                            options={this.state.department}
                            onChange={this.handleSelectedDepartment}
                            value={this.state.data.departmentId}
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.onClickResignStaffSearch()}>Search</button>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.chartOptions}
                        containerProps={{ className: "w-100" }} /></div>
                <div
                    className='text-center margin-y'
                    style={{
                        background: '#fff',
                        color: '#222',
                        boxShadow: '3px 3px 3px #e5e5e5',
                        borderRadius: 6,
                        padding: '2px 0px 2px 0px',
                        marginTop: "15px"

                    }}
                >
                    <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>No of Exit Staff</h3>

                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
                        <DatePicker className='fromdate'

                            dateFormat="DD/MM/YYYY"
                            value={this.state.exitFromDate}
                            onChange={this.handleExitFromDate}
                            timeFormat={false} />
                        < DatePicker className='fromdate'
                            dateFormat="DD/MM/YYYY"
                            value={this.state.exitToDate}
                            onChange={this.handleExitToDate}
                            timeFormat={false} />
                        <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.onClickExitStaffSearch()}>Search</button>
                    </div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.exitStaffOptions}
                        containerProps={{ className: "w-100" }} /></div>

            </div>

        )
    }

}

export default ResignBarChart;