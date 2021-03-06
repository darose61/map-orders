var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); // mongoDB library
var geocoder = require('geocoder'); // geocoder library

// our db model
var Order = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
 router.get('/', function(req,res){
	res.render('index.html');
})

router.post ('/', function(req, res){

if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

		// now, let's geocode the location
		geocoder.geocode(location, function (err,data) {


			// if we get an error, or don't have any results, respond back with error
			if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
				var error = {status:'ERROR', message: 'Error finding location'};
				return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
			}

			// else, let's pull put the lat lon from the results
			var lon = data.results[0].geometry.location.lng;
			var lat = data.results[0].geometry.location.lat;

			// now, let's add this to our animal object from above
			orderObj.location = {
				geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
				name: data.results[0].formatted_address // the location name
			}

			// now, let's save it to the database
			// create a new animal model instance, passing in the object we've created
			var order = new Order(orderObj);

			// now, save that animal instance to the database
			// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
			order.save(function(err,data){
				// if err saving, respond back with error
				if (err){
					console.log(err);
					var error = {status:'ERROR', message: 'Error saving order'};
					return res.json(error);
				}

				console.log('saved a new order!');
				console.log(data);

				// now return the json data of the new animal
				var jsonData = {
					status: 'OK',
					order: data
				}

				return res.json(jsonData);

				});
		});
})


router.get('/json', function(req, res) {
	
	var jsonData = {
		'name': 'geolocated-orders',
		'api-status':'OK'
	}

	// respond with json data
	res.json(jsonData)
});

// simple route to show the pets html
router.get('/orders', function(req,res){
	res.render('orders.html');
})


// /**
//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

router.post('/webhooks/newOrder', function(req, res){
		// console.log('the data we received is --> ')
		//console.log(req.body);

		var name = req.body.customer.first_name + ' ' + req.body.customer.last_name;
		var email = req.body.email;
		var orderNumber = req.body.order_number;
		var customerTags = req.body.customer.tags.split(","); 
		var lineItems = [];
		for (var i = 0; i < req.body.line_items.length; i++){
			lineItems.push(req.body.line_items[i].title);
		};

		var vendor = [];
		for (var i = 0; i < req.body.line_items.length; i++){
			vendor.push(req.body.line_items[i].vendor);
		};
		// req.body.line_items.forEach(function(line_item){
		//     lineItems.append(line_item.title);
		// });
		
		var totalCost = req.body.total_price;
		//var url = req.body.url;
		var location = req.body.shipping_address.zip;
		
		var orderObj = {
					name: name,
					email: email,
					orderNumber: orderNumber,
					customerTags: customerTags,
					lineItems: lineItems,
					vendor: vendor,
					totalCost: totalCost,
					location: location
				};

		// if there is no location, return an error
		if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

		// now, let's geocode the location
		geocoder.geocode(location, function (err,data) {


			// if we get an error, or don't have any results, respond back with error
			if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
				var error = {status:'ERROR', message: 'Error finding location'};
				return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
			}

			// else, let's pull put the lat lon from the results
			var lon = data.results[0].geometry.location.lng;
			var lat = data.results[0].geometry.location.lat;

			// now, let's add this to our animal object from above
			orderObj.location = {
				geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
				name: data.results[0].formatted_address // the location name
			}

			// now, let's save it to the database
			// create a new animal model instance, passing in the object we've created
			var order = new Order(orderObj);

			// now, save that animal instance to the database
			// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
			order.save(function(err,data){
				// if err saving, respond back with error
				if (err){
					console.log(err);
					var error = {status:'ERROR', message: 'Error saving order'};
					return res.json(error);
				}

				console.log('saved a new order!');
				console.log(data);

				// now return the json data of the new animal
				var jsonData = {
					status: 'OK',
					order: data
				}

				return res.json(jsonData);

			}) 

		}); 

});



router.post('/api/create', function(req, res){

		console.log('the data we received is --> ')
		console.log(req.body);

		// pull out the information from the req.body
		var name = req.body.name;
		var email = req.body.email;
		var orderNumber = req.body.orderNumber;
		var customerTags = req.body.customerTags.split(","); // split string into array
		var lineItems = req.body.lineItems.split(","); // split string into array
		var vendor = req.body.vendor.split(",");
		var totalCost = req.body.totalCost;
		//var url = req.body.url;
		var location = req.body.location;
		

		// hold all this data in an object
		// this object should be structured the same way as your db model
		var orderObj = {
			name: name,
			email: email,
			orderNumber: orderNumber,
			customerTags: customerTags,
			lineItems: lineItems,
			vendor: vendor,
			totalCost: totalCost,
			location: location
		};

		// if there is no location, return an error
		if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

		// now, let's geocode the location
		geocoder.geocode(location, function (err,data) {


			// if we get an error, or don't have any results, respond back with error
			if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
				var error = {status:'ERROR', message: 'Error finding location'};
				return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
			}

			// else, let's pull put the lat lon from the results
			var lon = data.results[0].geometry.location.lng;
			var lat = data.results[0].geometry.location.lat;

			// now, let's add this to our animal object from above
			orderObj.location = {
				geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
				name: data.results[0].formatted_address // the location name
			}

			// now, let's save it to the database
			// create a new animal model instance, passing in the object we've created
			var order = new Order(orderObj);

			// now, save that animal instance to the database
			// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
			order.save(function(err,data){
				// if err saving, respond back with error
				if (err){
					var error = {status:'ERROR', message: 'Error saving order'};
					return res.json(error);
				}

				console.log('saved a new order!');
				console.log(data);

				// now return the json data of the new animal
				var jsonData = {
					status: 'OK',
					order: data
				}

				return res.json(jsonData);

			}) 

		}); 
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the animal to get
//  * @param  {String} req.param('id'). The animalId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

	var requestedId = req.param('id');

	// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
	Order.findById(requestedId, function(err,data){

		// if err or no user found, respond with error 
		if(err || data == null){
			var error = {status:'ERROR', message: 'Could not find that order'};
			 return res.json(error);
		}

		// otherwise respond with JSON data of the animal
		var jsonData = {
			status: 'OK',
			order: data
		}

		return res.json(jsonData);
	
	})
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

	// mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
	Order.find(function(err, data){
		// if err or no animals found, respond with error 
		if(err || data == null){
			var error = {status:'ERROR', message: 'Could not find orders'};
			return res.json(error);
		}

		// otherwise, respond with the data 

		var jsonData = {
			status: 'OK',
			orders: data
		} 

		res.json(jsonData);

	})

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.param('id'). The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

	 var requestedId = req.param('id');

	 var dataToUpdate = {}; // a blank object of data to update

		// pull out the information from the req.body and add it to the object to update
		var name, email, customerTags, lineItems, vendor, totalCost, location; 

		// we only want to update any field if it actually is contained within the req.body
		// otherwise, leave it alone.
		if(req.body.name) {
			name = req.body.name;
			// add to object that holds updated data
			dataToUpdate['name'] = name;
		}
		if(req.body.email) {
			email = req.body.email;
			// add to object that holds updated data
			dataToUpdate['email'] = email;
		}

		var lineItems = []; // blank array to hold tags
		if(req.body.lineItems){
			lineItems = req.body.lineItems.split(","); // split string into array
			// add to object that holds updated data
			dataToUpdate['lineItems'] = lineItems;
		}

		var vendor = []; // blank array to hold tags
		if(req.body.vendor){
			vendor = req.body.vendor.split(","); // split string into array
			// add to object that holds updated data
			dataToUpdate['vendor'] = vendor;
		}

		if(req.body.totalCost) {
			totalCost = req.body.totalCost;
			// add to object that holds updated data
			dataToUpdate['totalCost'] = totalCost;
		}

		if(req.body.orderNumber) {
			orderNumber = req.body.orderNumber;
			// add to object that holds updated data
			dataToUpdate['orderNumber'] = orderNumber;
		}

		var customerTags = []; // blank array to hold tags
		if(req.body.tags){
			customerTags = req.body.tags.split(","); // split string into array
			// add to object that holds updated data
			dataToUpdate['customerTags'] = customerTags;
		}


		if(req.body.location) {
			location = req.body.location;
			dataToUpdate['location'] = location;
		}

		// if there is no location, return an error
		if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

		// now, let's geocode the location
		geocoder.geocode(location, function (err,data) {


			// if we get an error, or don't have any results, respond back with error
			if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
				var error = {status:'ERROR', message: 'Error finding location'};
				return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
			}

			// else, let's pull put the lat lon from the results
			var lon = data.results[0].geometry.location.lng;
			var lat = data.results[0].geometry.location.lat;

			// now, let's add this to our animal object from above
			dataToUpdate['location'] = {
				geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
				name: data.results[0].formatted_address // the location name
			}

			console.log('the data to update is ' + JSON.stringify(dataToUpdate));

			// now, update that animal
			// mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
			Order.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
				// if err saving, respond back with error
				if (err){
					var error = {status:'ERROR', message: 'Error updating order'};
					return res.json(error);
				}

				console.log('updated the order!');
				console.log(data);

				// now return the json data of the new person
				var jsonData = {
					status: 'OK',
					order: data
				}

				return res.json(jsonData);

			})

		});     

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.param('id'). The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

	var requestedId = req.param('id');

	// Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
	Order.findByIdAndRemove(requestedId,function(err, data){
		if(err || data == null){
			var error = {status:'ERROR', message: 'Could not find that order to delete'};
			return res.json(error);
		}

		// otherwise, respond back with success
		var jsonData = {
			status: 'OK',
			message: 'Successfully deleted id ' + requestedId
		}

		res.json(jsonData);

	})

})

module.exports = router;