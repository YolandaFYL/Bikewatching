import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

mapboxgl.accessToken = 'pk.eyJ1IjoieW9sYW5kYS1mZW5nIiwiYSI6ImNtN2xjMGozdTA2YzIyanB2czhoYTh3ZTEifQ.HXlfGvQ65K13Do908pXrdg';
console.log("Mapbox GL JS Loaded:", mapboxgl);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12', 
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18
});

const bikeLaneStyle = {
    'line-color': '#32D400', 
    'line-width': 5, 
    'line-opacity': 0.7
};

function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.Long, +station.Lat);
    const { x, y } = map.project(point);
    return { cx: x, cy: y };
}
  
map.on('load', async () => {
    map.addSource('boston_route', {
      type: 'geojson',
      data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
    });
    map.addSource('cambridge_route', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson'
    });

    map.addLayer({
      id: 'boston-bike-lanes',
      type: 'line',
      source: 'boston_route',
      paint: bikeLaneStyle
    });
    map.addLayer({
      id: 'cambridge-bike-lanes',
      type: 'line',
      source: 'cambridge_route',
      paint: bikeLaneStyle
    });

    let jsonData;
    try {
        const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
        
        const jsonData = await d3.json(jsonurl);
        console.log('Loaded JSON Data:', jsonData);

        let stations = jsonData.data.stations;
        console.log('Stations Array:', stations);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
});