// Set the width and height of the SVG container
var w = 500; 
var h = 300;

// Padding between bars
var barpadding = 20;

// Initial dataset for the bar chart
var dataset = [14, 5, 26, 23, 9, 10, 14, 24, 25];

// Define xScale using scaleBand for categorical data (ordinal)
var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length)) // Creates a range of numbers based on the dataset length
               .rangeRound([0, w]) // Scales to fit the width of the chart, rounding values for cleaner rendering
               .paddingInner(0.05); // Sets padding between the bars

// Define yScale using scaleLinear to map data values to pixel height
var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)]) // Scale based on the highest data value in the dataset
               .range([h, 0]); // Invert the range so that higher values appear above lower values

// Create an SVG container for the chart and set its width and height
var svg = d3.select("body")
            .append("svg")
            .attr("width", w) 
            .attr("height", h) 
            .attr("id", "chart"); // Assign an ID to the SVG for easier selection

// Create bars (rectangles) for each data point, initially with height 0 for the animation
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {  
        return xScale(i); // Set the x position of each bar based on its index
    })
    .attr("y", h) // Initially position bars at the bottom for the animation
    .attr("width", xScale.bandwidth()) // Set the width of each bar based on the xScale's bandwidth
    .attr("height", 0) // Initially set the height to 0 for the animation
    .attr("fill", "teal"); // Set the fill color of the bars

// Add text labels to each bar, initially positioned at the bottom for the animation
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) { 
        return d; // Display the data value
    })
    .attr("x", function(d, i) { 
        return xScale(i) + (xScale.bandwidth() / 2); // Position the text in the center of each bar
    })
    .attr("y", h) // Initially position the text at the bottom
    .attr("text-anchor", "middle") // Center the text horizontally
    .attr("font-size", "12px") // Set font size for the text
    .attr("fill", "#fff"); // Set the color of the text

// Function to animate the bars with customizable delay, duration, and easing type
function animateBars(delayTime, durationTime, easeType) {
    svg.selectAll("rect")
        .transition() // Apply transition to the bars for smooth animation
        .delay(function(d, i) { 
            return i * delayTime; // Stagger the animation based on the index
        })
        .duration(durationTime) // Set the duration for each bar's animation
        .ease(easeType) // Set the easing function for smooth effects
        .attr("y", function(d) { 
            return yScale(d); // Animate the bar to its correct y position based on data
        })
        .attr("height", function(d) { 
            return h - yScale(d); // Animate the height of the bar to its correct size
        });

    svg.selectAll("text")
        .transition() // Apply transition to the text for smooth animation
        .delay(function(d, i) {
            return i * delayTime; // Stagger the text animation based on the index
        })
        .duration(durationTime)
        .ease(easeType)
        .attr("y", function(d) {
            return yScale(d) + 15; // Animate the y position of the text to stay inside the bar
        });
}

// Event listener for the fast animation button
d3.select("#fastButton").on("click", function() {
    animateBars(50, 500, d3.easeLinear); // Fast animation with linear easing
});

// Event listener for the slow animation button
d3.select("#slowButton").on("click", function() {
    animateBars(200, 1500, d3.easeBounceOut); // Slow animation with bounce easing
});

// Event listener for the update button
d3.select("#UpdateButton").on("click", function() {
    var numValues = dataset.length; // Store the current number of bars
    dataset = []; // Reset the dataset to an empty array
    var maxValue = 25; // Maximum value for random data generation

    // Generate new random data
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * maxValue); // Create a random number between 0 and maxValue
        dataset.push(newNumber); // Add the random number to the dataset
    }

    // Update yScale with the new data
    yScale.domain([0, d3.max(dataset)]);

    // Reset the bars and labels to their initial state for the new data
    svg.selectAll("rect")
        .data(dataset)
        .attr("y", h) // Reset bars to the bottom
        .attr("height", 0); // Set height to 0 for new animation

    svg.selectAll("text")
        .data(dataset)
        .attr("y", h); // Reset text to the bottom

    // Reapply the staggered animation with default parameters after updating the data
    animateBars(100, 1000, d3.easeCubicInOut); // Smooth cubic easing
});

// Initialize the chart with default staggered animation on page load
animateBars(100, 1000, d3.easeCubicInOut); // Default staggered animation with cubic easing
