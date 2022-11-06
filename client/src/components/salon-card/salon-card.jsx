import { Component } from "react";
import { Link } from 'react-router-dom'
import belahair from "../../assets/belahair.jpg";

export default class SalonCard extends Component {
    render() {
        return <div class="salon-card">
        <img class="col-img" src={belahair} alt="Belahair"/>

        <h4>{this.props.name}</h4>
        <p class="phone">Address:{this.props.address} </p>
        <Link to={"/salon/"+this.props.id}><button class="btn2">Book Now</button></Link>
        </div>
    }
}
