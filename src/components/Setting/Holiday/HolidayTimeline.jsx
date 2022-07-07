import React, { Component } from 'react'
import Select from 'react-select'

export default class HolidayTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: null
        }
    }

    render() {
        const { selectedYear,selectedMonth,month_options,handleSelectMonth,handleSelectYear } = this.props;
        return (
            <div className='col-sm-3' style={{ padding: '10px 0px' }}>
                <div className='row' style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                    <label className='col-sm-2' style={{ marginTop: 5 }}>Year</label>
                    <div className='col-sm-10'>
                        <Select
                            placeholder=""
                            options={year_options}
                            value={year_options.find(v => v.label === selectedYear)}
                            onChange={handleSelectYear}
                            className='react-select-container  checkValidate'
                            classNamePrefix="react-select" />
                    </div>
                </div>
                <div className='row' style={{ paddingTop: 10}}>
                    <div className='col-sm-12'>
                        {
                            month_options.map((v,k)=>
                            <div 
                                key={k}
                                className='' 
                                style={{ 
                                    padding: 8, 
                                    margin: '5px 0px', 
                                    borderRadius: 5, 
                                    border: '1px solid #eee',
                                    backgroundColor: selectedMonth === v.value ? '#27568A' : (v.value===this.state.hover && '#4C8BD0'),
                                    color: (selectedMonth === v.value || this.state.hover === v.value) && '#fff',
                                    boxShadow: '2px 2px 5px #ddd',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => this.setState({hover: v.value})}
                                onMouseLeave={() => this.setState({hover: null})}
                                onClick={()=>handleSelectMonth(v.value)}
                            >
                                <i className="far fa-calendar-alt" style={{ padding: '0px 12px 0px 5px', fontSize: 16 }}></i>
                                <span>{v.label}</span>
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}


const year_options = [
    { label: 2022, value: 2022 },
    { label: 2021, value: 2021 }
]
