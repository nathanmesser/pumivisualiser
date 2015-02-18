function drawLine(graph, width, x, y, func_to_graph, axes) {

    var data_min = axes.x.min;
    var data_max = axes.x.max;
    var y_min = axes.y.min;
    var y_max = axes.y.max;

    var x_to_data = d3.scale.linear().domain([0, width]).range([data_min, data_max]);

    var data = d3.range(width).map(function(d){
        var data_x = x_to_data(d);
        return {
            data_x: data_x,
            data_y: func_to_graph(data_x)
        };
    }).filter(function(d){
        return d.data_y > y_min;
    });

    var line = d3.svg.line()
        .x(function(d) { return x(d.data_x); })
        .y(function(d) { return y(d.data_y); });

    graph.append("path").attr("d", line(data));

    var circle = graph.append("circle").attr("r", 5).attr("visibility", "hidden");

    var graphElement = document.querySelector(".graph");
    graphElement.addEventListener('mousemove',
        function showMouse(event) {
            var data_x = x_to_data(event.offsetX - 80);
            var data_y = func_to_graph(x_to_data(event.offsetX - 80));
            circle.attr('cx', x(data_x));
            circle.attr('cy', y(data_y));
            if (data_y >= y_min && data_y <= y_max && data_x >= data_min && data_x <= data_max) {
                circle.attr('visibility', 'visible');
            } else {
                circle.attr("visibility", "hidden");
            }

    });

}

function add_x_axis(graph, x, width, height, x_axis_label) {

    var noXTicks = width / 50;
    var xAxis = d3.svg.axis().scale(x).tickSize(-height,5).tickFormat(d3.format('s')).ticks(noXTicks);

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height+ ")")
        .call(xAxis);

    // Add an x-axis label.
    graph.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .text(x_axis_label);
}

function add_y_axis(graph, y, width, y_axis_label) {

    var yAxisLeft = d3.svg.axis().scale(y).orient("left").tickSize(-width,5).tickFormat(d3.format('s'));

    graph.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxisLeft);



    // Add a y-axis label.
    graph.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", 0)
        .attr("transform", "rotate(-90)")
        .text(y_axis_label);

}


/**
*/
function graph( graph_id, func_to_graph, g_width, g_height, axes, lowest_valid_y) {

    $("#" + graph_id).empty();

    var left_margin = 80;
    var right_margin = 20;
    var top_margin = 20;
    var bottom_margin= 80;

    var width = g_width - (left_margin + right_margin);
    var height = g_height - (top_margin + bottom_margin);

    var graph = d3.select("#" + graph_id).append("svg")
        .attr("width", g_width)
        .attr("height", g_height)
        .append("g")
        .attr("transform", "translate(" + left_margin + "," + top_margin + ")");

    var data_min = axes.x.min;
    var data_max = axes.x.max;
    var y_min = axes.y.min;
    var y_max = axes.y.max;
    var x = d3.scale.linear().domain([data_min, data_max]).range([0, width]);
    var y = d3.scale.linear().domain([y_min, y_max]).range([height, 0]);

    drawLine(graph, width, x, y, func_to_graph, axes);

    add_x_axis(graph, x, width, height, axes.x.label);

    add_y_axis(graph, y, width, axes.y.label);

    if (lowest_valid_y) {
        var valid_offset = (( lowest_valid_y * 100 ) / y_max) + "%";
        console.log('lowest valid y is: ' + lowest_valid_y + '. offset is ' + valid_offset);
        graph.append("linearGradient")
              .attr("id", "gradient")
              .attr("gradientUnits", "userSpaceOnUse")
              .attr("x1", 0).attr("y1", height)
              .attr("x2", 0).attr("y2", 0)
            .selectAll("stop")
              .data([
                {offset: "0%", color: "red"},
                {offset: valid_offset, color: "red"},
                {offset: valid_offset, color: "steelblue"},
                {offset: "100%", color: "steelblue"}
              ])
            .enter().append("stop")
              .attr("offset", function(d) { return d.offset; })
              .attr("stop-color", function(d) { return d.color; });
    }
}

function available_width() {
    return $(".graph_container").width();
}

