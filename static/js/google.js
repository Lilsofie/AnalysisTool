let map;
let geoData = null;

export function setGeoData(data) { 
    geoData = data;  
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        console.error('Google Maps API not available.');
    }
}

async function initMap() {
  var lat = 25.0245;
  var lng = 121.5697;

  if (geoData && geoData.latitude && geoData.longitude) {
    lat = parseFloat(geoData.latitude);
    lng = parseFloat(geoData.longitude);
  }
  const position = { lat: lat, lng: lng };
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const mapDiv = document.getElementById("map");
  const mapOptions = {
      center: position,
      zoom: 12,
      mapId: "DEMO_MAP_ID"
  };

  map = new google.maps.Map(mapDiv, mapOptions);
  new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'Lotus' || geoData.city
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof google !== 'undefined' && google.maps) {
    initMap();
  }
});
