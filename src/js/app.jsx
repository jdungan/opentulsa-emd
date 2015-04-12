/** @jsx React.DOM */
var React = require('react/dist/react');
var _ = require('underscore');

var WorkOrderDiv = React.createClass({
  getInitialState: function() {
      return {data: []};
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
        <Filter></Filter>
        <WorkOrderItems data={this.state.data}/>
      
      </div>
    );
  }
});

var Filter = React.createClass({
  render: function () {
    
    return(
      <form>
        
        <input></input>
      </form>
    )
  }
})


var WorkOrderItems = React.createClass({
  render: function() {
    var workorders = this.props.data.map(function (order) {
      return (
          <Order data={order}></Order>
      );
    });
    return (
      <ul>
        {workorders}
      </ul>
    );
  }
});

var Order = React.createClass({
  render: function() {
    return (
      <li >
        {this.props.data.WorkOrderNumber}
        {this.props.data.OpenDate}

      </li>
    );
  }
});


// "https://www.cityoftulsa.org/cot/opendata/OpenData_EMDlist.jsn"
React.render(
  <WorkOrderDiv url="orders.json" />,
  document.getElementById('work_orders')
);