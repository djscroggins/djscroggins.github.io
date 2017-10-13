/**
 * Created by davidscroggins on 10/12/17.
 */

// TODO: refactor to d3.v4
// TODO: experiment with labeling. Label names for test data isn't coming through.
// TODO: change color scheme
// TODO: refactor code to be less dependent on "country/creditor/debtor structure"

var drawChordDuo = function (fileIn, divIn) {


    var width = 480,
        height = 500,
        outerRadius = Math.min(width, height) / 2 - 4,
        innerRadius = outerRadius - 20;

    var format = d3.format(",.3r");

    // Square matrices, asynchronously loaded; credits is the transpose of debits.
    var debits = [],
        credits = [];

    // The chord layout, for computing the angles of chords and groups.
    var layout = d3.layout.chord()
        .sortGroups(d3.descending)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)
        .padding(.04);

    // The color scale, for different categories of “worrisome” risk.
    var fill = d3.scale.ordinal()
        .domain([0, 1, 2])
        .range(["#DB704D", "#D2D0C6", "#ECD08D", "#F8EDD3"]);

    // The arc generator, for the groups.
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // The chord generator (quadratic Bézier), for the chords.
    var chord = d3.svg.chord()
        .radius(innerRadius);

    // Add an SVG element for each diagram, and translate the origin to the center.
    var svg = d3.select(divIn).selectAll("div")
        .data([debits, credits])
        .enter().append("div")
        .style("display", "inline-block")
        .style("width", width + "px")
        .style("height", height + "px")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Load our data file…
    d3.csv(fileIn, type, function(error, data) {
        if (error) throw error;

        var countryByName = d3.map(),
            countryIndex = -1,
            countryByIndex = [];

        // Compute a unique index for each country.
        data.forEach(function(d) {
            if (countryByName.has(d.creditor)) d.creditor = countryByName.get(d.creditor);
            else countryByName.set(d.creditor, d.creditor = {name: d.creditor, index: ++countryIndex});
            if (countryByName.has(d.debtor)) d.debtor = countryByName.get(d.debtor);
            else countryByName.set(d.debtor, d.debtor = {name: d.debtor, index: ++countryIndex});
            d.debtor.risk = d.risk;
        });

        // Initialize a square matrix of debits and credits.
        for (var i = 0; i <= countryIndex; i++) {
            debits[i] = [];
            credits[i] = [];
            for (var j = 0; j <= countryIndex; j++) {
                debits[i][j] = 0;
                credits[i][j] = 0;
            }
        }

        // Populate the matrices, and stash a map from index to country.
        data.forEach(function(d) {
            debits[d.creditor.index][d.debtor.index] = d;
            credits[d.debtor.index][d.creditor.index] = d;
            countryByIndex[d.creditor.index] = d.creditor;
            countryByIndex[d.debtor.index] = d.debtor;
        });

        // For each diagram…
        svg.each(function(matrix, j) {
            var svg = d3.select(this);

            // Compute the chord layout.
            layout.matrix(matrix);

            // Add chords.
            svg.selectAll(".chord")
                .data(layout.chords)
                .enter().append("path")
                .attr("class", "chord")
                .style("fill", function(d) { return fill(d.source.value.risk); })
                .style("stroke", function(d) { return d3.rgb(fill(d.source.value.risk)).darker(); })
                .attr("d", chord)
                // .append("title")
                // .text(function(d) { return d.source.value.debtor.name + " owes " + d.source.value.creditor.name + " $" + format(d.source.value) + "B."; });

            // Add groups.
            var g = svg.selectAll(".group")
                .data(layout.groups)
                .enter().append("g")
                .attr("class", "group");

            // Add the group arc.
            g.append("path")
                .style("fill", function(d) { return fill(countryByIndex[d.index].risk); })
                .attr("id", function(d, i) { return "group" + d.index + "-" + j; })
                .attr("d", arc)
                .append("title")
                .text(function(d) { return countryByIndex[d.index].name + " " + (j ? "owes" : "is owed") + " $" + format(d.value) + "B."; });

            // Add the group label (but only for large groups, where it will fit).
            // An alternative labeling mechanism would be nice for the small groups.
            g.append("text")
                .attr("x", 6)
                .attr("dy", 15)
                .filter(function(d) { return d.value > 110; })
                .append("textPath")
                .attr("xlink:href", function(d) { return "#group" + d.index + "-" + j; })
                .text(function(d) { return countryByIndex[d.index].name; });
        });
    });

    function type(d) {
        d.amount = +d.amount;
        d.risk = +d.risk;
        d.valueOf = value; // for chord layout
        return d;
    }

    function value() {
        return this.amount;
    }
};
