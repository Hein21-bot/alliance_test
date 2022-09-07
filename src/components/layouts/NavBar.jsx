import React, { Component } from 'react';
import io from 'socket.io-client';
import { main_url, remote_url, removeCookieData, getUserId, imageError } from '../../utils/CommonFunction';
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
            count: 0,
            isOpen:true,
            isOpenDashboard: false,
        }

    }

    componentDidMount() {
       
        // document.querySelector(".minimalize-styl-2").addEventListener("click",this.afterClick)
         document.querySelector(".minimalize-styl-2").addEventListener("click",this.clickButton)
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

    // componentDidUpdate() {
    //     if (window.location.pathname.includes(`/${this.state.user.user_id}`) || window.location.pathname.includes('/dashboard') ) {
    //     if (this.state.isOpenDashboard) {
    //         document.body.classList.add('mini-navbar')
    //     } else {
    //         console.log("open")
    //         document.body.classList.remove('mini-navbar')
    //     }
    // }else{

    //     if (this.state.isOpen) {
    //         document.body.classList.remove('mini-navbar')
    //     } else {
    //         document.body.classList.add('mini-navbar')
    //     }
    // }
       
    // }

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
    clickButton=()=>{
        document.body.classList.toggle('mini-navbar')
    }
    // afterClick=()=>{
    //     console.log('open ====>', this.state.isOpen, this.state.isOpenDashboard)
        
    //     // console.log("shi ma shi",document.body.classList.contains('mini-navbar'))
    //     // document.body.classList.contains('mini-navbar').remove('mini-navbar');
    //     if (window.location.pathname.includes(`/${this.state.user.user_id}`) || window.location.pathname.includes('/dashboard') ) {
    //         console.log('a pyin 1',this.state.isOpenDashboard)
    //         this.setState({ isOpenDashboard: !this.state.isOpenDashboard});
    //         console.log('a pyin',this.state.isOpenDashboard)
    //         // if (this.state.isOpenDashboard) {
    //         //     document.body.classList.add('mini-navbar')
    //         // } else {
    //         //     console.log("open")
    //         //     document.body.classList.remove('mini-navbar')
    //         // }
    //     } else {
    //         this.setState({
    //             isOpen: !this.state.isOpen
    //         })
    //         // if (this.state.isOpen) {
    //         //     document.body.classList.remove('mini-navbar')
    //         // } else {
    //         //     document.body.classList.add('mini-navbar')
    //         // }
    //     }
        
        
    //     // if(this.state.isOpen){
    //     //     if (window.location.pathname == '/dashboard') {
    //     //         document.body.classList.add('mini-navbar')
    //     //     } else {
    //     //         document.body.classList.remove('mini-navbar')
    //     //     }
            
    //     // }else{
    //     //     if (window.location.pathname == '/dashboard') {
    //     //         document.body.classList.remove('mini-navbar')
    //     //     } else {
    //     //         document.body.classList.add('mini-navbar')
    //     //     }
            
    //     // }
    // }
    
    
    // const add=document.querySelector('#gg');
    // add.addEventListener('click',afterClick)

    render() {
        let count = (parseInt(this.state.count) + parseInt(this.state.benefit_allowance_noti_count) + parseInt(this.state.wedding_benefit_count)
            + parseInt(this.state.funeral_benefit_count) + parseInt(this.state.external_benefit_count) + parseInt(this.state.medical_benefit_count)
            + parseInt(this.state.teamBuilding_benefit_count) + parseInt(this.state.other_benefit_count))

        let count1 = count + parseInt(this.state.noti_count)



        return (
            <div>
                <div className="row border-bottom">
                    <nav className="navbar navbar-static-top" role="navigation" >
                        {/* <div className="navbar-header"   style={{marginTop:"8px"}}>
                            <div className="navbar-minimalize minimalize-styl-2 btn btn-primary" id="gg"><i className="fa fa-bars" ></i> </div>
                            <button className="navbar-minimalize minimalize-styl-2 btn btn-primary" type="button" data-toggle="collapse" data-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa fa-bars" ></i> 
                            </button>
                        </div> */}
                        <div className='navbar-header' style={{marginTop:'8px'}}>
                            <div className='minimalize-styl-2 btn btn-primary'>
                                <i className='fa fa-bars'></i>
                            </div>
                        </div>
                        <div className='nav  navbar-left'>
                            <h2 className='font-bold' >HR Management System</h2>
                        </div>

                        <div style={{
                            marginRight: '40px'
                        }}>

                            <ul className="nav navbar-top-links navbar-right" style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

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
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginRight: "20px"
                                }}>

                                    <img
                                        alt="logo"
                                        className="logostyle"
                                        onError={imageError}
                                        // src={this.state.user.avatar ? main_url + `dashboard/getProfile/`+  this.state.user.avatar : 'assets/img/SeekPng.com_profile-icon-png_9665493.png'}
                                        src={'assets/img/SeekPng.com_profile-icon-png_9665493.png'}
                                        style={{
                                            width: "57px",
                                            height: '57px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }} />


                                    <div style={{
                                        margin: "0",
                                        padding: "0"
                                    }}>
                                        <p style={{
                                            margin: "0",
                                            fontSize: "12px",
                                            fontWeight: "bold"
                                        }}>
                                            {this.state.user ? this.state.user.fullname : ""}
                                        </p>

                                        <p style={{
                                            margin: "0",
                                            padding: "0"
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