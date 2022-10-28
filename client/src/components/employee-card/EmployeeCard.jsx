import { Component } from "react";
import male from "../../assets/male.jpeg";

export class EmployeeCard extends Component {
    render() {
        return <div className="card">
          <img src={male} alt="Employee 1" />
          <div className="container">
            <h3>{this.props.name}</h3>
            <p className="title">Master Stylist</p>
            <p>Phone Number: {this.props.phone}</p>
            <p>Email: {this.props.email}</p>
            <p>
              <button className="button">Working Hours</button>
            </p>
          </div>
        </div>
    }
}

export default EmployeeCard;
