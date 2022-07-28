import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { getBranch, getDepartment, main_url } from '../../utils/CommonFunction';
class AttendenceBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            branch: [],
            department: [],
            data: {
                branchId: 0,
                departmentId: 0
            },
            leaveData: [],
            countData: [],
            chartData: []
        }
    }


    async componentDidMount() {
        await this.setChartOption();
        await this.leaveDashboard();
        let branch = await getBranch();
        branch.unshift({ label: 'All', vlaue: 0 });
        let department = await getDepartment();
        department.unshift({ label: 'All', vlaue: 0 });
        this.setState({
            branch: branch,
            department: department,
        })
    }

    async leaveDashboard() {
        fetch(`${main_url}dashboard/leaveDashboard/${this.state.data.branchId.value}/${this.state.data.departmentId.value} `)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    var label = [];
                    var count = [];
                    res.map((v, i) => {
                        label.push(v.leave_category);
                        count.push(v.count)
                    })

                    this.setState({ leaveData: label, countData: count })
                }
                this.setChartOption()
            })
                .catch(error => console.error(`Fetch Error =\n`, error));
    }
    setChartOption = async () => {
        const chartOptions = {
            chart: {
                type: 'column',
                height: '350px',
                
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: ['Mandalay', 'Zaycho', 'ChanMyaTharSi', 'PyiGyiDagon', 'Madaya', 'LetPanHa', 'TadaU','AungMyayTharZan','OhnChaw','PyinOoLwin','NaungCho','Sitgaing','Kyaukse','Amarapura','Myint Nge'],
                // categories: this.state.leaveData,
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: '',
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
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
            },
            boost: {
                useGPUTranslations: true
            },
            credits: {
                enabled: false
            },
            series: [
                    {
                    color: '#1f4545',    
                    name:"Attendance",
                    data:[10,1,3,4,8,15,1,9,6,23,16,12,14,3,14]
                    },
                    {
                    color:'#5c7c9f',
                    name:"Late Attendance",
                    data:[30,2,8,6,32,10,6,13,1,31,11,3,20,14,5]
                    },
                    {
                        color:'#9bcece',
                        name:"Absent",
                        data:[3,6,1,20,14,6,9,2,3,10,30,7,11,13,20]
                    },
            ]
        }

        this.setState({ chartOptions })
    }
    handleSelectedBranch = async (event) => {
        let data = this.state.data
        data.branchId = event
        this.setState({
            data: data
        })
    }
    onClickLeaveCountSearch = () => {
        this.leaveDashboard();
    }
    handleSelectedDepartment = async (event) => {
        let data = this.state.data
        data.departmentId = event
        this.setState({
            data: data
        })
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
                    padding: '2px 0px 2px 0px',

                }}
            >

                <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>Attendance</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                //   flex: 1
                                width: 100
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
                                width: 100,
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
                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.onClickLeaveCountSearch()}>Search</button>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.chartOptions}
                    containerProps={{ className: "w-100" }} />
            </div>

        )
    }

}

export default AttendenceBarChart;
