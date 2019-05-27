import React, { Component } from 'react';
import './App.css';

 class Employee extends React.Component
 {
    constructor(props){
        super(props)        
            this.state = {
                posts:[]
            };       
    }

    componentDidMount(){
        let url = "http://localhost:30010/Employees";
        fetch(url)
        .then(respone => respone.json())
        .then(data => {
            let posts = data.map((post, index) => {
                return(
                    <div>
                        <table>
                            <tr>
                                <th>Emp ID</th>
                                <th>EmpTagNumber</th>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>EmailAdress</th>
                                <th>Department</th>
                                <th>Birthdate</th>
                            </tr>
                            <tr>{this.post.EmpId}</tr>
                            <tr>{this.post.EmpTagNumber}</tr>
                            <tr>{this.post.FirstName}</tr>
                            <tr>{this.post.LastName}</tr>
                            <tr>{this.post.EmailAdress}</tr>
                            <tr>{this.post.Department}</tr>
                            <tr>{this.post.Birthdate}</tr>
                            </table>
                    </div>
                )
            })
            this.setState({posts : posts});
        })
    }
    

    render() {
        return (
          <div>
              {this.state.posts}
          </div>
        );
      };
 }


export default Employee;