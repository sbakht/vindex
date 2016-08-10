var CreateStamp = React.createClass({
  render: function() {
    return (
	  <div className="col-md-offset-1 col-md-4">
	      <div className="input-group">
	        <span id="new-stamp-time" className="input-group-addon">00:00</span>
	        <input id="new-stamp-input" className="form-control" type="text" autoComplete="off" />
	      </div>
	      <textarea id="new-stamp-notes" className="form-control" rows="3" placeholder="Enter notes here..."></textarea>
	      <input id="new-stamp-submit" className="btn btn-primary" type="submit" value="Create Timestamp" />
	  </div>
    );
  }
});


var StampList = React.createClass({
  render: function() {
    return ( 
	  <div className="col-md-4">
	    <select className="form-control"></select>
	  </div>
    );
  }
});


var StampInstances = React.createClass({
  render: function() {
    return ( 
	  <div className="col-md-offset-3 col-md-4" id="tag-occurences">
	    <h3>All instances of</h3>
	    <input id="input-tag" className="form-control" type="text" autoComplete="off" />
	    <div>
	      <h4>Some title</h4>
	      <div className="stamp">
	        <span className="stamp-time">00:05</span>
	        <span className="show-notes glyphicon glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
	        <span className="hide-notes glyphicon glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
	        <p className="notes">Some notes</p>
	      </div>
	    </div>
	  </div>
    );
  }
});


var App = React.createClass({
  render: function() {
    return ( 
    	<div>
	    	<div className="row">
	    		<StampList />
	    	</div>
	    	<div className="row">
		    	<CreateStamp />
		    	<StampInstances />
	    	</div>
    	</div>
    );
  }
});

ReactDOM.render(
		<App />,
		document.getElementById('main')
);