var width = 300;
var height = 300;
var margin = { top: 20, right: 20, bottom: 30, left: 40 };

var dataset = [
    { apples: 5, oranges: 10, grapes: 22 },
    { apples: 4, oranges: 12, grapes: 28 },
    { apples: 2, oranges: 19, grapes: 32 },
    { apples: 7, oranges: 23, grapes: 35 },
    { apples: 23, oranges: 17, grapes: 43 }
];

// Set up the color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Set the keys (categories)
var keys = ["apples", "oranges", "grapes"];

// Use d3.stack() to prepare the stacked data
var stackedData = d3.stack()
    .keys(keys)(dataset);

// Set up scales
var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {
        return d.apples + d.oranges + d.grapes;
    })])
    .range([height - margin.bottom, margin.top]);

// Create the SVG container
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create groups for each category
var groups = svg.selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function(d, i) {
        return color(i);
    });

// Create the rectangles for each stacked layer
groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("y", function(d) { return yScale(d[1]); })
    .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
    .attr("width", xScale.bandwidth());
