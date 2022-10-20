import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import moment from 'moment';
import DatePicker from 'react-datetime';
import { getBranch, getDepartment, main_url, getFirstDayOfMonth } from '../../utils/CommonFunction';
import { region } from 'caniuse-lite';

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
            branchId: 0,
            regionId:0,
            departmentId: 0,
            resignData: [],
            resignCount: [],
            exitStaffData: [],
            exitStaffCount: [],
            selected_branch:null,
            selected_region:null,
            selected_department:null,
            selected_checkbox:2
        }
    }


    async componentDidMount() {
        await this.setChartOption();
        await this.getResignData();
        await this.getExitStaffData();
        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let department = await getDepartment();
        department.unshift({ label: 'All', value: 0 });
        this.setState({
            branch: branch,
            department: department,
        })
    }
    handleRegionCheckbox=async (event)=>{
        this.setState({
            selected_region:event.target.value
        })
    }
    handleBranchCheckbox=async (event)=>{
        this.setState({
            selected_branch:event.target.value
        })
    }
    handleDepartmentCheckbox=async (event)=>{
        this.setState({
            selected_department:event.target.value
        })
    }
    handleCheckbox=async (event)=>{
        let regionId=event.target.value ==2 ? 2 : 0
        let branchId=event.target.value == 3 ? 3 : 0
        let departmentId=event.target.value ==4 ? 4 : 0
        fetch(`${main_url}dashboard/resignRegion/${regionId}/${branchId}/${departmentId}/${moment(this.state.fromDate).format('YYYY-MM-DD')}/${moment(this.state.toDate).format('YYYY-MM-DD')} `)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    var label = [];
                    var count = [];
                    
                        res.map((v, i) => {
                            label.push(v.designations ? v.designations: v.state_name ? v.state_name : v.branch_name);
                            count.push(v.count)
                        })
                    


                    this.setState({ resignData: label, resignCount: count })
                }
                this.setChartOption()
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
        this.setState({
            selected_checkbox:event.target.value
        })
    }
    async getResignData() {
        let regionId=this.state.selected_checkbox ==2 ? 2 : 0
        let branchId=this.state.selected_checkbox == 3 ? 3 : 0
        let departmentId=this.state.selected_checkbox ==4 ? 4 : 0
        fetch(`${main_url}dashboard/resignRegion/${regionId}/${branchId}/${departmentId}/${moment(this.state.fromDate).format('YYYY-MM-DD')}/${moment(this.state.toDate).format('YYYY-MM-DD')} `)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                console.log('resignData ===>', res)
                if (res) {
                    var label = [];
                    var count = [];
                    
                        res.map((v, i) => {
                            label.push(v.designations ? v.designations: v.state_name ? v.state_name : v.branch_name);
                            count.push(v.count)
                        })
                    


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
                data: this.state.resignCount,
                colors: ['#1f4545', '#000000', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5'],
                
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
                data: this.state.exitStaffCount,
                colors: ['#1f4545', '#000000', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5']

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
    // handleSelectedBranch = async (event) => {
      
    //     this.setState({
    //         branchId: event.target.value
    //     })
    // }
    

    // handleSelectedDepartment = async (event) => {
       
    //     this.setState({
    //         departmentId:event.target.value
    //     })
    // }
    // handleSelectedRegion=async (event)=>{
    //     this.setState(
    //        { regionId:event.target.value}
    //     )
    // }

    onClickResignStaffSearch = () => {
        this.getResignData();
    }
    onClickExitStaffSearch = () => {
        this.getExitStaffData();
    }

    render() {
        console.log('data is ===>', this.state.branchId, this.state.departmentId)
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
                    
                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px' }}>
                    <div style={{ textAlign:'start'}}>
                            <label htmlFor="">Start Date</label>
                        <DatePicker className='fromdate'

                        dateFormat="DD/MM/YYYY"
                        value={this.state.fromDate}
                        onChange={this.handleFromDate}
                        timeFormat={false} />
                        </div>
                        <div style={{ textAlign:'start'}}>
                            <label htmlFor="">End Date</label>
                        < DatePicker className='fromdate'
                            dateFormat="DD/MM/YYYY"
                            value={this.state.toDate}
                            onChange={this.handleToDate}
                            timeFormat={false} />
                            </div>
                        
                       
                        <button className='btn btn-primary text-center' style={{ height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.onClickResignStaffSearch()}>Search</button>
                       
                    </div>
                    <div style={{display:'flex',justifyContent:'start',alignItems:'end',marginLeft:10,marginTop:10}}>
                            <div style={{marginRight:50, height: 20}}>
                            
                            <input type="checkbox" id='region'  name='region' checked={this.state.selected_checkbox == 2 ? 'checked': ''} value='2' onChange={this.handleCheckbox}/>
                            <label for="region" style={{marginLeft: 5, marginBottom: 5}}> Region</label>
                            </div>
                            <div style={{marginRight:50, height: 20}}>
                                
                                <input type="checkbox" id='branch'  name='branch' checked={this.state.selected_checkbox == 3 ? 'checked': ''} value='3' onChange={this.handleCheckbox}/>
                                <label for='branch' style={{marginLeft: 5, marginBottom: 5}}> Branch</label>
                            </div>
                            <div style={{marginRight:50, height: 20}}>
                               
                                <input type="checkbox" id='department'  name='department' checked={this.state.selected_checkbox == 4 ? 'checked': ''} value="4" onChange={this.handleCheckbox} />
                                <label for='department'  style={{marginLeft: 5, marginBottom: 5}}> Department</label>
                            </div>
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
                    <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>No of Exit Staff(Top 5 Resign)</h3>

                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
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
