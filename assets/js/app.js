// @TODO: YOUR CODE HERE!
// Set up chart
var svgWidth = 960; //window.innerWidth;
var svgHeight = 500; //window.innerHeight;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 75
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append group element
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the census data file
//d3.csv("assets/data/data.csv", function(error, censusData) {
//    if (error) return console.warn("error: ", error);
//    console.log(censusData);

// Import our CSV data with d3's .csv import method.
var csv = "./assets/data/data.csv"
d3.csv(csv, function(error, censusData) {
    if (error) return console.warn("error: ", error);
    console.log(censusData);

    // Parse the data
    // Format the data and convert to numerical and date values
    censusData.forEach(function(data) {
        data.age = parseFloat(data.age);
        data.ageMoe = parseFloat(data.ageMoe);
        data.healthcare = parseFloat(data.healthcare);
        data.healthcareHigh = parseFloat(data.healthcareHigh);
        data.healthcareLow = parseFloat(data.healthcareLow);
        data.id = +data.id;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.obesity = parseFloat(data.obesity);
        data.obesityHigh = parseFloat(data.obesityHigh);
        data.obesityLow = parseFloat(data.obesityLow);
        data.poverty = parseFloat(data.poverty);
        data.povertyMoe = parseFloat(data.povertyMoe);
        data.smokes = parseFloat(data.smokes);
        data.smokesHigh = parseFloat(data.smokesHigh);
        data.smokesLow = parseFloat(data.smokesLow);
    });

        // Create Scales
        var xPovScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty)])
        .range([0, width]);

    var yHealthScale = d3.scaleLinear()
        .domain([4, d3.max(censusData, d => d.healthcare)])
        .range([height, 0]);

    // Create Axes
    var xAxis = d3.axisBottom(xPovScale).ticks(7); // what are the tickFormat and ticks for see Day 3 Act 8
    var yAxis = d3.axisLeft(yHealthScale); //.tickFormat(formatPercent);

   // Append the axes to the chartGroup - ADD STYLING
    // Add bottomAxis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
        .call(yAxis);

    console.log(censusData);
    // append circles
    var circlesGroup = chartGroup.selectAll("g")
        .data(censusData)
        .enter().append("g");
    console.log(circlesGroup);

    circlesGroup.append("circle")
        .attr("cx", d => xPovScale(d.poverty))
        .attr("cy", d => yHealthScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle"); // refer to d3Style.css file

    // append text to each circle 
    circlesGroup.append("text")
        .attr("x", d => xPovScale(d.poverty))
        .attr("y", d => yHealthScale(d.healthcare))
        .attr("dx", ".05em")
        .attr("dy", ".35em")
        .text(d => d.abbr)
        .attr("class", "stateText") // refer d3Style.css file
        .attr("font-size", "10px");

    // Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });

    // Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
        // Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });
        
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
        
});