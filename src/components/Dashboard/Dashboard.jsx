import React, { Component } from 'react'
import ReactDatePicker from 'react-datepicker';
import EmployeePieChart from './EmployeePieChart';
import { getMacAddress, getMacAddress1 } from './getMac';
import HeadCountBarChart from './HeadCountBarChart';
import { LeaveCalendar } from './LeaveCalendar';
import ThingsTodoTable from './ThingsTodoTable';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        //   const a = await getMacAddress();
        //   console.log('a', a)

        //   const b = await getMacAddress1();
    }

    render() {

        return (
            <div style={{}}>
                <h3>Dashboard</h3>
                {/* <LeaveCalendar /> */}
                <div className='row' style={{}}>
                    <div className='col-md-6'>
                        <ThingsTodoTable />
                    </div>
                    <div className='col-md-6'>
                        <LeaveCalendar />
                    </div>
                </div>
                <div className='row' style={{}}>
                    <div className='col-md-6'>
                        <HeadCountBarChart />
                    </div>
                    <div className='col-md-6'>
                        <EmployeePieChart />
                    </div>
                </div>

            </div>
        )
    }
}
