import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { main_url } from '../../utils/CommonFunction'
import moment from 'moment';

class HelpDeskLineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            chartData: [],
            categories: [],
            open_ticket: [],
            close_ticket: [],
            id:{
                branchId: {value: 1, label: 'All'},
                deptId: {value: 1, label: 'All'},
                },
            branchData:[],
            xAxisDept: [],
            countDataDept: [],
            deptData: [],
        }
    }
    getBranch = () => {

        fetch(main_url + `main/getBranch`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((res1) => {
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

    getHelpDeskGraphData() {
        fetch(`${main_url}dashboard/helpDeskGraph/0/0/2021-04-01/2021-04-30`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                console.log("list is ===>", list)
                if (list.length > 0) {
                    this.setState({
                        chartData: list,
                        categories: list.length > 0 && list.map(v => v.createdAt),
                        open_ticket: list.length > 0 && list.filter(v => v.ticket_status == 'Open'),
                        close_ticket: list.length > 0 && list.filter(v => v.ticket_status == 'Closed')
                    })
                    this.setChartOption()
                }
            })
    }

    componentDidMount() {
        this.getHelpDeskGraphData()
        this.getBranch()
        this.getDesignation()
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
                categories: this.state.categories,
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

                // data: [11, 22, 9, 3, 1, 30, 5, 45, 6, 20, 5, 11],
                data: this.state.open_ticket.map(v => v.total),
                marker: {
                    enabled: false
                }
            }, {
                name: 'Tickets closed',

                // data: [3, 2, 1, 23, 5, 8, 45, 22, 32, 10, 42, 11],
                data: this.state.close_ticket.map(v => v.total),
                marker: {
                    enabled: false
                }
            }
            ]
        }

        this.setState({ chartOptions })
    }
    render() {
        // console.log("open ticket is ===>", this.state.open_ticket.mao)
        // console.log('chart data is ===>', this.state.chartData.length > 0 && this.state.chartData.map(v => moment(v.createdAt).format('YYYY-MM-DD')))
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
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
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
                            })
                        }}
                        placeholder="From Date"
                        options={[]}
                        onChange={(val) => console.log(val)}
                        value={null}
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
                            })
                        }}
                        placeholder="To Date"
                        options={[]}
                        onChange={(val) => console.log(val)}
                        value={null}
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
                            })
                        }}
                        placeholder="Branch"
                        options={this.state.branchData}
                        onChange={this.handleSelectedBranch}
                        value={this.state.id.branchId}
                        className="react-select-container"
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
                            })
                        }}
                        placeholder="Department"
                        options={this.state.deptData}
                        onChange={this.handleSelectedDepartment}
                        value={this.state.id.deptId}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />

                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }}>Search</button>
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