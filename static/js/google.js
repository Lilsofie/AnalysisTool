let map;
let geoData = {
  latitude: "25.033130",
  longitude: "121.567720"
};

export function setGeoData(data) {  
    geoData = data;
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        console.error('Google Maps API not available.');
    }
}

async function initMap() {
  if (!geoData || !geoData.latitude || !geoData.longitude) {
      console.error('Geo data not available');
      return;
  }

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const mapDiv = document.getElementById("map");

  const lat = parseFloat(geoData.latitude);
  const lng = parseFloat(geoData.longitude);
  const position = { lat: lat, lng: lng };

  const mapOptions = {
      center: position,
      zoom: 12,
      mapId: "DEMO_MAP_ID"
  };

  map = new google.maps.Map(mapDiv, mapOptions);
  new AdvancedMarkerElement({
    map: map,
    position: position,
    title: geoData.city || 'No City Info'
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof google !== 'undefined' && google.maps) {
    initMap();
  } else {
    console.error('Google Maps API not available.');
  }
});
