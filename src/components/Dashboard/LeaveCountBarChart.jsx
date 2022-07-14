import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { getBranch, getDepartment, main_url } from '../../utils/CommonFunction';
class LeaveCounrBarChart extends Component {
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
            countData:[],
            chartData: []
        }
    }


    async componentDidMount() {
        await this.setChartOption();
        await this.leaveDashboard()
        let branch = await getBranch();
        let department = await getDepartment();
        this.setState({
            branch: branch,
            department: department
        })
    }

    // async componentDidUpdate(prevProps, prevState) {

    //     if (preveState.leaveData.length>0 && prevState.leaveData !== this.state.leaveData) {
    //         // await this.leaveDashboard()
    //         console.log('ewrwerw',this.state.leaveData)
    //     }
    // }

    async leaveDashboard() {
        fetch(`${main_url}dashboard/leaveDashboard/${this.state.data.branchId}/${this.state.data.departmentId} `)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                console.log('>>>>>>d',res)
                if (res) {
                    var label = [];
                    var count = [];
                    res.map((v,i) => {
                        label.push(v.leave_category);
                        count.push(v.count)
                    })
                    
                    this.setState({ leaveData: label, countData:count })
                }
                this.setChartOption()
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }
    setChartOption = async () => {
        const chartOptions = {
            chart: {
                type: 'bar',
                height: '250px',
            },
            title: {
                text: '',
            },
            xAxis: {
                // categories: ['Leave Without Pay', 'Maternity Leave', 'Paternity Leave', 'Compassionate Leave', 'Medical Leave', 'Earned Leave', 'Casual Leave'],
                categories:  this.state.leaveData,
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
                name: 'Leave Count by Deapartment',
                data: this.state.countData
            }]
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
                    padding: '2px 0px 2px 0px'
                }}
            >
                {console.log('drt>>>>',this.state.department)}
                <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>Leave Count by Deapartment</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
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
                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }}>Search</button>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.chartOptions}
                    containerProps={{ className: "w-100" }} />
            </div>

        )
    }

}

export default LeaveCounrBarChart;
