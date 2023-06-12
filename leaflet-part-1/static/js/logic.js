// create query
let query = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(query).then(function (data) {
    createFeatures(data.features);
  });

  function chooseColor(depth) {
    if (depth <= 10) return "#FFEDA0";
    else if (depth <=30) return "#FED976";
    else if (depth <=50) return "#FEB24C";
    else if (depth <=70) return "#FD8D3C";
    else if (depth <=90) return "#FC4E2A";
    else return "#B10026";
}


function createMarkers(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: feature.properties.mag * 4,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    });
}

function createFeatures(earthquakeData) {
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Latitude:${feature.geometry.coordinates[1]}<br>Longitude:${feature.geometry.coordinates[0]}<br>Depth:${feature.geometry.coordinates[2]}<br>Magnitude:${feature.properties.mag}</p>`);
      },
      pointToLayer: createMarkers
    });

    createMap(earthquakes);
  }

function createMap(earthquakes) {
    let baseMaps = {
      "Street Map": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
      "Topographic Map": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'})
    };

    let myMap = L.map("map", {
      center: [0, 105],
      zoom: 2.5,
      layers: [baseMaps["Street Map"], earthquakes]
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
        limits = [-10, 10, 30, 50, 70, 90];
        labels = [];
    
        for (var i = 0; i < limits.length; i++) {
          div.innerHTML +=
              '<i style="background:' + chooseColor(limits[i] + 1) + '"></i> ' +
              limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
      }
    return div;
    };

    legend.addTo(myMap);

    L.control.layers(baseMaps, {Earthquakes: earthquakes}, {collapsed: false}).addTo(myMap);
}
