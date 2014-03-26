var go = function(){
	var map = new L.Map('map', {
		center: new L.LatLng(45.518, -122.68),
		zoom: 6,
		layers: [toner],
		attributionControl: false
	});
	//The following mutes toner-lite even more when appropriate
	var bounds = [[-90, -180], [90, 180]];
	L.rectangle(bounds, {color: "#fff", stroke:false, fillOpacity:0.7, clickable:false}).addTo(map);

	
	//add attribution
	L.control.attribution({position: 'bottomright', prefix: '<a href="http://leafletjs.com/">Leaflet</a>, tiles: <a href="http://stamen.com">Stamen</a>, data: <a href="http://openstreetmap.org">OSM</a>, elevation: <a href="http://beta.usgs.gov/products/products.html?utm_source=Social_Launch&utm_medium=Twitter&utm_campaign=Beta#topic_mapping">USGS</a>'}).addTo(map);
	
	//add the header from js include and set title
	$("body").prepend(headerHTML);
	$(".demotitle").text(title);
	
	//map location bits using leaflet's built in geolocation method. 
	//http://leafletjs.com/reference.html#map-locate
	marker.addTo(map);
	map.on('locationfound',function(e){foundHandler(e)});
	map.on('locationerror',function(e){foundError(e)});
	map.locate({watch:true,enableHighAccuracy:true});
}

//set vars
var title = "howhighami"
,tonerUrl = 'http://tile.stamen.com/terrain/{z}/{x}/{y}.png'
,toner = new L.TileLayer(tonerUrl, {maxZoom: 18, attribution: '', subdomains: ['a1', 'a2', 'a3']})
,baseMaps = {
	"Toner": toner
};

//some functions
function foundHandler(location){
	var ll = location.latlng;
	lat = ll.lat;
	lng = ll.lng;
	getEle(lat,lng);if (!marker) marker = L.userMarker(location.latlng).addTo(map);
    marker.setLatLng(location.latlng);
}
function foundError(event){
	alert(' Well, we aren\'t able to find you, so we don\'t know how high you are. Sorry!' );
}
function getEle(lat,lng){
	var suffix = "http://gisdata.usgs.net/xmlwebservices2/elevation_service.asmx/getElevation?X_Value="+lng+"&Y_Value="+lat+"&Elevation_Units=FEET&Source_Layer=&Elevation_Only="
	$.ajax({
		url:'php/proxy.php',
		type:'post',
		dataType:"xml",
		data:{sfx:suffix},
		success:function(data){
			var eleString = $(data).find("Elevation").text();
			eleString = eleString.substr(0,eleString.indexOf('.'));
			$("#elevation").html('Hey! You are <h1>'+addCommas(eleString)+'\'</h1>high. Nice.');
		}
	});
}
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
var marker = L.userMarker(new L.LatLng(0, 0), {pulsing:true, smallIcon:true});
//ready...set...
$( document ).ready(go());