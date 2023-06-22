let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// GET Request to the URL
d3.json(url).then(function(data) {
  console.log(data); //Console the dat retrieved
  featuresData(data.features);

  // Define marker size
  function markersize(magnitude) {
    return magnitude * 5;
  };

  // Define the marker color
  function chooseColor(depth) {
    if (depth < 10) return "#4dff4d";
    else if (depth < 30) return "#eaff00";
    else if (depth < 50) return "#ffd500";
    else if (depth < 70) return "#ff9500";
    else if (depth < 90) return "#ff5500";
    else return "#ff1500";
  }

  function featuresData(earthquakeData) {

    //Function that goes through the features array with a Popup box containing info about the earthquakes
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3> <hr> <p>Date and Time: ${new Date (feature.properties.time)}</p> <hr> <p>Magnitude: ${feature.properties.mag}</p>`);
    }

    // GeoJSON with the features array
    let earthquakesData = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {

        let markers = {
          radius: markersize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.8,
          weight: 1,
          color: "black",
          stroke: true,
        }
        return L.circleMarker(latlng, markers);
      }
    });

    // Show the layers in the map
    createMap(earthquakesData)
  }

  // Create the map
  function createMap(earthquakesData) {
    //Define tile layer
    let grayscaleMap = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", 
      tileSize: 512,
      maxZoom: 20,
      zoomOffset: -1,
      style: 'mapbox/light-v10',
      access_token: api_key
    });

    // Create the streetStylemap with the layers
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 4,
      layers: [grayscaleMap, earthquakesData]
    });

    //Add the legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      depth = [-10, 10, 30, 50, 70, 90];
      div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

      for (let i = 0; i < depth.length; i++) {
        div.innerHTML += '<i style="background:' + chooseColor(depth[i]) + '"></i> ' + depth[i] + (depth[i+1]? '&ndash;' + depth[i+1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap)

  };

})
