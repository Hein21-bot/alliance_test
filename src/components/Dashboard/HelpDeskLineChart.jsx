import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { main_url, getFirstDayOfMonth } from "../../utils/CommonFunction";
import DatePicker from 'react-datetime';
import moment from "moment";
import { format } from 'date-fns-tz';


class HelpDeskLineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            chartData: [],
            categories: [],
            open_ticket: [],
            close_ticket: [],
            id: {
                branchId: { value: 0, label: 'All' },
                deptId: { value: 0, label: 'All' },
            },
            branchData: [],
            xAxisDept: [],
            countDataDept1: [],
            countDataDept2:[],
            deptData: [],
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
        }
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
    filter() {
        let s_date = moment(this.state.s_date).format("YYYY-MM-DD");
        let e_date = moment(this.state.e_date).format("YYYY-MM-DD");

        this.getHelpDeskGraphData(
            s_date,
            e_date,


        );
    }
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


    getHelpDeskGraphData(s_date, e_date) {
        // fetch(`${main_url}dashboard/helpDeskGraph/0/0/2021-04-01/2021-04-30`)
        fetch(main_url +
            "dashboard/helpDeskGraph/" + this.state.id.branchId.value + "/" + this.state.id.deptId.value + "/" +
            moment(s_date).format('YYYY-MM-DD') +
            "/" +
            moment(e_date).format('YYYY-MM-DD')
        )
            .then(res => { if (res.ok) return res.json() })
            .then((res) => {

                
                if (res) {
                    let collected = res.map((v, i) => {
                        let result = {
                            openValue: 0,
                            closeValue: 0,
                            createdAt: v.createdAt
                        }
                        if(v.ticket_status == "Open"){
                            result.openValue = v.total;
                        }else{
                            result.closeValue = v.total;
                        }
                       return result;
                    });
                    let openArr = collected.map(v=>v.openValue);
                    let closeArr = collected.map(v=>v.closeValue);
                    let label=collected.map(v=>v.createdAt)

                    this.setState({ xAxisDept:label, countDataDept1: openArr,countDataDept2:closeArr });

                }
                this.setChartOption();
            })
            .catch((error) => console.error(`Fetch Error =\n`, error));

    }

    componentDidMount() {
        this.getHelpDeskGraphData()
        this.getBranch()
        this.getDesignation()
        // this.filter()
    }

    setChartOption = () => {
        const chartOptions = {
            chart: {
                type: 'line',
                height: '250px',

            },
            title: {
                text: '',
            },

            xAxis: {
                categories: this.state.xAxisDept,
                // categories:moment(this.state.xAxisDept).subtract(1, "month").startOf("month").format('MMMM'),
                // categories: this.state.chartData.length > 0 && this.state.chartData.map(v => v.createdAt),
                title: {
                    text: null
                }

            },
            yAxis: {
                title: {
                    text: 'Tickets created and Tickets closed',
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
                name: 'Tickets created',

                

                
                data: this.state.countDataDept1,
                marker: {
                    enabled: false
                }
            }
                , {
                    name: 'Tickets closed',

                    // data: [3, 2, 1, 23, 5, 8, 45, 22, 32, 10, 42, 11],
                    data: this.state.countDataDept2,
                    marker: {
                        enabled: false
                    }
                }
            ]
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
                    padding: '2px 0px 2px 0px',
                    marginTop: '20px'
                }}
            >
                <h3 className='' style={{ padding: '10px 0px 0px 0px', marginBottom: '20px' }}>Tickets By Month</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px',flexWrap:'wrap' }}>
                    <div style={{
                        textAlign: 'start',
                        marginRight: '10px'
                    }}>
                        <label htmlFor="">Start Date</label>
                        <div style={{
                            width: '90px'
                        }}>
                            <DatePicker
                                dateFormat="DD/MM/YYYY"
                                value={this.state.s_date}
                                onChange={this.handleStartDate}
                                timeFormat={false}
                            />
                        </div>
                    </div>
                    <div style={{
                        textAlign: 'start',
                        marginRight: '10px'
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
                        marginRight: '10px'
                    }}>
                        <label htmlFor="">Branch</label>
                        <Select
                            styles={{
                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 80,

                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                })
                            }}
                            placeholder="Branch"
                            options={this.state.branchData}
                            onChange={this.handleSelectedBranch}
                            value={this.state.id.branchId}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div style={{
                        textAlign: 'start'
                    }}>
                        <label htmlFor="">Department</label>
                        <Select
                            styles={{

                                container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 80,

                                }),
                                control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                })
                            }}
                            placeholder="Department"
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
        );
    }
}

export default HelpDeskLineChart;