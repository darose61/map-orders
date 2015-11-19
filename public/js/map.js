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

  jQuery.ajax({
    url : '/api/get',
    dataType : 'json',
    success : function(response) {

      console.log(response);
      orders = response.orders;
      renderMap(orders);
      var vendorSet = {};
      // now, loop through the animals and add them as markers to the map
      for(var i=0;i<orders.length;i++){
        var vendors = orders[i].vendor;
        for (var j = 0; j < vendors.length; j++){
          if (vendors[j]){
            vendorSet[vendors[j]] = true;
          }
        }
      }
      var vendorArr = Object.keys(vendorSet);

      for (var i = 0; i < vendorArr.length; i++) {
        $('#selectVendor').append(
          $('<option>').text(vendorArr[i]).val(vendorArr[i]));
      }
      $( "#selectVendor" ).on('change', function(){
        var value = this.value;
        if (value == -1){
          rendorPlacesForVendor('All', true);
        } else {
          rendorPlacesForVendor(value, false);
        }
      });
    }
  })
};

var rendorPlacesForVendor = function(vendorName, loadAll) {
  console.log(vendorName);
  console.log(loadAll);
jQuery.ajax({
    url : '/api/get',
    dataType : 'json',
    success : function(response) {

      console.log(response);
      orders = response.orders;
      if (loadAll){
        renderMap(orders);
      } else{
      var ordersForVendor = [];
      for (var i = 0; i < orders.length; i++){
        var isForVendor = false;
        for (var j = 0; j < orders[i].vendor.length; j++){
          if (orders[i].vendor[j] == vendorName){
            isForVendor = true;
          }
        }
        if (isForVendor){
          ordersForVendor.push(orders[i]);
        }
      }
      renderMap(ordersForVendor);
    }
    }
  })
};

var renderMap = function(orders){
  var infowindow =  new google.maps.InfoWindow({
    content: ''
  });
  // first clear any existing markers, because we will re-add below
  clearMarkers();
  markers = [];
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

    bindInfoWindow(marker, map, infowindow, '<b>'+ "Order:" + orders[i].orderNumber + "<br>" + orders[i].name + "</b>" + "<br>"  + "Amount Spent: $" + orders[i].totalCost + "<br>" + "Vendor: " + orders[i].vendor + "<br>" + orders[i].location.name+ "<br>" );
    
    // keep track of markers
    markers.push(marker);
  }
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

