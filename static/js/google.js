let map;
let geoData = {
  latitude: "25.033130",
  longitude: "121.567720"
};;

export function setGeoData(data) {  
    if (typeof google != 'undefined' && google.maps) {
        geoData = data;
        initMap();
    }

}
function initMap() {
  if (!geoData) {
      console.error('Geo data not available');
      return;
  }

  const mapDiv = document.getElementById("map");

  const lat = parseFloat(geoData.latitude);
  const lng = parseFloat(geoData.longitude);
  const position = { lat:lat,  lng: lng }

  const mapOptions = {
      center: position,
      zoom: 12
  };
  const newMap = new google.maps.Map(mapDiv, mapOptions);
  new google.maps.Marker({
    map:newMap,
    position: position,
    title: geoData.City,
  });
}

document.addEventListener("DOMContentLoaded", () => {
    initMap();
  });