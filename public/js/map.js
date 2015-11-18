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

        bindInfoWindow(marker, map, infowindow, '<b>'+ "Order:" + orders[i].orderNumber + "<br>" + orders[i].name + "</b>  + "Amount Spent: $" + orders[i].totalCost + "<br>" + "Vendor: " + orders[i].vendor + "<br>" + orders[i].location.name+ "<br>" );
        
        // keep track of markers
        markers.push(marker);
      }

      // now, render the animal image/data
      //renderOrders(orders);

    }
  })
};

function clearMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // clears the markers
  } 
}

var bindInfoWindow = function(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
}


google.maps.event.addDomListener(window, 'load', init);

// function vendorlist(){
//   var vendorSet = {};
//   for (var i = 0; i < orders.length; i++){
//     set{vendor} = true;
//     vendorSet.add(vendor);
//   }
//   console.log(vendorSet);
// }

