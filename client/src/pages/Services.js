import React, { Component } from "react";
import {Navigate} from "react-router-dom";

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {

      newItem: "",
      newPrice: "",
      newCategory: "",
      list: [],
      changes: [],
      authenticated: false,
      loaded: false,
      apiResponse: ""

    };

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  //incorporating local storage
  componentDidMount() {

    this.callApi();

  }

  callApi() {

    ////////////AUTHENTICATION////////////////
    let storedData = {
      access: localStorage.getItem('access')
    }

    fetch('http://127.0.0.1:8000/api/auth/', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(storedData)
    })
    .then(res => res.json())
    .then(res => {

      //Save authentication data to states
      if(res.valid){
        this.setState({...this.state, authenticated: res.valid, apiResponse: res, loaded: true, list: res.business.services})
      } else {
        this.setState({...this.state, authenticated: res.valid, apiResponse: res, loaded: true})
      }

    })
    /////////////////////////////////////////

  }


  handleSubmit(){

    let data = {
      changeLog: this.state.changes,
      access: localStorage.getItem('access')
    }


    let apiUrl = 'http://127.0.0.1:8000/api/salon/'+this.state.apiResponse.business.id+'/services/'

    fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if(res.valid){
          this.updateInput('list', res.services)
          this.updateInput('changes', [])
      } else {
        this.setState({...this.state, authenticated: false, loaded: true})
      }

    })

  }


  updateInput(key, value){
    // update react state
    this.setState({ [key]: value });
  }

  addItem() {
    // create a new item with unique id
    const newItem = {
      id: 1 + Math.random(),
      name: this.state.newItem.slice(),
      price: this.state.newPrice.slice(),
      category: this.state.newCategory.slice(),
      action: 'add'
    };

    // copy current list of items
    const list = [...this.state.list];
    const changesList = [...this.state.changes]

    // add the new item to the list
    list.push(newItem);
    changesList.push(newItem)

    // update state with new list, reset the new item input
    this.setState({
      list: list,
      changes: changesList,
      newItem: "",
      newCategory: "",
      newPrice: ""
    });
  }

  deleteItem(id) {
    // copy current list of items
    const list = [...this.state.list];
    // filter out the item being deleted

    // Find the object to delete in the services list
    let serviceToDelete = list.find(item => item.id === id)
    console.log(serviceToDelete)
    //If the service element was created in the front end
    //remove it from the changelog too
    let changeList = [...this.state.changes]

    if(serviceToDelete !== undefined && serviceToDelete.action === "add"){
      changeList = changeList.filter(item => item.id !== id)
    } else {
      console.log('Removing')
      serviceToDelete.action = "remove";
      changeList.push(serviceToDelete)
    }

    const updatedList = list.filter(item => item.id !== id);

    this.setState({...this.state, list: updatedList, changes: changeList });
    console.log(this.state)
  }

  render() {
    if(this.state.authenticated){
      return (
        <div>
          <h1 className="app-title">Manage Services</h1>
          <div class="topnav">
            <a href="./business">Go Back</a>
            <a href="./appointment">Appointment</a>
            <a href="./contact">Contact Us</a>
            <a href="/">Sign Out</a>
          </div>
          <br />
          <br />
          <div className="container">
            <div
              style={{
                padding: 50,
                maxWidth: 900,
                margin: "left"

              }}
            >
              <br />
              <input
                style={{ maxWidth: 500 }}
                type="text"
                placeholder="Type a service name here..."
                value={this.state.newItem}
                onChange={e => this.updateInput("newItem", e.target.value)}
              />

              <input
                style={{ maxWidth: 500 }}
                type="text"
                placeholder="Type a category..."
                value={this.state.newCategory}
                onChange={e => this.updateInput("newCategory", e.target.value)}
              />

              <input
                style={{ maxWidth: 100 }}
                type="text"
                placeholder="Enter price"
                value={this.state.newPrice}
                onChange={e => this.updateInput("newPrice", e.target.value)}
              />

              <button className="addbtn btn-floating" onClick={() => this.addItem()}
              disabled={!this.state.newItem.length}>ADD</button>
              <br />
              <br />

              <ul>
                {this.state.list.map((service) => {
                  return (

                    <li key={service.id}>
                      <table><tr><td>
                      {service.name}</td><td>
                      <button className="removebtn" onClick={() => this.deleteItem(service.id)}>
                        Remove
                      </button>
                      </td><br /></tr></table>

                    </li>
                  );
                })}
              </ul>

            </div>
          </div>
          <button
                className="subbtn btn-floating"
                onClick={this.handleSubmit}
                disabled={!this.state.changes.length}
              >
                SUBMIT Changes
              </button>
        </div>
      );
    } else if(this.state.loaded) {

      return(
        <Navigate to="/login" />
      );

    }
  }
}

export default Services;
