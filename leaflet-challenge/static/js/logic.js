// Save the API endpoint into queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Initiate a GET request using the query URL
d3.json(queryUrl).then(function(earthquakeData) {

    //Pass the contents of the 'data.features' object to the 'createFeatures' function.
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});
//Generate markers that scale in size according to magnitude and vary in color based on depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.7,
        opacity: 0.7,
        fillOpacity: 1
    });
}

function createFeatures(earthquakeData) {
    //Create a function that will be executed for each feature in the 'features' array, and within this function, 
    //assign a popup to each feature containing information about the time and location of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    // Generate a GeoJSON layer that encompasses the 'features' array within the 'earthquakeData' object. 
    // execute the 'onEachFeature' function for each individual data entry present in the array."
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });


    //"Pass the earthquakes layer as a parameter to the 'createMap' function."
    createMap(earthquakes);
}
function createMap(earthquakes) {

    // Generate the base map layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    // Generate a map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    
    //"Generate a control, provide baseMaps, overlayMaps as inputs, integrate the control into the map."
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
    
    let legend = L.control({position: 'bottomright'});
   
    legend.onAdd = function (myMap) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 90],
            labels = [],
            legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;

        };

        // Include a legend within the map
        legend.addTo(myMap);
}


//Scale up the marker size on magnitude.
function markerSize(magnitude) {
    return magnitude * 5;
}

//Alter the marker color depending on the depth
function markerColor(depth) {
    return depth > 70 ? '#ff033e' :
            depth > 70 ? '#d2691e' :
            depth > 50 ? '#fbec5d' :
            depth > 30 ? '#00ff00' :
            depth > 10 ? '#50c878' :
                         '#228b22' ;          
}


  
console.log()
