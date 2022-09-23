import { Component } from "react";
import { SalonCard } from "../salon-card/salon-card";

export default class ListSalon extends Component {
    // get from API
    listOfSalons = [
        {id: 1, name: 'a'},
        {id: 2, name: 'b'},
        {id: 3, name: 'c'},
    ]
    render() {
        console.log(this.listOfSalons)
        return <div>
            List of Salons
            {this.listOfSalons.map(salon => 
                <SalonCard key={salon.id} name={salon.name}></SalonCard>
            )}
        </div>
    }
}