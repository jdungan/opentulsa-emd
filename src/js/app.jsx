/** @jsx React.DOM */
var React = require('react/dist/react');
var _ = require('underscore');
var prettydate = require('pretty-date')

var WorkOrderDiv = React.createClass({
  getInitialState: function() {
    return {data: [],searchString:''}
    },
  textSearch: function (e) {
    this.setState({searchString:e.target.value.toLowerCase()});
    },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      type: "GET",
      dataType: 'json',
      success: function(data) {
        this.setState({data: data.EMDList.WorkOrders.WorkOrder});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <input placeholder =  "Type here to search" 
               value = {this.state.searchString} 
               onChange={this.textSearch} />
        
       <WorkOrderList data={this.state.data} search={this.state.searchString}/>
      
      </div>
    );
  }
});

var WorkOrderList = React.createClass({
  render: function() {
    var search =this.props.search
    workorders = this.props.data
      .filter(function(order){
        return order.NotifyName.toLowerCase().match( search );
      })
      .map(function (order) {
        return (
            <WorkOrder data={order} key ={order.WorkOrderNumber}/>
        );
      });

    return (
      <ul>
        {workorders}
      </ul>
    );
  }
});

var WorkOrder = React.createClass({
  render: function() {
    var diff = new Date() - new Date(this.props.data.OpenDate);    
    var age = prettydate.format(new Date (new Date() - diff))
    return (
      <li >
        <p>NotifyName: {this.props.data.NotifyName}</p>
        <p>WorkOrderNumber: {this.props.data.WorkOrderNumber}</p>
        <p>Status: {this.props.data.Status}</p>
        <p>UnitNumber: {this.props.data.UnitNumber}</p>
        <p>CreatedBy: {this.props.data.CreatedBy}</p>
        <p>CompletedDate: {this.props.data.CompletedDate}</p>
        <p>CloseDate: {this.props.data.CloseDate}</p>
        <p>UsingDeptName: {this.props.data.UsingDeptName}</p>
        <p>LocationName: {this.props.data.LocationName}</p>
        <p>OpenDate: {this.props.data.OpenDate}</p>
        <p>Age: { age }</p>
        <JobList jobs={this.props.data.Jobs.Job}/>
      </li>
    );
  }
});


var JobList = React.createClass({
  render: function () {
    var jobs;
    if (_.isArray(this.props.jobs)) {
      jobs = _.map(this.props.jobs,function (job) {
          return(<Job data={job} key = {job.JobNumber }/>)
      });
    } else {      
      jobs = <Job data={this.props.jobs} key = {this.props.jobs.JobNumber }/>
    }
      
    return ( 
      <ul>
        {jobs}
      </ul>
    )
  }  
});

var Job = React.createClass({
  render: function () {
    return(
      <li>
        <p>JobID: {this.props.data.JobID}</p>
        <p>JobWorkOrderNumber: {this.props.data.JobWorkOrderNumber}</p>
        <p>JobReasonCode: {this.props.data.JobReasonCode}</p>
        <p>JobNumber: {this.props.data.JobNumber}</p>
        <p>JobDescription: {this.props.data.JobDescription}</p>
        <p>JobStatus: {this.props.data.JobStatus}</p>
        <p>JobStatusDescription: {this.props.data.JobStatusDescription}</p>
        <p>JobStatusPriority: {this.props.data.JobStatusPriority}</p>
        <p>JobStatusColor: {this.props.data.JobStatusColor}</p>
        <p>JobCompletedDate: {this.props.data.JobCompletedDate}</p>
        <p>ActualJobHours: {this.props.data.ActualJobHours}</p>
      </li>
    )
  }
})

// "https://www.cityoftulsa.org/cot/opendata/OpenData_EMDlist.jsn"
React.render(
  <WorkOrderDiv url="orders.json" />,
  document.getElementById('work_orders')
);