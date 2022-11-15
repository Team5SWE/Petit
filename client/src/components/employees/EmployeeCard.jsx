import {React, Component} from "react";
import profile from "../../assets/default_employee.jpeg";

export default class EmployeeCard extends Component{

  render(){
    return(

      <div class="employee">

        <div class="employee-box">

          <div class="emp-img-div">
            <img class="emp-img" src={profile} alt=""/>
          </div>

          <div class="emp-desc">
            <p>{this.props.specialty}</p>
            <h2>{this.props.name}</h2>
          </div>

          <div class="emp-btns">

            <p class="emp-btn dark">
              {this.props.email}
            </p>

          </div>

        </div>

      </div>
    )
  }
}
