import {React,Component} from 'react';
import Calendar from '../../components/calendar/calendar'
import {Navigate} from "react-router-dom";
import PageLoader from "../../components/navbar/PageLoader.jsx";

import BusinessNavbar from "../../components/navbar/businessNavbar.jsx";

export default class Schedule extends Component {
  constructor(props){
    super(props);

    this.state = {schedules: [], startDate: '2022-04-10', stage: 'waiting'}
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount(){
    this.callApi();
  }

  handleLogout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    this.setState({...this.state, authenticated: false, stage: 'failed'})
  }

  callApi(){

    let data = {
      access : localStorage.getItem('access')
    }

    fetch('http://127.0.0.1:8000/api/schedule/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
        this.setState({schedules: res.schedules, startDate: res.currentDate, stage: 'loaded'})
      } else {
        this.setState({...this.state, stage: 'failed'})
      }
    })
  }

  render(){

    const stage = this.state.stage;

    switch(stage){
      case "waiting":
        return(<PageLoader/>);

      case "loaded":
        return (
          <div>
            <BusinessNavbar exitFunc={this.handleLogout}/>
            <section class="services-container">
              <h1 class="page-title">View all  Appointments</h1>
              <Calendar startDate={this.state.startDate} schedules={this.state.schedules}/>
            </section>
            </div>
          );

      default:
        return(
          <Navigate to="/login" />
        );
    }

  }

}
