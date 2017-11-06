var Barchart = function () {
    var newBarchart = {
        drawBarChart: function (data, svgIn) {
            // Set up SVG; conventional margins
            var margin = {top: 30, right: 30, bottom: 20, left: 120};
            var width = 500;
            var height = (function () {
                if (data.length < 20) {
                    return data.length * 41;
                } else {
                    return 20 * 41;
                }
            })();

            // svgIn.selectAll("g").remove();

            d3.select(svgIn).selectAll("g").remove();

            var svg = d3.select(svgIn)
            // .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "barchart");

            // Setting up bar chart
            var barHeight = (function () {
                if (data.length <= 20) {
                    return 40;
                } else {
                    return height / data.length - 1;
                }
            })();

            var xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {return d[1];})])
                .range([0, width - 30]);// Padding to keep text labels from being cut off


            var xAxis = d3.axisBottom(xScale)
                .ticks(5)
                .tickSizeOuter(0);

            var yScale = d3.scaleBand()
                .domain(data.map(function (d) {return d[0];}))
                .range([0, data.length * barHeight + data.length]);

            var yAxis = d3.axisLeft(yScale);

            // Building bar chart
            // Add title
//    svg.append("text")
//        .attr("x", width/2)
//        .attr("y", 0 - (margin.top/2))
//        .attr("class", "title")
//        .text("Lab 2 - D3 Bar Chart");

            // Add bars
            var bar = svg.selectAll("g").data(data).enter()
                .append("g")
                .attr("transform", function (d, i) {return "translate(0," + i * (barHeight + 1) +")";})
                .attr("class", "bars");

            bar.append("rect")
                .attr("width", function (d) {return xScale(d[1]);})
                .attr("height", barHeight - 1);

            bar.append("text")
                .attr("x", function (d) {return xScale(d[1]) + 2;})
                .attr("y", barHeight/2)
                .attr("dy", ".35em") // Center text vertically
                .text(function (d) {return d[1];});

            // Add axes
            svg.append("g")
                .attr("transform", "translate(0, " + (height) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("id", "yaxis")
                .call(yAxis);
        }
    };

    return newBarchart;

};