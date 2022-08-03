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
             branchId: 0,
            departmentId: 0,
            leaveData: [],
            countData: [],
            chartData: []
        }
    }


    async componentDidMount() {
        await this.setChartOption();
        await this.leaveDashboard();
        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let department = await getDepartment();
        department.unshift({ label: 'All', value: 0 });
        this.setState({
            branch: branch,
            department: department,
        })
    }

    async leaveDashboard(branchId,departmentId) {
        fetch(`${main_url}dashboard/leaveDashboard/${branchId}/${departmentId} `)
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
                type: 'bar',
                height: '350px',
            },
            title: {
                text: '',
            },
            xAxis: {
                // categories: ['Leave Without Pay', 'Maternity Leave', 'Paternity Leave', 'Compassionate Leave', 'Medical Leave', 'Earned Leave', 'Casual Leave'],
                categories: this.state.leaveData,
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
                name: 'Leave Count by Category',
                colorByPoint: true,
                data: this.state.countData,
                colors: ['#1f4545', '#3d86dy', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5']
            }]
        }

        this.setState({ chartOptions })
    }
    handleSelectedBranch = async (event) => {
       
       
        this.setState({
           branchId : event
        })
    }
    onClickLeaveCountSearch = () => {
        this.leaveDashboard(this.state.branchId.value == undefined ? this.state.branchId : this.state.branchId.value,this.state.departmentId.value == undefined ? this.state.departmentId : this.state.departmentId.value);
    }
    handleSelectedDepartment = async (event) => {
       
        this.setState({
           departmentId: event
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

                <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>Leave Count by Categorey</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px' }}>
                    <div style={{textAlign:'start'}}>
                        <label htmlFor="">Branch</label>
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                //   flex: 1
                                width: 90
                            }),
                            control: base => ({
                                ...base,
                                minHeight: '18px'
                            }),

                        }}
                        placeholder="All"
                        options={this.state.branch}
                        onChange={this.handleSelectedBranch.bind(this)}
                        value={this.state.branchId}
                        className='react-select-container'
                        classNamePrefix="react-select"
                    />
                    </div>
                    <div style={{ textAlign:'start'}}>
                        <label htmlFor="">Department</label>
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                //   flex: 1
                                width: 90,
                                marginLeft: 10
                            }),
                            control: base => ({
                                ...base,
                                minHeight: '18px'
                            }),

                        }}
                        placeholder="All"
                        options={this.state.department}
                        onChange={this.handleSelectedDepartment.bind(this)}
                        value={this.state.departmentId}
                        className='react-select-container'
                        classNamePrefix="react-select"
                    />
                    </div>
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

export default LeaveCounrBarChart;
