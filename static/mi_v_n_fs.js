
function init() {
        var throttled_calc = _.debounce(calc_ncp_and_draw,300);

        $( ".graph_relevant_slider" ).slider({
            stop: function( event, ui ) {
                throttled_calc();
            }
        });

        $(".graph_relevant").on("change", function(){
            throttled_calc();
        });

        $("#N").change(update_x);
        $("#mi").change(update_y);
        $("#miOfInterest").change(update_max_y);


        calc_ncp_and_draw();
}

var plot_func;
var inv_plot_func;

function calc_ncp_and_draw() {

    var alpha = parseFloat($("#alpha").val());
    var beta = 1.0 - parseFloat($("#beta").val());
    var df = parseInt($("#df").val());

    var url = "/calc_ncp_chi2/alpha/" + alpha + "/beta/" + beta + "/df/" + df;

    $.get( url, draw);
}

function update_x() {
    $("#mi").val(plot_func(parseInt($("#N").val())));
}

function update_y() {
    $("#N").val(inv_plot_func(parseFloat($("#mi").val())));
}

function update_max_y() {
    $("#maxY").val(Math.floor(3 * inv_plot_func(parseFloat($("#miOfInterest").val()))));
}


function draw(ncp) {
    var ncp_float = parseFloat(ncp);

    inv_plot_func = _.partial(mi_v_n_fs,ncp_float);
    plot_func = _.partial(n_v_mi_fs,ncp_float);

    var mi_of_interest = parseFloat($("#miOfInterest").val());

    var min_x = 0.00001;
    var max_x = 2 * mi_of_interest;

    var max_y = parseInt($("#maxY").val());

    var axes = {
        x : {},
        y : {}
    };
    axes.x.label = "I(X;Y)";
    axes.x.min = min_x;
    axes.x.max = max_x;
    axes.y.label = "N";
    axes.y.min = 0;
    axes.y.max = max_y;

    graph("mi_v_n",plot_func,available_width(),400, axes);
    if ($("#mi").val()) {
        update_x();
    }
}