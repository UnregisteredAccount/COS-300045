var w = 500;
var h = 300;

// Define projection
var projection = d3.geoMercator()
    .center([145, -36.5]) // Focus on Victoria
    .translate([w / 2, h / 2]) // Center it in the SVG
    .scale(2450); // Adjust scale for visibility

// Define path generator
var path = d3.geoPath()
    .projection(projection);

// Create SVG canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "grey");

// Load GeoJSON data
d3.json("LGA_VIC.json").then(function(json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path) // Create path from GeoJSON data
        .attr("stroke", "black") // Add border
        .attr("fill", "lightgrey"); // Fill color
});
