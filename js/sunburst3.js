var Sunburst = function () {
    var newSunburst = {
        drawSunburst3: function(fileIn, svgIn, inputIn, dimIn) {

            // Variables
            var width = dimIn.width;
            var height = dimIn.height;
            var radius = Math.min(width, height) / 2;
            var color = d3.scaleOrdinal(d3.schemeCategory10);
            var sizeIndicator = "size";
            var colorIndicator = "sentiment";

            // Size our <svg> element, add a <g> element, and move translate 0,0 to the center of the element.
            var g = d3.select(svgIn)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');


            // Create our sunburst data structure and size it.
            var partition = d3.partition()
                .size([2 * Math.PI, radius]);


            // Get the data from our JSON file
            d3.json(fileIn, function(error, nodeData) {
                if (error) throw error;


                // Find the root node, calculate the node.value, and sort our nodes by node.value
                var root = d3.hierarchy(nodeData)
                    .sum(function (d) { return d.size; })
                    .sort(function(a, b) { return b.value - a.value; });


                // Calculate the size of each arc; save the initial angles for tweening.
                partition(root);
                arc = d3.arc()
                    .startAngle(function (d) { d.x0s = d.x0; return d.x0; })
                    .endAngle(function (d) { d.x1s = d.x1; return d.x1; })
                    .innerRadius(function (d) { return d.y0; })
                    .outerRadius(function (d) { return d.y1; });


                // Add a <g> element for each node; create the slice variable since we'll refer to this selection many times
                var slice = g.selectAll('g')
                    .data(root.descendants())
                    .enter().append('g').attr("class", "node");


                // Append <path> elements and draw lines based on the arc calculations. Last, color the lines and the slices.
                slice.append('path').attr("display", function (d) { return d.depth ? null : "none"; })
                    .attr("d", arc)
                    .style('stroke', '#fff')
                    .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
                    .on("click", function (d) {
                        // alert(d.data.name);
                        newSunburst.dispatch.call("clicked", {}, d.data.name);
                    });

                //TODO: Add functionality to lighten previously selected nodes


                // Redraw the Sunburst Based on User Input
                d3.selectAll(inputIn).on("click", function(d,i) {

                    // Determine how to size the slices.
                    if (this.value === "size") {
                        root.sum(function (d) { return d.size; });
                    } else {
                        root.count();
                    }

                    partition(root);

                    slice.selectAll("path").transition().duration(750).attrTween("d", arcTweenPath);
//            slice.selectAll("text").transition().duration(750).attrTween("transform", arcTweenText);
                });
            });


            /**
             * When switching data: interpolate the arcs in data space.
             * @param {Node} a
             * @param {Number} i
             * @return {Number}
             */
            function arcTweenPath(a, i) {

                var oi = d3.interpolate({ x0: a.x0s, x1: a.x1s }, a);

                function tween(t) {
                    var b = oi(t);
                    a.x0s = b.x0;
                    a.x1s = b.x1;
                    return arc(b);
                }

                return tween;
            }
        },

        getSearchString: function (searchStringIn) {
            return searchStringIn;
        },

        dispatch: d3.dispatch("clicked")

    };
    return newSunburst;
};