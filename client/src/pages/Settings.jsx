import React, {Component} from 'react';
import {Navigate} from "react-router-dom";
import "../css/settings.css";

class Settings extends Component{

  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',

      street: "",
      city: "",
      state: "",
      zip: "",
      description: "",
      authenticated: false,
      loaded: false,
      apiResponse: "",

      addresses: [],
      changes: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchInputData = this.fetchInputData.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  componentDidMount(){
    this.callApi();
  }

///////////////////////////////////////////////////////
  callApi(){

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
      this.fetchInputData(res);
    });
  }
  //////////////////////////////////////////////////////

  handleChange(e){
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  }

///////////////////////////////////////////////////////////////////////////////
// ADDRESS OPERATIONS
///////////////////////////////////////////////////////////////////////////////
  deleteItem(id){
    let list = [...this.state.addresses]

    let addressToDelete = list.find(item => item.id === id)

    addressToDelete.action = 'remove'

    // Remove from array if it was locally added
    if(addressToDelete.local){
      list = list.filter(item => item.id !== id)
    }

    this.setState({...this.state, addresses: list})
  }

  addItem(){

    if(this.state.street === '' || this.state.city === '' || this.state.state === ''
      || this.state.zip === '')
      {
        console.log('Empty inputs. Ignoring')
        return;
      }


    const newAddress = {
      id: 1 + Math.random(),
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,

      action: 'add',
      local: true
    };

    const list = [...this.state.addresses]


    list.push(newAddress);


    this.setState({
      ...this.state,
      addresses: list,
      street: '',
      city: '',
      state: '',
      zip: ''
    });

  }

  handleAddressChange(e){

    const addressList = [...this.state.addresses]
    let names = e.target.name.split(':')

    let id = Number(names[0])
    let fieldName = names[1]


    let address = addressList.find(item => item.id === id)

    address[fieldName] = e.target.value;
    if(address.action !== 'add'){
      address.action = 'set';
    }

    this.setState({...this.state, addresses: addressList})

  }
  //////////////////////////////////////////////////////////////////////////////


  handleSubmit(){



    let data = {
      changes : {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        description: this.state.description,

        addresses: this.state.addresses
      },
      access: localStorage.getItem('access')
    }


    let apiUrl = 'http://127.0.0.1:8000/api/salon/'+this.state.apiResponse.business.id+'/'
    fetch(apiUrl, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      this.fetchInputData(res);
    });



  }

  fetchInputData(res){



    if(res.valid){

      this.setState({
        ...this.state,
        name: res.business.name,
        email: res.business.email,
        description: res.business.description,
        phone: res.business.phone,

        addresses: res.business.addresses,

        apiResponse: res,
        authenticated: res.valid,
        loaded: true

      });

    } else {
      this.setState({
        ...this.state,
        authenticated: res.valid,
        loaded: true
      });

    }


  }


  render(){

    if(this.state.authenticated){

      return(

        <div>
            <h1 className="app-title">Business Profile</h1>
        <div class="topnav">
          <a href="./business">Go Back</a>
          <a href="./employees">Employees</a>
          <a href="./services">Services</a>
          <a href="/">Sign Out</a>
        </div>
        <br />
          <div class="main-container">

            <div class="general-info">

              <div class="contact-info">

                <div class="input-box">
                  Name:
                  <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                </div>

                <div class="input-box">
                  Email:
                  <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                </div>

                <div class="input-box">
                  Phone: <input
                  type="text"
                  name="phone"
                  value={this.state.phone}
                  onChange={this.handleChange}
                  />
                </div>

              </div>

              <div class="description-info">
                <div class="input-box">
                  Description:
                  <textarea
                  type="text"
                  name="description"
                  value={this.state.description}    // inject state correspond to input and so on
                  onChange={this.handleChange}
                  />
                </div>
              </div>




            </div>


            <div>
            Addresses:
            {this.state.addresses?.filter(add => add.action !== 'remove').map(address =>
              <div key={address.id}>
              <input type="text"  name={address.id+':street'} value={address.street} onChange={this.handleAddressChange}/>
              <input type="text" name={address.id+':city'} value={address.city} onChange={this.handleAddressChange}/>
              <input type="text" name={address.id+':state'} value={address.state} onChange={this.handleAddressChange}/>
              <input type="text" name={address.id+':zip'} value={address.zip} onChange={this.handleAddressChange}/>
              <button onClick={() => this.deleteItem(address.id)}>
                REMOVE
              </button>
              </div>
            )}
             <div>
             <input type="text" name="street" value={this.state.street} onChange={this.handleChange} />
             <input type="text" name="city" value={this.state.city} onChange={this.handleChange}/>
             <input type="text" name="state" value={this.state.state} onChange={this.handleChange}/>
             <input type="text" name="zip" value={this.state.zip} onChange={this.handleChange}/>
             <button onClick={this.addItem}>
               ADD
             </button>
             </div>

            </div>

            <br />
            <button className="subbtn btn-floating" onClick={this.handleSubmit}>
              SUBMIT
            </button>
          </div>
        </div>

      );

    } else if(this.state.loaded){

      return(
        <Navigate to="/login" />
      );

    }



  }







}

export default Settings;
