import React from 'react';

function Settings() {

    const [data, setData] = React.useState({
        name: 'Bumble Beauty',
        email: 'abc@yahoo.com',
        phone: 1023456789,
        address: "abc st, Atlanta",
        street: "",
        city: "",
        state: "",
        zip: "",
        description: "Welcome to our salon"
      });

      // handle on change according to input name and setState
      const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
      };

      const handleSubmit = (e) => {
        e.preventDefault()
        // take data to submit
      };
      return (

        <div>
            <h1 className="app-title">Business Profile</h1>
        <div class="topnav">
          <a href="./business">Go Back</a>
          <a href="./employees">Employees</a>
          <a href="./services">Services</a>
          <a href="/">Sign Out</a>
        </div>
        <br />
          <form onSubmit={handleSubmit}>
            Name:
            <input
              type="text"
              name="name"
              value={data.name}    // inject state correspond to input and so on
              onChange={handleChange}
            />
            <br />
            Description:
            <input
              type="text"
              name="name"
              value={data.description}    // inject state correspond to input and so on
              onChange={handleChange}
            />
            <br />
            Address:
            <input
              type="text"
              name="name"
              value={data.address}    // inject state correspond to input and so on
              onChange={handleChange}
            />
            <br />
            Email:
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <br />
            Phone: <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
            />
            <br />
            <button type="submit"className="subbtn btn-floating">
              SUBMIT
            </button>
          </form>
        </div>
  );
}
export default Settings;
