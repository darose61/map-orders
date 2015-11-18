// CUSTOM JS FILE //
var map; // global map variable
var markers = []; // array to hold map markers

function init() {
  
  // set some default map details, initial center point, zoom and style
  var mapOptions = {
    center: new google.maps.LatLng(38.250206, 1.265472),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  // create the map and reference the div#map-canvas container
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  
  // get the animals (ajax) 
  // and render them on the map
  renderPlaces();
}

// add form button event
// when the form is submitted (with a new animal), the below runs
jQuery("#submit-button").click(function(e){

	// first, let's pull out all the values
	// the name form field value
	var name = jQuery("#name").val();
	var email = jQuery("#email").val();
	var orderNumber = jQuery("#orderNumber").val();
	var customerTags = jQuery("#tags").val();
	var lineItems = jQuery("#lineItems").val();
	var vendor = jQuery("#vendor").val();
	var totalCost = jQuery("#totalCost").val();

	//var url = jQuery("#url").val();
	var location = jQuery("#location").val();



	// make sure we have a location
	if(!location || location=="") return alert('We need a location!');
      
	// POST the data from above to our API create route
  jQuery.ajax({
  	url : '/api/create',
  	dataType : 'json',
  	type : 'POST',
  	// we send the data in a data object (with key/value pairs)
  	data : {
  		name: name,
      	email: email,
      	orderNumber: orderNumber,
      	customerTags: customerTags,
      	lineItems: lineItems,
      	vendor: vendor,
      	totalCost: totalCost,
      	location: location
  	},
  	success : function(response){
  		if(response.status=="OK"){
	  		// success
	  		console.log(response);
	  		// re-render the map
	  		renderPlaces();
	  		// now, clear the input fields
	  		jQuery("#addForm input").val('');
  		}
  		else {
  			alert("something went wrong");
  		}
  	},
  	error : function(err){
  		// do error checking
  		alert("something went wrong");
  		console.error(err);
  	}
  }); 

	// prevents the form from submitting normally
  e.preventDefault();
  return false;
});

// get Animals JSON from /api/get
// loop through and populate the map with markers
var renderPlaces = function() {
	var infowindow =  new google.maps.InfoWindow({
	    content: ''
	});

	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {

			console.log(response);
			orders = response.orders;
			// first clear any existing markers, because we will re-add below
			clearMarkers();
			markers = [];

			// now, loop through the animals and add them as markers to the map
			for(var i=0;i<orders.length;i++){

				var latLng = {
					lat: orders[i].location.geo[1], 
					lng: orders[i].location.geo[0]
				}

				// make and place map maker.
				var marker = new google.maps.Marker({
				    map: map,
				    position: latLng,
				    title : orders[i].orderNumber + "<br>" + orders[i].name + "<br>" + orders[i].email + "<br>" + orders[i].totalCost + "<br>" + orders[i].vendor + "<br>" + orders[i].location.name  
				});

				bindInfoWindow(marker, map, infowindow, '<b>'+ "Order:" + orders[i].orderNumber + "<br>" + orders[i].name + "</b> ("+orders[i].email+") <br>" + "Amount Spent: $" + orders[i].totalCost + "<br>" + "Vendor: " + orders[i].vendor + "<br>" + orders[i].location.name+ "<br>" );
				
				// keep track of markers
				markers.push(marker);
			}

			// now, render the animal image/data
			renderOrders(orders);

		}
	})
};

// edit form button event
// when the form is submitted (with a new animal edit), the below runs
jQuery("#editForm").submit(function(e){

	// first, let's pull out all the values
	// the name form field value
	var name = jQuery("#edit-name").val();
	var email = jQuery("#edit-email").val();
	var orderNumber = jQuery("#edit-orderNumber").val();
	var customerTags = jQuery("#edit-tags").val();
	var lineItems = jQuery("#edit-lineItems").val();
	var vendor = jQuery("#edit-vendor").val();
	var location = jQuery("#edit-location").val();
	var totalCost = jQuery("#edit-totalCost").val();
	var id = jQuery("#edit-id").val();

	// make sure we have a location
	if(!location || location=="") return alert('We need a location!');
     
  console.log(id);
      
	// POST the data from above to our API create route
  jQuery.ajax({
  	url : '/api/update/'+id,
  	dataType : 'json',
  	type : 'POST',
  	// we send the data in a data object (with key/value pairs)
  	data : {
  		name: name,
      	email: email,
      	orderNumber: orderNumber,
      	customerTags: customerTags,
      	lineItems: lineItems,
      	vendor: vendor,
      	totalCost: totalCost,
      	location: location
  	},
  	success : function(response){
  		if(response.status=="OK"){
	  		// success
	  		console.log(response);
	  		// re-render the map
	  		renderPlaces();
	  		// now, close the modal
	  		$('#editModal').modal('hide')
	  		// now, clear the input fields
	  		jQuery("#editForm input").val('');
  		}
  		else {
  			alert("something went wrong");
  		}
  	},
  	error : function(err){
  		// do error checking
  		alert("something went wrong");
  		console.error(err);
  	}
  }); 

	// prevents the form from submitting normally
  e.preventDefault();
  return false;
});

// binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
}

function renderOrders(orders){

	// first, make sure the #animal-holder is empty
	jQuery('#order-holder').empty();

	// loop through all the animals and add them in the animal-holder div
	for(var i=0;i<orders.length;i++){
		var htmlToAdd = '<div class="col-md-4 order">'+
			'<h2 class="orderNumber">'+orders[i].orderNumber+'</h2>'+
			'<ul>'+
				'<li>Name: <span class="name">'+orders[i].name+'</span></li>'+
				'<li>email: <span class="email">'+orders[i].email+'</span></li>'+
				'<li>Line Items: <span class="lineItems">'+orders[i].lineItems+'</span></li>'+
				'<li>Vendor(s): <span class="vendor">'+orders[i].vendor+'</span></li>'+
				'<li>Tags: <span class="tags">'+orders[i].customerTags+'</span></li>'+
				'<li>Amount Spent: $<span class="totalCost">'+orders[i].totalCost+'</span></li>'+
				'<li>Location: <span class="location">'+orders[i].location.name+'</span></li>'+			
				'<li class="hide id">'+orders[i]._id+'</li>'+
			'</ul>'+
			'<button class= "buttondlt" type="button" id="'+orders[i]._id+'" onclick="deleteOrder(event)">Delete Order</button>'+
			'<button class= "buttonedt" type="button" data-toggle="modal" data-target="#editModal"">Edit Order</button>'+
		'</div>';

		jQuery('#order-holder').prepend(htmlToAdd);

	}
}

jQuery('#editModal').on('show.bs.modal', function (e) {
  // let's get access to what we just clicked on
  var clickedButton = e.relatedTarget;
  // now let's get its parent
	var parent = jQuery(clickedButton).parent();

  // now, let's get the values of the pet that we're wanting to edit
  // we do this by targeting specific spans within the parent and pulling out the text
  var name = $(parent).find('.name').text();
  var email = $(parent).find('.email').text();
  var orderNumber = $(parent).find('.orderNumber').text();
  var customerTags = $(parent).find('.tags').text();
  var lineItems = $(parent).find('.lineItems').text();
  var vendor = $(parent).find('.vendor').text();
  var totalCost = $(parent).find('.totalCost').text();
  var location = $(parent).find('.location').text();
  var id = $(parent).find('.id').text();

  console.log(id);

  // now let's set the value of the edit fields to those values
 	jQuery("#edit-name").val(name);
	jQuery("#edit-email").val(email);
	jQuery("#edit-orderNumber").val(orderNumber);
	jQuery("#edit-tags").val(customerTags);
	jQuery("#edit-lineItems").val(lineItems);
	jQuery("#edit-vendor").val(vendor);
	jQuery("#edit-totalCost").val(totalCost);
	jQuery("#edit-location").val(location);
	jQuery("#edit-id").val(id);

})


function deleteOrder(event){
	var targetedId = event.target.id;
	console.log('the order to delete is ' + targetedId);

	// now, let's call the delete route with AJAX
	jQuery.ajax({
		url : '/api/delete/'+targetedId,
		dataType : 'json',
		success : function(response) {
			// now, let's re-render the animals

			renderPlaces();

		}
	})

	event.preventDefault();
}

function clearMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // clears the markers
  }	
}

// when page is ready, initialize the map!
google.maps.event.addDomListener(window, 'load', init);