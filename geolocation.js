var watchID = null;
var count_detect = 0;
var my_position = null;
var latitude = 0;
var longitude = 0;
var target_position;
var loaded = 0;
var loaded_map_scripts = 0;
$(function(){
	$(".load_map").click(function(){
		
		if ( isComputer() || isOnline() ) {
			getGeolocation();
			setTimeout(function(){
				drawMap('14.599512,120.98421');
			}, 500);
			
		}
		else {
			checkConnection();
			showPage('first_page');
		}
	});
});
/** Loads google map script dynmically.
 *
 * If it's a traditional desktop browser, loads it onInit()
 * If it's mobile(app), then load if online.
 * 
 * @returns {} 
 */
function loadMapScripts() {
	if ( loaded_map_scripts ) {
		loaded_map_scripts = 1;
		alert("map script already loaded");
		return;
	}
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=handleApiReady";
    document.body.appendChild(script);
	$.getScript("js/js/demo.js");
	$.getScript("js/ui/jquery.ui.map.js");
	$.getScript("js/ui/jquery.ui.map.microformat.js");
}

	
function drawMap(target_position)
{
	showPage("map_page");
	/// destroying old map
	$('#map_canvas').gmap('destroy');
	var container = $('#map_canvas').parent();
    $('#map_canvas').remove();
    container.append('<div id="map_canvas"></div>');
    /// eo

	initMap(target_position);
	///$('#map_canvas').gmap('refresh');
}
function initMap(target_position)
{


		$('#map_canvas').gmap(
			{
			'center': target_position
			}
		);
		
		$('#map_canvas').gmap().bind('init', function(evt, map) {
		
		
			$('#map_canvas').gmap('addControl', 'control', google.maps.ControlPosition.LEFT_TOP);
			$('#map_canvas').gmap('addMarker', { 'position':  target_position, 'bounds': true }).click(function() {
				$('#map_canvas').gmap('openInfoWindow', { 'content': '<h2>Target Position in Mandaluyong, Manila</h2>Pionia st.,' }, this);
			});
			$('#map_canvas').gmap('option', 'zoom', 12);
		});
	

}

function refreshMyPosition()
{

			/// icon
			image = "image/gmap_pin_imhere.png";
			///
			if ( my_position) {
				///v = "'"+latitude+","+longitude+"'";
				alert(my_position);
				$('#map_canvas').gmap('addMarker', { 'position':  my_position, 'bounds': true, icon: image }).click(function() {
					$('#map_canvas').gmap('openInfoWindow', { 'content': '<h2>I am here.</h2>' }, this);
				});
			}
}


function initGeolocation()
{
	
}
function deInitGeolocation()
{
		if (watchID != null) {
			navigator.geolocation.clearWatch(watchID);
			watchID = null;
			/// showAlert("길찾기 정보 서비스가 종료되었습니다.");
		}
}

function getGeolocation()
{
	navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
	var options = { timeout: 60000 };
	watchID = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, options);
}

function onGeoSuccess(position)
{
	my_position = position;
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	count_detect ++;
	drawMap();
	
	/**
	data = 'Count:' + count_detect + '<br />'
		+ 'Latitude: ' + position.coords.latitude + '<br />'
		+ 'Longitude: ' + position.coords.longitude + '<br />'
		+ 'Altitude: ' + position.coords.altitude + '<br />'
		+ 'Accuracy: ' + position.coords.accuracy + '<br />'
		+ 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />'
		+ 'Heading: ' + position.coords.heading + '<br />'
		+ 'Speed: ' + position.coords.speed + '<br />'
		+ 'Timestamp: ' + position.timestamp + '<br />';
	$('.map_page').html(data);
		*/
		
}
function onGeoError(error)
{
	alert('code: '    + error.code    + '\n' +                'message: ' + error.message + '\n');
}