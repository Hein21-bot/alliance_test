import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { getBranch, getDepartment, main_url, getRegion } from '../../utils/CommonFunction';
class AttendenceBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            branch: [],
            region: [],
            department: [],
            data: {
                branchId: 0,
                departmentId: 0,
            },
            regionId: { value: 3, label: 'Mandalay Region' },
            leaveData: [],
            countData: [],
            chartData: [],
            absent_count: [],
            attandance_count: [],
            late_count: []
        }
    }


    async componentDidMount() {
        await this.setChartOption();
        await this.attendenceDashboard(0, 0);
        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let region = await getRegion();
        region.unshift({ state_name: 'All', state_id: 0 });
        let department = await getDepartment();
        department.unshift({ label: 'All', value: 0 });
        this.setState({
            branch: branch,
            department: department,
            region: region,
            region: region.map((v) => ({
                ...v,
                label: v.state_name,
                value: v.state_id,
            })),
        })
    }

    async attendenceDashboard(branchId, departmentId) {
        fetch(`${main_url}dashboard/attendanceReport/${this.state.data.branchId.value == undefined ? this.state.data.branchId : this.state.data.branchId.value}/${this.state.data.departmentId.value == undefined ? this.state.data.departmentId : this.state.data.departmentId.value}/${this.state.regionId.value == undefined ? this.state.regionId : this.state.regionId.value} `)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                let data = res;

                let arr = data.map((v, i) => {
                    const formatData = v.data.reduce((r, c, i) => {
                        if (i == 1) {
                            const attendance = c.attendance ? c.attendance : 0;
                            return { ...r, ...c, attendance }
                        }
                        const late = c.late ? c.late : 0
                        return { ...r, ...c, late }
                    }, {})
                    return formatData;
                });
                let absent_count = arr.map(v => {
                    let count = v.all - (v.attendance == undefined ? 0 : v.attendance) - (v.late == undefined ? 0 : v.late);
                    return count;
                })
                let attandance_count = arr.map(v => {
                    return v.attendance == undefined ? 0 : v.attendance;// v.data[1].attendance ? v.data[1].attendance : 0
                })
                let late_count = arr.map(v => {
                    return v.late == undefined ? 0 : v.late;// v.data[2].late ?v.data[2].late : 0
                })
                if (res) {
                    var label = [];
                    var count = [];
                    res.map((v, i) => {
                        label.push(v.location_master_name);
                        count.push(v.count)
                    })

                    this.setState({ attendanceData: label, countData: count, absent_count, late_count, attandance_count })

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
                // categories: ['Mandalay', 'Zaycho', 'ChanMyaTharSi', 'PyiGyiDagon', 'Madaya', 'LetPanHa', 'TadaU','AungMyayTharZan','OhnChaw','PyinOoLwin','NaungCho','Sitgaing','Kyaukse','Amarapura','Myint Nge'],
                categories: this.state.attendanceData,
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
                    name: "Attendance",
                    data: this.state.attandance_count
                },
                {
                    color: '#5c7c9f',
                    name: "Late Attendance",
                    data: this.state.late_count
                },
                {
                    color: '#9bcece',
                    name: "Absent",
                    data: this.state.absent_count
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
        this.attendenceDashboard(this.state.data.branchId.value == undefined ? this.state.data.branchId : this.state.data.branchId.value, this.state.data.departmentId.value == undefined ? this.state.data.departmentId : this.state.data.departmentId.value);
    }
    handleSelectedDepartment = async (event) => {
        let data = this.state.data
        data.departmentId = event
        this.setState({
            data: data
        })
    }
    handleSelectedRegion = async (event) => {
        this.setState({
            regionId: event,
        });
    };

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
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px' }}>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: 10
                    }}>
                        <label htmlFor="">Region</label>
                        <Select
                            styles={{
                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 150,
                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px',
                                }),
                            }}
                            placeholder="All"
                            options={this.state.region}
                            onChange={this.handleSelectedRegion}
                            value={this.state.regionId}
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: 10
                    }}>
                        <label htmlFor="">Branch</label>
                        <Select
                            styles={{

                                container: (base) => ({
                                    ...base,
                                    //   flex: 1
                                    width: 150,
                                }),
                                control: (base) => ({
                                    ...base,
                                    minHeight: "18px"

                                }),
                            }}
                            placeholder="All"
                            options={this.state.branch}
                            onChange={this.handleSelectedBranch}
                            value={this.state.data.branchId}
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div style={{
                        textAlign: 'start',
                        marginLeft: 10
                    }}>
                        <label htmlFor="">Department</label>
                        <Select
                            styles={{
                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 150,


                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px',



                                }),

                            }}
                            placeholder="All"
                            options={this.state.department}
                            onChange={this.handleSelectedDepartment}
                            value={this.state.data.departmentId}
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

export default AttendenceBarChart;
