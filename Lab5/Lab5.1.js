// Set the width and height of the SVG container
var w = 500; 
var h = 300;

// Set padding between bars
var barpadding = 20;

// Initial dataset for the bar chart
var dataset = [14, 5, 26, 23, 9, 10, 14, 24, 25];

// Define xScale using scaleBand for ordinal data (categorical)
var xScale = d3.scaleBand() 
               .domain(d3.range(dataset.length)) // Create a range of numbers based on the dataset length
               .rangeRound([0, w]) // Scale to fit the width of the chart, rounding values for crisper rendering
               .paddingInner(0.05); // Set padding between the bars

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

// Create bars (rectangles) for each data point in the dataset
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {  // Position each bar horizontally based on its index
        return xScale(i);
    })
    .attr("y", function(d) { // Position the top of each bar based on its value
        return yScale(d);
    }) 
    .attr("width", xScale.bandwidth()) // Set the width of each bar based on the xScale's bandwidth
    .attr("height", function(d) { // Calculate the height of each bar based on its value
        return h - yScale(d); // Height is determined by the difference between max height and data value's position
    })
    .attr("fill", "teal"); // Set the fill color of the bars

// Add text labels to each bar to display the value
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) { // Set the text to display the data value
        return d;
    })
    .attr("x", function(d, i) { // Position the text in the center of each bar
        return xScale(i) + (xScale.bandwidth() / 2);
    })
    .attr("y", function(d) { // Position the text slightly below the top of each bar
        return yScale(d) + 15;
    })
    .attr("text-anchor", "middle") // Align the text to be horizontally centered
    .attr("font-size", "12px") // Set font size for the text
    .attr("fill", "#fff"); // Set the color of the text

// Add event listener for the update button
d3.select("#UpdateButton")
    .on("click", function() { // When the button is clicked, run the following code
        var numValues = dataset.length; // Store the current dataset length
        dataset = []; // Reset the dataset to an empty array for the new data
        var maxValue = 25; // Set the maximum value for the random data
        
        // Generate new random data
        for (var i = 0; i < numValues; i++) {
            var newNumber = Math.floor(Math.random() * maxValue); // Create a random number between 0 and maxValue
            dataset.push(newNumber); // Add the random number to the dataset
        }

        // Update yScale with the new dataset
        yScale.domain([0, d3.max(dataset)]);

        // Update the bars with new data
        svg.selectAll("rect")
            .data(dataset)
            .attr("y", function(d) { // Update the y position of each bar
                return yScale(d);
            })
            .attr("height", function(d) { // Update the height of each bar
                return h - yScale(d);
            });

        // Update the text labels with the new data
        svg.selectAll("text")
            .data(dataset)
            .transition() // Add a smooth transition for the updates
            .duration(500) // Duration of the transition in milliseconds
            .text(function(d) { // Update the text to display the new data value
                return d;
            })
            .attr("x", function(d, i) { // Update the x position to center the text
                return xScale(i) + (xScale.bandwidth() / 2);
            })
            .attr("y", function(d) { // Update the y position to align the text with the new bar height
                return yScale(d) + 15;
            });
    });
