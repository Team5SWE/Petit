import React, {Component} from 'react';
import Calendar from '../components/calendar/calendar'
import {Navigate} from "react-router-dom";

class Schedule extends Component{
  constructor(props){
    super(props);

    this.state = {schedules: [], startDate: '2022-04-10', authenticated: false, loaded: false}
  }

  componentDidMount(){
    this.callApi();
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
        console.log(res)
        this.setState({schedules: res.schedules, startDate: res.currentDate, authenticated: true, loaded: true})
      } else {
        this.setState({...this.state, authenticated: false, loaded: true})
      }
    })

  }




  render(){
    if(this.state.authenticated){
      return (
        <div>
          <h1>View all  Appointments</h1>
          <Calendar startDate={this.state.startDate} schedules={this.state.schedules}/>
        </div>
      );
    } else if(this.state.loaded) {
      return(
          <Navigate to="/login" />
      );
    }
  }

}

export default Schedule;
