var w = 500;  // Width of the SVG canvas
var h = 300;  // Height of the SVG canvas
var barpadding = 20;  // Padding between bars

var dataset = [14, 5, 26, 23, 9, 10, 14, 24, 25];  // Dataset for the bar chart

// X scale for positioning bars, using scaleBand for ordinal data
var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))  // Domain is the number of data points
               .rangeRound([0, w])  // Range corresponds to the width of the SVG canvas
               .paddingInner(0.05);  // Padding between the bars

// Y scale for the height of the bars, using scaleLinear for continuous data
var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)])  // Domain is from 0 to the maximum value in the dataset
               .range([h, 0]);  // Range is from the height of the SVG to 0 (inverted)

var svg = d3.select("body")  // Select the body element to append the SVG
            .append("svg")  // Append an SVG canvas
            .attr("width", w)  // Set the width of the SVG
            .attr("height", h)  // Set the height of the SVG
            .attr("id", "chart");  // Give the SVG an ID

// Create bars for the chart
svg.selectAll("rect")
    .data(dataset)  // Bind the dataset to the rectangles
    .enter()  // Create placeholders for each data point
    .append("rect")  // Append a rectangle for each data point
    .attr("x", function(d, i) {  
        return xScale(i);  // Set the x position based on the index
    })
    .attr("y", function(d) {
        return yScale(d);  // Set the y position based on the data value
    })
    .attr("width", xScale.bandwidth())  // Set the width of the bar based on the xScale
    .attr("height", function(d) {
        return h - yScale(d);  // Set the height based on the data value
    })
    .attr("fill", "teal")  // Set the fill color for the bars
    .on("mouseover", function(event, d) {
        d3.select(this)  // Change color when hovering over the bar
            .transition()
            .duration(200)
            .attr("fill", "orange");

        // Add a tooltip to show the data value
        svg.append("text")
            .attr("class", "tooltip")
            .attr("x", parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2)
            .attr("y", parseFloat(d3.select(this).attr("y")) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#000")
            .text(d);  // Display the data value
    })
    .on("mouseout", function() {
        d3.select(this)  // Revert the color when the mouse moves out
            .transition()
            .duration(200)
            .attr("fill", "teal");

        // Remove the tooltip
        svg.select(".tooltip").remove();
    });

// Add labels to the bars
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;  // Display the data value as text
    })
    .attr("x", function(d, i) {
        return xScale(i) + (xScale.bandwidth() / 2);  // Center the text horizontally on each bar
    })
    .attr("y", function(d) {
        return yScale(d) + 15;  // Position the text just above each bar
    })
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#fff");  // Set text color to white

// Function to animate the bars with a delay and duration
function animateBars(delayTime, durationTime, easeType) {
    svg.selectAll("rect")
        .transition()
        .delay(function(d, i) {
            return i * delayTime;  // Delay based on the index of the bar
        })
        .duration(durationTime)  // Duration of the transition
        .ease(easeType)  // Easing function for the transition
        .attr("y", function(d) {
            return yScale(d);  // Update the y position
        })
        .attr("height", function(d) {
            return h - yScale(d);  // Update the height of the bars
        });

    svg.selectAll("text")
        .transition()
        .delay(function(d, i) {
            return i * delayTime;
        })
        .duration(durationTime)
        .ease(easeType)
        .attr("y", function(d) {
            return yScale(d) + 15;  // Update the y position of the text
        });
}

// Button functionality to add a new data point
d3.select("#UpdateButton").on("click", function() {
    var newNumber = Math.floor(Math.random() * 25);  // Generate a random number
    dataset.push(newNumber);  // Add the new number to the dataset

    xScale.domain(d3.range(dataset.length));  // Update the xScale with the new data

    var bars = svg.selectAll("rect")
                  .data(dataset);

    bars.transition()  // Move the existing bars
        .attr("x", function(d, i) {
            return xScale(i);
        });

    bars.enter()  // Add new bars for the new data point
        .append("rect")
        .attr("x", w)  // Start the new bar off the screen
        .attr("y", h)  // Set the initial y position to the bottom of the chart
        .attr("width", xScale.bandwidth())
        .attr("height", 0)  // Set initial height to 0
        .attr("fill", "teal")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange");

            svg.append("text")
                .attr("class", "tooltip")
                .attr("x", parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2)
                .attr("y", parseFloat(d3.select(this).attr("y")) - 5)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#000")
                .text(d);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "teal");

            svg.select(".tooltip").remove();
        })
        .merge(bars)  // Merge the new bars with the existing ones
        .transition()
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("height", function(d) {
            return h - yScale(d);
        });

    // Update labels for the new data points
    var labels = svg.selectAll("text")
                    .data(dataset);

    labels.enter()  // Add new labels for the new data point
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

// Button functionality to remove the first data point
d3.select("#Remove").on("click", function() {
    if (dataset.length > 0) {
        dataset.shift();  // Remove the first element from the dataset

        xScale.domain(d3.range(dataset.length));  // Update the xScale

        var bars = svg.selectAll("rect")
                      .data(dataset);

        bars.exit()  // Remove the bars for the removed data
            .transition()
            .attr("x", w)
            .remove();

        bars.transition()
            .attr("x", function(d, i) {
                return xScale(i);
            });

        var labels = svg.selectAll("text")
                        .data(dataset);

        labels.exit()  // Remove the labels for the removed data
              .transition()
              .attr("x", w)
              .remove();

        labels.transition()
              .attr("x", function(d, i) {
                  return xScale(i) + (xScale.bandwidth() / 2);
              });
    }
});

// Animate the bars initially with a cubic easing function
animateBars(100, 1000, d3.easeCubicInOut);
