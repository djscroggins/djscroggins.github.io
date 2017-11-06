var Sunburst = function () {
    var newSunburst = {
        drawSunburst3: function(fileIn, svgIn, inputIn, dimIn) {

            var width = dimIn.width;
            var height = dimIn.height;
            var radius = Math.min(width, height) / 2;
            var color = d3.scaleOrdinal(d3.schemeCategory10);
            var sizeIndicator = "size";
            var colorIndicator = "sentiment";

            var g = d3.select(svgIn)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            // Sunburst data structure.
            var partition = d3.partition()
                .size([2 * Math.PI, radius]);

            d3.json(fileIn, function(error, nodeData) {
                if (error) throw error;


                var root = d3.hierarchy(nodeData)
                    .sum(function (d) { return d.size; })
                    .sort(function(a, b) { return b.value - a.value; });


                partition(root);
                arc = d3.arc()
                    .startAngle(function (d) { d.x0s = d.x0; return d.x0; })
                    .endAngle(function (d) { d.x1s = d.x1; return d.x1; })
                    .innerRadius(function (d) { return d.y0; })
                    .outerRadius(function (d) { return d.y1; });

                var slice = g.selectAll('g')
                    .data(root.descendants())
                    .enter().append('g').attr("class", "node");

                slice.append('path').attr("display", function (d) { return d.depth ? null : "none"; })
                    .attr("d", arc)
                    .style('stroke', '#fff')
                    .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); })
                    .on("click", function (d) {
                        newSunburst.dispatch.call("clicked", {}, d.data.name);
                    });

                //TODO: Add functionality to lighten previously selected nodes

                d3.selectAll(inputIn).on("click", function(d,i) {

                    if (this.value === "size") {
                        root.sum(function (d) { return d.size; });
                    } else {
                        root.count();
                    }

                    partition(root);

                    slice.selectAll("path").transition().duration(750).attrTween("d", arcTweenPath);
                });
            });

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