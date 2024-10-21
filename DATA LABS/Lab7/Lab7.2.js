const chart = [45, 72, 88, 55, 42, 78, 92];
var w = 300;
var h = 300;

var outerRadius = w / 2;
var innerRadius = 0;

// Create an SVG canvas
var svg = d3.select("svg");

// Set up the arc generator
var arc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

// Set up the pie function to generate pie chart angles
var pie = d3.pie();

// Set up the color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Bind the data to the pie chart arcs
var arcs = svg.selectAll("g.arc")
    .data(pie(chart))  // Use the correct dataset name here
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

// Append path elements for each arc
arcs.append("path")
    .attr("fill", function (d, i) {
        return color(i);
    })
    .attr("d", arc);

    arcs.append("text")
    .text(function(d){
        return d.value ;
    })

    .attr("transform", function(d){
        return "translate("+arc.centroid(d) + ")";
    })