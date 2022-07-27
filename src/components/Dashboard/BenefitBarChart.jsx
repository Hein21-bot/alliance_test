import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { main_url, getFirstDayOfMonth } from "../../utils/CommonFunction";
import DatePicker from 'react-datetime';
import moment from "moment";


class BenefitBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            id: {

                deptId: { value: 1, label: 'All' },
                branchId: {value: 1, label: 'All'},
            },
            branch_id: "",
            selected_branch: [],
            xAxisDept: [],
            countDataDept: [],
            deptData: [],
            branchData:[],
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
        }
    }


    async componentDidMount() {
        
        this.setChartOption()
        this.getBenefit()

        this.filter();
        this.getBranch()
        this.getDesignation()


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
    filter() {
        let s_date = moment(this.state.s_date).format("YYYY-MM-DD");
        let e_date = moment(this.state.e_date).format("YYYY-MM-DD");
        let branch_id = Array.isArray(this.state.selected_branch)
            ? 0
            : this.state.selected_branch.value;
        this.getBenefit(
            s_date,
            e_date,

            branch_id
        );
    }

    getBenefit = (s_date, e_date) => {
        fetch(main_url +
            "dashboard/benefitExpense/" + this.state.id.branchId + "/" + this.state.id.deptId.value + "/" +
            moment(s_date).format('YYYY-MM-DD') +
            "/" +
            moment(e_date).format('YYYY-MM-DD')
        )
            .then((response) => {
                if (response.ok) return response.json();
            })
            .then((res) => {
                if (res) {
                    let data = res.filter(v => v.amount != null)
                    var label = [];
                    var count = [];
                    if (data.length < 5) {
                        label.push(null, null)
                        count.push(null, null)
                        data.map((v, i) => {
                            label.push(v.name);
                            count.push(v.amount);
                        });
                        label.push(null, null)
                        count.push(null, null)
                    } else {
                        data.map((v, i) => {
                            label.push(v.name);

                            count.push(v.amount);
                        });
                    }

                    this.setState({ xAxisDept: label, countDataDept: count });
                }
                this.setChartOption();
            })
            .catch((error) => console.error(`Fetch Error =\n`, error));

    }



    setChartOption = () => {
        const chartOptions = {
            chart: {
                type: "bar",
                height: "400px",
            },
            title: {
                text: "",
            },
            xAxis: {
                categories: this.state.xAxisDept,
                title: {
                    text: null,
                },
            },
            yAxis: {
                title: {
                    text: "Count",
                },
            },
            tooltip: {
                // valueSuffix: ' millions'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                    },
                },
            },
            legend: {
                layout: "vertical",
                align: "center",
                verticalAlign: "top",
            },
            boost: {
                useGPUTranslations: true,
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: "Benefit Expense",
                    colorByPoint: true,
                    data: this.state.countDataDept,
                    colors: ['#1f4545', '#3d86dy', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5']
                },
            ],
        };

        this.setState({ chartOptions });
    };

    render() {

        return (
            <div className='' >
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
                    <h3 className='' style={{ padding: '10px 0px 0px 0px', marginBottom: '20px' }}>Benefit Expense</h3>
                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px' }}>
                        <div style={{
                            textAlign: 'start',
                            marginLeft: '10px'
                        }}>
                            <label>Start Date</label>
                            <div style={{
                                width:'100px'
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
                            marginLeft: '10px'
                        }}>
                            <label htmlFor="">End Date</label>
                            <div style={{
                                width:'100px'
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
                                        width: 100,

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
                            textAlign: 'start',
                            marginLeft: '10px'
                        }}>
                            <label htmlFor="">Department</label>
                            <Select
                                styles={{

                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        width: 100,

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
                <div>

                </div>
            </div>
        )
    }

}
export default BenefitBarChart;
const styles={
    datepicker:{
        width:"50px !important" 
    }
};