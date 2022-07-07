import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'

class HeadCountBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOptions: {}
        }
    }

    componentDidMount() {
        this.setChartOption()
    }

    setChartOption = () => {
        const chartOptions = {
            chart: {
                type: 'bar',
                height: '250px',
            },
            title: {
                text: '',
            },
            xAxis: {
                categories: ['Risk', 'Traning', 'Intemal Audit', 'IT', 'Operation', 'Finance', 'Admin', 'HR'],
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
                name: 'Head Count by Deapartment',
                data: [15, 10, 35, 17, 80, 18, 20, 25]
            }]
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
                    padding: '2px 0px 2px 0px'
                }}
            >
                <h3 className='' style={{ padding: '10px 0px 0px 0px' }}>Head Count by Deapartment</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 0px 10px' }}>
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
                            })
                        }}
                        placeholder="Branch"
                        options={[]}
                        onChange={(val) => console.log(val)}
                        value={null}
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

export default HeadCountBarChart;
