function graph(graph_id,x_axis_label,y_axis_label,func_to_graph,data_min,data_max,y_min,y_max,g_width,g_height) {

    $("#" + graph_id).empty();

    var m = [20, 20, 80, 80];
    var width = g_width - m[1] - m[3];
    var height = g_height - m[0] - m[2];
    var sample = 500;

    var x_to_data = d3.scale.linear().domain([0, sample]).range([data_min, data_max]);


    var data = d3.range(sample).map(function(d){
        var data_x = x_to_data(d);
        return {
            data_x: data_x,
            data_y: func_to_graph(data_x)
        };
    }).filter(function(d){
        return d.data_y > y_min;
    });

    var x = d3.scale.linear().domain([data_min, data_max]).range([0, width]);
    var y = d3.scale.linear().domain([y_min, y_max]).range([height, 0]);

    var line = d3.svg.line()
        .x(function(d) { return x(d.data_x); })
        .y(function(d) { return y(d.data_y); });

    var graph = d3.select("#" + graph_id).append("svg")
        .attr("width", width + m[1] + m[3])
        .attr("height", height + m[0] + m[2])
        .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

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

    var yAxisLeft = d3.svg.axis().scale(y).orient("left").tickSize(-width,5).tickFormat(d3.format('s'));

    graph.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxisLeft);

    graph.append("path").attr("d", line(data));

    // Add a y-axis label.
    graph.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("x", 0)
        .attr("transform", "rotate(-90)")
        .text(y_axis_label);
}

function available_width() {
    return $(".graph_container").width();
}

