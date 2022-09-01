import React, { Component } from 'react';
import io from 'socket.io-client';
import { main_url, remote_url, removeCookieData, getUserId } from '../../utils/CommonFunction';
import { withRouter } from 'react-router-dom';
import { getCookieData } from "../../utils/CommonFunction";




const id = getUserId("user_info");
const socket_noti = io(`${main_url}hrms_noti?user_id=${id}`);


class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: getCookieData("user_info"),
            noti_count: 0,
            time: '',
            benefit_allownace_noti_count: 0,
            benefit_allownace_time: '',
            count: 0
        }

    }

    

    componentDidMount() {
        try {
            this.getNotiCount();
            socket_noti.on('noti', count => {
                this.setState({
                    noti_count: count.count,
                    time: count.time
                })
            })
            this.getNotiCountForOneUser_child();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    benefit_allownace_noti_count: count.count,
                    benefit_allownace_time: count.time
                })
            })
            //@kpk
            this.getNotiCountForOneUser_wedding();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    wedding_benefit_count: count.count,
                    wedding_benefit_time: count.time
                })
            })
            //@kpk
            this.getBenefitNotiCount_funeral();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    funeral_benefit_count: count.count,
                    funeral_benefit_time: count.time
                })
            })
            //@kpk
            this.getBenefitNotiCount_external();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    external_benefit_count: count.count,
                    external_benefit_time: count.time
                })
            })
            //@kpk
            this.getBenefitNotiCount_medical();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    medical_benefit_count: count.count,
                    medical_benefit_time: count.time
                })
            })

            //@kpk
            this.getBenefitNotiCount_teamBuilding();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    teamBuilding_benefit_count: count.count,
                    teamBuilding_benefit_time: count.time
                })
            })

            //@kpk
            this.getBenefitNotiCount_other();
            socket_noti.on('benefit_and_allowance_noti', count => {
                this.setState({
                    other_benefit_count: count.count,
                    other_benefit_time: count.time
                })
            })
            // this.handleClick = this.handleClick().bind(this);
            // this.handleClickThrottled = throttle(this.handleClick, 1000);


        } catch (error) {
            console.log(error);
        }
    }

    getNotiCount = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    noti_count: data.count,
                    time: data.time
                })
            })
    }
    // @hmh
    // child_benefit

    getNotiCountForOneUser_child = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_child/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    benefit_allowance_noti_count: data.count,
                    benefit_allownace_time: data.time
                })
            })
    }

    readNoti = () => {
        this.props.history.push("/notification")        
        setTimeout(() => {
            fetch(`${main_url}noti/readNotiBenefit`)
            window.location.reload()
            
        }, 3000);

        // const query = queryString.parse(window.location.search)
        // if (window.location.pathname !== '/notification') {

    }

    //@kpk
    getNotiCountForOneUser_wedding = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_wedding/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    wedding_benefit_count: data.count,
                    wedding_benefit_time: data.time
                })
            })
    }
    //@kpk
    getBenefitNotiCount_funeral = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_funeral/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    funeral_benefit_count: data.count,
                    funeral_benefit_time: data.time
                })
            })
    }
    //@kpk
    getBenefitNotiCount_external = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_external/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    external_benefit_count: data.count,
                    external_benefit_time: data.time
                })
            })
    }
    //@kpk
    getBenefitNotiCount_medical = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_medical/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    medical_benefit_count: data.count,
                    medical_benefit_time: data.time
                })
            })
    }

    //@kpk
    getBenefitNotiCount_teamBuilding = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_teamBuilding/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    teamBuilding_benefit_count: data.count,
                    teamBuilding_benefit_time: data.time
                })
            })
    }
    //@kpk
    getBenefitNotiCount_other = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_other/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    other_benefit_count: data.count,
                    other_benefit_time: data.time
                })
            })
    }

    render() {
        let count = (parseInt(this.state.count) + parseInt(this.state.benefit_allowance_noti_count) + parseInt(this.state.wedding_benefit_count)
            + parseInt(this.state.funeral_benefit_count) + parseInt(this.state.external_benefit_count) + parseInt(this.state.medical_benefit_count)
            + parseInt(this.state.teamBuilding_benefit_count) + parseInt(this.state.other_benefit_count))

        let count1 = count + parseInt(this.state.noti_count)


        return (
            <div>
                <div className="row border-bottom">
                    <nav className="navbar navbar-static-top" role="navigation" >
                        <div className="navbar-header" style={{marginTop:"8px"}}>
                            <a href="#" className="navbar-minimalize minimalize-styl-2 btn btn-primary" ><i className="fa fa-bars"></i> </a>
                            
                        </div>
                        <div className='nav  navbar-left'>
                        <h2 className='font-bold' >HR Management System</h2>
                        </div>
                        
                        <div style={{
                            marginRight:'40px'
                        }}>
                       
                            <ul className="nav navbar-top-links navbar-right" style={{
                                display:"flex",
                                justifyContent:"center",
                                alignItems:"center",
                                
                            }}>
                                
                                
                                <li className="dropdown">
                                    {/* <div className="h1">count: {this.state.benefit_allowance_noti_count}</div> */}
                                    <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#" >
                                        <i className="fa fa-bell" >
                                            {
                                                count1 > 0 ?

                                                    <span className="label noti_label">{count1}</span>
                                                    : ''
                                            }
                                        </i>
                                    </a>
                                    {
                                        count1 > 0 ?

                                            <ul className="dropdown-menu dropdown-alerts">
                                                <li>
                                                    <a href='/notification'>
                                                        <div>
                                                            <i className="fas fa-envelope-open-text"></i>
                                                            &nbsp;&nbsp;
                                                    You have {this.state.noti_count} help desk message(s).
                                                    <span className="pull-right text-muted small">{this.state.time} ago</span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>

                                                    {/* <a href='/notification' > */}
                                                    <a href='#' onClick={this.readNoti}>

                                                        <div>
                                                            <i className="fas fa-envelope-open-text"></i>
                                                            &nbsp;&nbsp;
                                                    You have {count} benefit  message(s).
                                                    <span className="pull-right text-muted small">{this.state.benefit_allowance_noti_count} ago</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul> : ''
                                    }
                                </li>
                                <li style={{
                                    display:"flex",
                                    justifyContent:"space-between",
                                    alignItems:"center",
                                    marginRight:"20px"
                                }}>
                                   
                                    <img
                                    alt="logo"
                                    className="logostyle"
                                    src="assets/img/SeekPng.com_profile-icon-png_9665493.png" style={{
                                        width:"57px",
                                        height:'57px',
                                        borderRadius:'50%',
                                        objectFit:'cover'
                                    }} />
                                    
                                
                                    <div style={{
                                        margin:"0",
                                        padding:"0"
                                    }}>
                                    <p style={{
                                        margin:"0",
                                        fontSize:"12px",
                                        fontWeight:"bold"
                                    }}>
                                        {this.state.user ? this.state.user.fullname : ""}
                                    </p>
                                   
                                    <p style={{
                                        margin:"0",
                                        padding:"0"
                                    }}>
                                        {this.state.user ? this.state.user.designations : ""}
                                    </p>
                                    </div>
                            
                                </li>
                                
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

export default withRouter(NavBar);

{/* <div>
                                                        <i className="fas fa-envelope-open-text"></i>
                                                        &nbsp;&nbsp;
                                                You have {this.state.benefit_allowance_noti_count} benefit and allowance message(s).
                                                <span className="pull-right text-muted small">{this.state.benefit_allownace_time} ago</span>
                                                    </div> */}