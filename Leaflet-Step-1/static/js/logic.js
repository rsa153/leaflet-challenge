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

    for (var i = 0; i < quakeInfo.length; i++) {

        var color_scale = chroma.scale(['Blue', 'Green', 'Red']).mode('lab').gamma(2);
        color = color_scale((quakeInfo[i].dpt / 10)).hex()

        var circleLayer = L.circle(quakeInfo[i].coordinates, {
            color: "Beige",
            weight: 0.5,
            fillColor: color,
            fillOpacity: 0.75,
            radius: quakeInfo[i].mag * 15000

        }).bindPopup("<h1>" + quakeInfo[i].place + "</h1> <hr> <h3>Magnitude: " + quakeInfo[i].mag + "   ||   Depth: " + quakeInfo[i].dpt + "</h3>")
            .addTo(map);
        circleLayer.on('mouseover', function (e) {
            e.target.bringToFront();
        });
        circleLayer.addTo(map);
    };

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>All Earthquakes from the past 7 Days</h4>";
        div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #648FFF"></i> &nbsp;&nbsp; &lt; 5 </span><br>';
        div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #785EF0"></i> &nbsp;&nbsp; 5 - 10</span><br>';
        div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #DC267F"></i> &nbsp;&nbsp; 10 - 20</span><br>';
        div.innerHTML += '<span><i class="bi bi-circle-fill" style="color: #FE6100"></i> &nbsp;&nbsp; 20 - 50</span><br>';
        return div;
    };
    legend.addTo(map);
};