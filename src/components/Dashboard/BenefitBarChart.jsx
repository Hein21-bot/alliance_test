import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import {main_url} from '../../utils/CommonFunction' 
import CompensationandBenefit from './CompensationandBenefit';

 class BenefitBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {},
            name:[],
            amount:[],
            branchData:[],
            deptData:[]
        }
    }

    
    componentDidMount() {
        this.setChartOption()
        this.getBenefit()
        this.getBranch()
        this.getDepartment()
        
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
    getBenefit=()=>{
        fetch(main_url+'dashboard/benefitExpense',{
            method:'GET'
        }).then(res=>
            res.json()
        ).then(data=>{
            let listName = data.map(v=>v.name);
            let listAmt = data.map(v=>v.amount);
            this.setState({name: listName,amount: listAmt})
            this.setChartOption();
        })
        
    }
    getDepartment = () => {
        fetch(main_url + `main/getDepartment`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((res1) => {
            this.setState({ deptData: res1 });
          })
          .catch((error) => console.error(`Fetch Error =\n`, error));
      };

    setChartOption = () => {
        const chartOptions = {
            chart: {
                type: 'bar',
                height: '400px',
            },
            
            title: {
                text: '',
            },
           
            xAxis: {
                categories: this.state.name,
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
                name: 'Benefit Expense',
                colorByPoint:true,
                data: this.state.amount
            }]
        }

        this.setState({ chartOptions })
       
    }

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
                <h3 className='' style={{ padding: '10px 0px 0px 0px',marginBottom:'20px' }}>Benefit Expense</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                //   flex: 1
                                width: 120,
                                marginLeft:10
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
                                marginLeft:10
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
                                marginLeft:10
                            }),
                            control: base => ({
                                ...base,
                                minHeight: '18px'
                            })
                        }}
                        placeholder="Branch"
                        options={this.state.branchData}
                        onChange={(val) => this.setState({ branchId: val.value })}
                        value={this.state.branchId}
                        className='react-select-container'
                        classNamePrefix="react-select"
                    />
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                //   flex: 1
                                width: 100,
                                marginLeft:10
                            }),
                            control: base => ({
                                ...base,
                                minHeight: '18px'
                            })
                        }}
                        placeholder="Department"
                        options={this.state.deptData}
                        onChange={(val) => this.setState({ deptId: val.value})}
                        value={this.state.deptId}
                        className='react-select-container'
                        classNamePrefix="react-select"
                    />
                    <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} >Search</button>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.chartOptions}
                    containerProps={{ className: "w-100" }} />
            </div>
            <div>
                <CompensationandBenefit/>
            </div>
            </div>
        )
    }

}
export default BenefitBarChart;
