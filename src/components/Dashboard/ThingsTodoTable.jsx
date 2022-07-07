import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class ThingsTodoTable extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div
                className=''
                style={{
                    background: '#fff',
                    color: '#222',
                    boxShadow: '3px 3px 3px #e5e5e5',
                    borderRadius: 6,
                    padding: '2px 0px 2px 0px',
                    margin: '10px 0px'
                }}
            >
                <div className='' style={{ margin: '10px 15px 0px', display: 'flex' }}>
                    <i style={{ fontSize: 22, color: '#1872ab', fontWeight: 'bold' }} className="fa fa-file-text-o" aria-hidden="true"></i>
                    <h3 style={{ paddingLeft: 8 }}>Things To Do</h3>
                </div>
                <div style={{ maxHeight: 250, overflowY: 'scroll', margin: '5px 0px' }}>
                {
                    dummy_data.map((v, k) => (
                        <div key={k} className='row' style={{ boxShadow: '1px 1px 3px 1px #e6e6e6', borderRadius: 4, margin: '5px 10px', padding: '10px', display: 'flex', alignItems: 'center' }}>
                            <div className='col-md-2 text-center text-white'><div style={{ background: '#1872ab', borderRadius: 20, width: 25, height: 25, padding: '3.2px 0px' }}>{v.count}</div></div>
                            <div className='col-md-7'>{v.request}</div>
                            <div className='col-md-3'>
                                <button className='btn text-center' onClick={()=> this.props.history.push(v.link)} style={{ height: 22, padding: '0px 5px 0px 5px', fontSize: 12 }}>
                                    More Info
                                    <i class="fa fa-arrow-circle-right" style={{ marginLeft: 5 }} aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    ))
                }
</div>
            </div>
        )
    }
}

export default withRouter(ThingsTodoTable);

const dummy_data = [
    { request: 'Leave Request', count: 15, link:'/leave_management' },
    { request: 'Travel Request', count: 10, link:'/travelRequest'},
    { request: 'Medical Request', count: 0, link:'/medical_benefit'},
    { request: 'External Traning Request', count: 8, link:'/external_training_benefit'},
    { request: 'Wedding Request', count: 2, link:'/wedding_benefit'},
    { request: 'Child Request', count: 6, link:'/child_benefit'},
    { request: 'Salary Advance Request', count: 4, link:'/salary_advance'},
    { request: 'Phone Bill Request', count: 1, link:'/phonebillrequest'},
    { request: 'Petrol Request', count: 0, link:'/petrolRequest'},
    { request: 'Bithday Fund Request', count: 9, link:'/birthday_fund_benefit'},
]