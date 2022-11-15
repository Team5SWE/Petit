import {React, Component} from "react";
import {Navigate} from "react-router-dom";
import PageLoader from "../../components/navbar/PageLoader.jsx";

import "../../css/dashboard/services.css";
import BusinessNavbar from "../../components/navbar/businessNavbar.jsx";

import ServiceCard from "../../components/services/ServiceCard.jsx"


export default class Services extends Component{
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
      stage: 'waiting',
      apiResponse: ""

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

  }

  componentDidMount() {
    this.callApi();
  }

  handleLogout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    this.setState({...this.state, authenticated: false, stage: 'failed'})
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
        this.setState({...this.state, apiResponse: res, stage: 'loaded', list: res.business.services})
      } else {
        this.setState({...this.state, apiResponse: res, stage: 'failed'})
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

    this.setState({...this.state, stage: 'waiting'})

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
          this.setState({...this.state, list: res.services, changes: [], stage: 'loaded'})
      } else {
        this.setState({...this.state, stage: 'failed'})
      }

    })

  }


  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

  addItem() {

    // create a new item with unique id


    const newItem = {
      id: 1 + Math.random(),
      name: this.state.newItem.slice().trim(),
      price: this.state.newPrice.slice().trim(),
      category: this.state.newCategory.slice().trim(),
      action: 'add'
    };

    //Check for invalid input
    if(newItem.name === '' || newItem.price === '' || newItem.category === '')
      return;

    //Check if price is invalid number
    if(isNaN(newItem.price))
      return;

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


  render(){

    const stage = this.state.stage;

    switch(stage){

      case "waiting":
        return(
          <PageLoader/>
        );

      case "loaded":
      return(
        <div>
        <BusinessNavbar exitFunc={this.handleLogout}/>

        <section class="title-container">
          <h1 class="page-title">EDITING SERVICES</h1>
        </section>

        <section class="services-container">
          <div class="services-div">

            <div class="services">

              {this.state.list.map(service =>(
                <ServiceCard key={service.id} price={service.price} name={service.name}
                category={service.category} removeAction={() => this.deleteItem(service.id)}
                editable={true}/>
              ))}

            </div>

            <div class="services-adder">

              <div class="adder-item-div">
                <input type="text" class="adder-item" name="newItem"
                value={this.state.newItem} placeholder="Service Name:"
                onChange={this.handleChange}/>
              </div>

              <div class="adder-item-div">
                <input type="text" class="adder-item" name="newPrice"
                value={this.state.newPrice}
                placeholder="Price:" onChange={this.handleChange}/>
              </div>

              <div class="adder-item-div">
                <input type="text" class="adder-item" name="newCategory"
                 value={this.state.newCategory} placeholder="Category:"
                 onChange={this.handleChange}/>
              </div>

              <div class="adder-item-div">
                <div class="adder-btn green-btn adder-item" onClick={this.addItem}>
                  ADD
                </div>
              </div>

              <div class="adder-item-div">
                <div class="adder-btn dark-btn adder-item" onClick={this.handleSubmit}>
                  SAVE SERVICES
                </div>
              </div>

            </div>

          </div>
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
