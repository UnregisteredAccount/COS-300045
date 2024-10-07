var w = 500;  // Set the width of the SVG container
var h = 300;  // Set the height of the SVG container
var barpadding = 20;  // Padding between bars

var dataset = [14, 5, 26, 23, 9, 10, 14, 24, 25];  // Sample data for bar chart

// Set up the xScale for positioning bars using d3.scaleBand
var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))  // Set domain as the range of dataset indices
               .rangeRound([0, w])  // Map to the width of the SVG
               .paddingInner(0.05);  // Add padding between bars

// Set up the yScale for bar height using d3.scaleLinear
var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)])  // Set domain from 0 to max value of dataset
               .range([h, 0]);  // Map to the height of the SVG (inverted for proper bar orientation)

// Create an SVG element and append it to the body of the document
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)  // Set the width of the SVG
            .attr("height", h)  // Set the height of the SVG
            .attr("id", "chart");  // Assign an ID to the SVG

// Create rectangles (bars) for the bar chart
svg.selectAll("rect")
    .data(dataset)  // Bind data to the rectangles
    .enter()
    .append("rect")
    .attr("x", function(d, i) {  // Set the x position based on the index using xScale
        return xScale(i);
    })
    .attr("y", h)  // Start bars at the bottom of the chart (height = h)
    .attr("width", xScale.bandwidth())  // Set the width of each bar
    .attr("height", 0)  // Set initial height to 0 for animation
    .attr("fill", "teal");  // Set bar color to teal

// Create labels (text) for the bar chart
svg.selectAll("text")
    .data(dataset)  // Bind data to the text labels
    .enter()
    .append("text")
    .text(function(d) {
        return d;  // Display the data value as the text content
    })
    .attr("x", function(d, i) {  // Set x position of text based on index and xScale
        return xScale(i) + (xScale.bandwidth() / 2);
    })
    .attr("y", h)  // Set the y position to start at the bottom (height = h)
    .attr("text-anchor", "middle")  // Center-align the text
    .attr("font-size", "12px")  // Set font size
    .attr("fill", "#fff");  // Set text color to white

// Function to animate bars with customizable delay, duration, and easing
function animateBars(delayTime, durationTime, easeType) {
    svg.selectAll("rect")
        .transition()
        .delay(function(d, i) {  // Apply delay to each bar
            return i * delayTime;
        })
        .duration(durationTime)  // Set duration of the animation
        .ease(easeType)  // Set the easing function for smooth animation
        .attr("y", function(d) {  // Update y position based on data
            return yScale(d);
        })
        .attr("height", function(d) {  // Update height based on data
            return h - yScale(d);
        });

    // Animate the text labels as well
    svg.selectAll("text")
        .transition()
        .delay(function(d, i) {
            return i * delayTime;
        })
        .duration(durationTime)
        .ease(easeType)
        .attr("y", function(d) {  // Update y position for the text
            return yScale(d) + 15;
        });
}

// Button functionality to add new bars
d3.select("#AddBarButton").on("click", function() {
    var newNumber = Math.floor(Math.random() * 25);  // Generate a random number
    dataset.push(newNumber);  // Add new number to the dataset

    xScale.domain(d3.range(dataset.length));  // Update xScale with new data length

    var bars = svg.selectAll("rect")
                  .data(dataset);  // Bind new data to bars

    bars.transition()
        .attr("x", function(d, i) {  // Update x position of existing bars
            return xScale(i);
        });

    bars.enter()  // Add new bars
        .append("rect")
        .attr("x", w)  // Initially place the new bar outside the chart
        .attr("y", h)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", "teal")
        .merge(bars)  // Merge new and existing bars for consistent transitions
        .transition()
        .attr("x", function(d, i) {
            return xScale(i);  // Set final x position
        })
        .attr("y", function(d) {
            return yScale(d);  // Set final y position
        })
        .attr("height", function(d) {
            return h - yScale(d);  // Set final height
        });

    var labels = svg.selectAll("text")
                    .data(dataset);

    labels.enter()  // Add new labels for new data
          .append("text")
          .text(function(d) {
              return d;
          })
          .attr("x", w)
          .attr("y", h)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "#fff")
          .merge(labels)
          .transition()
          .attr("x", function(d, i) {
              return xScale(i) + (xScale.bandwidth() / 2);
          })
          .attr("y", function(d) {
              return yScale(d) + 15;
          });
});

// Button functionality to remove the first bar
d3.select("#RemoveBarButton").on("click", function() {
    if (dataset.length > 0) {
        dataset.shift();  // Remove the first data point

        xScale.domain(d3.range(dataset.length));  // Update xScale after removal

        var bars = svg.selectAll("rect")
                      .data(dataset);

        bars.exit()  // Remove the first bar
            .transition()
            .attr("x", w)
            .remove();

        bars.transition()  // Update the position of remaining bars
            .attr("x", function(d, i) {
                return xScale(i);
            });

        var labels = svg.selectAll("text")
                        .data(dataset);

        labels.exit()  // Remove the first label
              .transition()
              .attr("x", w)
              .remove();

        labels.transition()  // Update the position of remaining labels
              .attr("x", function(d, i) {
                  return xScale(i) + (xScale.bandwidth() / 2);
              });
    }
});

// Sorting functionality
var sortAscending = true;  // Flag to toggle between ascending and descending

// Event listener for the Sort button
d3.select("#SortButton").on("click", function() {
    dataset.sort(sortAscending ? d3.ascending : d3.descending);  // Sort dataset

    xScale.domain(d3.range(dataset.length));  // Update xScale after sorting

    svg.selectAll("rect")
        .sort(function(a, b) {
            return sortAscending ? d3.ascending(a, b) : d3.descending(a, b);
        })
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {  // Update x position based on sorted data
            return xScale(i);
        });

    svg.selectAll("text")
        .sort(function(a, b) {
            return sortAscending ? d3.ascending(a, b) : d3.descending(a, b);
        })
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {
            return xScale(i) + (xScale.bandwidth() / 2);
        });

    sortAscending = !sortAscending;  // Toggle sorting order for the next click
});

// Initialize with default staggered animation
animateBars(100, 1000, d3.easeCubicInOut);
