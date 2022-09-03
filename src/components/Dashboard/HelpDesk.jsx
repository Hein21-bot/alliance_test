import React, { Component } from 'react';
import { main_url } from "../../utils/CommonFunction";

class HelpDesk extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Ticket: [],
            TicketStatus: [],
            TicketMainCategory: []
        }
    }
    async componentDidMount() {
        const id = localStorage.getItem("user_id");
        await this.getTicket(id)
        await this.getTicketStatus(id)
        await this.getTicketMainCategory(id)
    }
    getTicket = async (id) => {
        await fetch(main_url + `dashboard/helpDeskTicket/${id}`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((res1) => {
                this.setState({ Ticket: res1 });


            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
    };
    getTicketStatus = async (id) => {
        await fetch(main_url + `dashboard/helpDeskStatus/${id}`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((res1) => {
                this.setState({ TicketStatus: res1 });


            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
    };
    getTicketMainCategory = async (id) => {
        await fetch(main_url + `dashboard/helpDeskMainCategory/${id}`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((res1) => {
                this.setState({ TicketMainCategory: res1 });


            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
    };


    render() {
        return (
            <div className='row'>
                <div className='col-12' style={{
                    marginLeft: '15px',
                    marginRight: '20px'

                }}>
                    <div className="row no-gutters">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12" style={{
                            //    marginLeft:'5px',
                            //    marginRight:'5px',


                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: "#fff",
                                boxShadow: "3px 3px 3px #e5e5e5",
                                borderRadius: 6,
                                marginLeft: 0,

                                marginTop: '20px'

                            }}>
                                <div style={{
                                    padding: '10px',

                                }}>
                                    <p className='text-black-50'>

                                        {/* {this.state.Ticket.length !=0? Object.keys(this.state.Ticket[0])[0]:0} */}
                                        Total Tickets

                                    </p>
                                    <p style={{
                                        fontWeight: 'bold',
                                        marginBottom: '0'
                                    }}>{this.state.Ticket.length != 0 ? this.state.Ticket[0].total_ticket : 0}</p>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#22d1ee',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    margin: '10px'

                                }}>
                                    <i className='fa fa-bars' style={{

                                        color: 'white'
                                    }}></i>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: "#fff",
                                boxShadow: "3px 3px 3px #e5e5e5",
                                borderRadius: 6,


                                marginTop: '10px'

                            }}>
                                <div style={{
                                    padding: '10px'
                                }}>
                                    <p style={{

                                    }}> OPEN TICKETS</p>
                                    <p style={{
                                        fontWeight: 'bold',
                                        marginBottom: 0
                                    }}>{
                                            this.state.Ticket.length ? this.state.Ticket[1].open_ticket ? this.state.Ticket[1].open_ticket : 0 : 0
                                        }
                                    </p>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#17b978',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    margin: '10px'

                                }}>
                                    <i className='fa fa-check' style={{

                                        color: 'white'
                                    }}></i>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: "#fff",
                                boxShadow: "3px 3px 3px #e5e5e5",
                                borderRadius: 6,

                                marginTop: '10px'

                            }}>
                                <div style={{
                                    padding: '10px'
                                }}>
                                    <p style={{

                                    }}> CLOSED TICKETS</p>
                                    <p style={{
                                        fontWeight: 'bold',
                                        marginBottom: 0
                                    }}>
                                        {
                                            this.state.Ticket.length ? this.state.Ticket[2].close_ticket ? this.state.Ticket[2].close_ticket : 0 : 0
                                        }
                                    </p>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#d72323',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    margin: '10px'

                                }}>
                                    <i className='fa fa-book' style={{

                                        color: 'white'
                                    }}></i>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12" style={{
                            margin: 0,
                            padding: 0
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: "#fff",
                                boxShadow: "3px 3px 3px #e5e5e5",
                                borderTopRightRadius: 6,
                                borderTopLeftRadius: 6,


                                marginTop: '20px'

                            }}>
                                <div style={{
                                    paddingLeft: '10px',
                                    paddingRight: '10px'
                                }}>
                                    <p style={{

                                    }}>TICKET</p>
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>{this.state.Ticket.length != 0 ? this.state.Ticket[0].total_ticket : 0}</p>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#9c1de7',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    margin: '15px'

                                }}>
                                    <i className='fa fa-bars' style={{

                                        color: 'white'
                                    }}></i>
                                </div>
                            </div>
                            <div>
                                <div style={{

                                    backgroundColor: '#1872ab',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',

                                }}>
                                    <p style={{
                                        display: 'inline',
                                        marginLeft: '10px',



                                    }}>Ticket Status</p>

                                    <p style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                        width: '70px',
                                        height: '30px',
                                        borderLeft: '1px solid white',

                                    }}>Tickets</p>
                                </div>
                            </div>
                            <div>
                                {
                                    this.state.TicketMainCategory.map(status => (

                                        <div style={{

                                            backgroundColor: '#dee1ec',
                                            color: 'white',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',

                                        }}>
                                            <p style={{
                                                display: 'inline',
                                                marginLeft: '10px',

                                                color: 'black'


                                            }}>
                                                {status.total_ticket}

                                            </p>
                                            <p style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                                width: '70px',
                                                height: '30px',
                                                color: 'black',
                                                borderLeft: '1px solid white',

                                            }}>{status.total}</p>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12" style={{
                            margin: 0,
                            paddingLeft: '15px',
                            paddingRight: 0

                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: "#fff",
                                boxShadow: "3px 3px 3px #e5e5e5",
                                borderTopRightRadius: 6,
                                borderTopLeftRadius: 6,


                                marginTop: '20px'

                            }}>
                                <div style={{
                                    paddingLeft: '10px',
                                    paddingRight: '10px'
                                }}>
                                    <p style={{

                                    }}>TICKET STATUS</p>
                                    <p style={{
                                        fontWeight: 'bold'
                                    }}>{this.state.Ticket.length != 0 ? this.state.Ticket[0].total_ticket : 0}</p>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#9c1de7',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    margin: '15px'

                                }}>
                                    <i className='fa fa-bars' style={{

                                        color: 'white'
                                    }}></i>
                                </div>
                            </div>
                            <div>
                                <div style={{

                                    backgroundColor: '#1872ab',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',

                                }}>
                                    <p style={{
                                        display: 'inline',
                                        marginLeft: '10px',



                                    }}>Main Category</p>

                                    <p style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                        width: '70px',
                                        height: '30px',
                                        borderLeft: '1px solid white',

                                    }}>Tickets</p>
                                </div>
                            </div>
                            <div>

                                {
                                    this.state.TicketStatus.map(status => (

                                        <div style={{

                                            backgroundColor: '#dee1ec',
                                            color: 'white',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',


                                        }}>
                                            <p style={{
                                                display: 'inline',
                                                marginLeft: '10px',

                                                color: 'black'


                                            }}>
                                                {status.total_ticket}

                                            </p>
                                            <p style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                                width: '70px',
                                                height: '30px',
                                                color: 'black',
                                                borderLeft: '1px solid white',

                                            }}>{status.total}</p>
                                        </div>
                                    ))
                                }





                            </div>
                        </div>

                    </div>

                </div>

            </div >
        );
    }
}

export default HelpDesk;