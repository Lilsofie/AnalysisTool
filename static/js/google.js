let map;

async function initMap() {
  const mapElement = document.getElementById('map');
  const lat = parseFloat(mapElement.dataset.lat);
  const lng = parseFloat(mapElement.dataset.lng);
  const title = mapElement.dataset.title;

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The location
  const position = { lat: lat, lng: lng };

  // The map, centered at position
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  // The marker
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: title,
  });
}

document.addEventListener("DOMContentLoaded", () => {
    initMap();
  });