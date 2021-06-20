var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryUrl).then(function (data) {
    features(data);
});

//   Prepare data
function features(data) {
    var quakeInfo = [];
    data.features.forEach(function (quakeData) {
        quakeInfo.push({
            place: quakeData.properties.place,
            coordinates: [quakeData.geometry.coordinates[1], quakeData.geometry.coordinates[0]],
            dpt: quakeData.geometry.dpt[2],
            mag: quakeData.properties.mag
        });
    });
    console.log(quakeInfo);
    createMap(quakeInfo);
};

function createMap(quakeInfo) {

    var map = L.map("map", {
        center: [50.0000, -125.0000],
        zoom: 4
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
};





