var w = 500;
var h = 500;

var color = d3.scaleQuantize()
            .range(["rgb(233,228,235)","rgb(186,128,139)","rgb(126,136,128)","rgb(49,163,84)","rgb(0,109,44)"]);

var projection = d3.geoMercator()
.center([145,-36]) //do this to set the default view from the whole world to VIctoria
.translate([w/2,h/2])
.scale(2450);

var path = d3.geoPath()
     .projection(projection); //used for map later when it called path
var svg = d3.select("body")
    .append("svg")
    .attr("width",w)
    .attr("height",h)
    .attr("fill","grey");
var choroplethGroup = svg.append("g").attr("id", "choropleth");
var cityGroup = svg.append("g").attr("id", "cities");
d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
    color.domain([
        d3.min(data, function(d){return d.unemployed;}),
        d3.max(data,function(d){return d.unemployed;})
    ]);
    d3.json("LGA_VIC.json").then(function(json){
  
        for (var i =0;i<data.length;i++){
            //city name grab
            var dataState = data[i].LGA;
            //Grab value, convert string to float
            var dataValue = parseFloat(data[i].unemployed);
            //Find corresponding LGA inside the GeoJSON
            for (var j =0; j < json.features.length;j++){
                var jsonState = json.features[j].properties.LGA_name;
                if (dataState==jsonState){
                    
                    json.features[j].properties.value = dataValue;
                   
                    break;
                }
            }
        }

        choroplethGroup.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d",path)
        .style("fill",function(d){
            //get data value
            var value = d.properties.value;

            if (value) {
                //if value exists
                return color(value);
            } else{
                //if value undefined
                return "#ccc"; //light gray
            }
        });
    });
});
d3.csv("VIC_city.csv").then(function(data) {
    // Select the tooltip div
    var tooltip = d3.select("#tooltip");

    cityGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([+d.lon, +d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([+d.lon, +d.lat])[1];
        })
        .attr("r", 5)
        .style("fill", "yellow")
        // Add mouseover event to show the tooltip
        .on("mouseover", function(event, d) {
            tooltip
                .style("display", "block")  // Show the tooltip
                .text(d.place);  // Display the city name (stored in 'place' column)
        })
        // Move the tooltip as the mouse moves
        .on("mousemove", function(event, d) {
            tooltip
                .style("left", (event.pageX + 10) + "px")  // Position the tooltip near the mouse
                .style("top", (event.pageY - 20) + "px");
        })
        // Hide the tooltip on mouseout
        .on("mouseout", function() {
            tooltip.style("display", "none");  // Hide the tooltip
        });
});
