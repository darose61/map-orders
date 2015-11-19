// CUSTOM JS FILE //
var markers = []; // array to hold map markers


function init() {

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

var renderPlaces = function() {

	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {

			console.log(response);
			var orders = response.orders;
			renderOrders(orders);
		}
	});
}

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

$(document).ready(init);