// Set the width and height of the SVG container
var w = 500; 
var h = 300;

// Padding between bars (not used directly in the bar layout here)
var barpadding = 20;

// Initial dataset for the bar chart
var dataset = [14, 5, 26, 23, 9, 10, 14, 24, 25];

// Define xScale using scaleBand for the x-axis (ordinal data)
var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length)) // Create a range of numbers based on the dataset length
               .rangeRound([0, w]) // Map domain values to the width of the chart
               .paddingInner(0.05); // Add space between the bars

// Define yScale using scaleLinear for the y-axis (linear data)
var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)]) // Scale the data based on the maximum value
               .range([h, 0]); // Invert the range so that higher values go to the top

// Create the SVG container and set its size
var svg = d3.select("body")
            .append("svg")
            .attr("width", w) 
            .attr("height", h)
            .attr("id", "chart"); // Assign an ID to the SVG for selection purposes

// Bind data to rectangles and create the initial bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i); // Position the bars based on the index
    })
    .attr("y", h) // Start the bars from the bottom (for animation)
    .attr("width", xScale.bandwidth()) // Set the width based on the xScale bandwidth
    .attr("height", 0) // Set height to 0 for initial animation effect
    .attr("fill", "teal"); // Set the fill color of the bars

// Add text labels to the bars
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) { 
        return d; // Display the data value as text
    })
    .attr("x", function(d, i) {
        return xScale(i) + (xScale.bandwidth() / 2); // Center the text horizontally on the bar
    })
    .attr("y", h) // Initially position the text at the bottom for animation
    .attr("text-anchor", "middle") // Center the text
    .attr("font-size", "12px") // Set the font size
    .attr("fill", "#fff"); // Set the text color to white

// Function to animate bars and labels with customizable delay, duration, and easing
function animateBars(delayTime, durationTime, easeType) {
    // Animate the bars
    svg.selectAll("rect")
        .transition()
        .delay(function(d, i) {
            return i * delayTime; // Stagger animation for each bar
        })
        .duration(durationTime) // Set the duration for the transition
        .ease(easeType) // Set the easing function
        .attr("y", function(d) {
            return yScale(d); // Animate the y position to the correct value
        })
        .attr("height", function(d) {
            return h - yScale(d); // Animate the height to match the data value
        });

    // Animate the text labels
    svg.selectAll("text")
        .transition()
        .delay(function(d, i) {
            return i * delayTime; // Stagger animation for each label
        })
        .duration(durationTime) 
        .ease(easeType)
        .attr("y", function(d) {
            return yScale(d) + 15; // Position the text inside the bar
        });
}

// Update button functionality - Adds one new data point to the chart
d3.select("#UpdateButton").on("click", function() {
    // Generate one new random number and add it to the dataset
    var newNumber = Math.floor(Math.random() * 25); 
    dataset.push(newNumber); // Add the new data point

    // Update the xScale domain to reflect the new dataset size
    xScale.domain(d3.range(dataset.length));

    // Bind the updated data to the bars
    var bars = svg.selectAll("rect")
                  .data(dataset);

    // Update existing bars' x positions
    bars.transition()
        .attr("x", function(d, i) {
            return xScale(i); // Reposition bars
        });

    // Create new bars for the new data point
    bars.enter()
        .append("rect")
        .attr("x", w) // Start from the right for the new bar (for animation)
        .attr("y", h) // Start from the bottom
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", "teal")
        .merge(bars)
        .transition()
        .attr("x", function(d, i) {
            return xScale(i); // Position the bars correctly
        })
        .attr("y", function(d) {
            return yScale(d); // Set the y position
        })
        .attr("height", function(d) {
            return h - yScale(d); // Set the height based on the data value
        });

    // Update text labels for the new data
    var labels = svg.selectAll("text")
                    .data(dataset);

    // Create new labels for the new data point
    labels.enter()
          .append("text")
          .text(function(d) {
              return d;
          })
          .attr("x", w) // Start from the right
          .attr("y", h)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "#fff")
          .merge(labels)
          .transition()
          .attr("x", function(d, i) {
              return xScale(i) + (xScale.bandwidth() / 2); // Center the text
          })
          .attr("y", function(d) {
              return yScale(d) + 15; // Set y position for the text
          });
});

// Remove button functionality - Removes the first data point
d3.select("#Remove").on("click", function() {
    if (dataset.length > 0) {
        dataset.shift(); // Remove the first data point

        // Update the xScale domain
        xScale.domain(d3.range(dataset.length));

        // Bind the updated data to rectangles
        var bars = svg.selectAll("rect")
                      .data(dataset);

        // Remove exiting bars
        bars.exit()
            .transition()
            .attr("x", w) // Move the exiting bar to the right
            .remove(); // Remove the bar

        // Update the positions of the remaining bars
        bars.transition()
            .attr("x", function(d, i) {
                return xScale(i); // Reposition bars
            });

        // Bind updated data to text
        var labels = svg.selectAll("text")
                        .data(dataset);

        // Remove exiting labels
        labels.exit()
              .transition()
              .attr("x", w) // Move the text to the right before removing
              .remove(); // Remove the text

        // Update remaining labels' positions
        labels.transition()
              .attr("x", function(d, i) {
                  return xScale(i) + (xScale.bandwidth() / 2); // Center the text
              });
    }
});

// Initialize the chart with default staggered animation on page load
animateBars(100, 1000, d3.easeCubicInOut); // Default animation on initialization
