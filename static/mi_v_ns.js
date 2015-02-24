
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

        $("#Ns").change(update_x);
        $("#mi").change(update_y);

        $( window ).resize(function() {
            throttled_calc();
        });

        throttled_calc();
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
    var py = parseFloat($("#py").val());
    var n = parseInt($("#N").val());
    var max_y = n * py;
    var newNs = parseInt($("#Ns").val());
    if (newNs > max_y) {
        $("#Ns").val(max_y);
    }
    $("#mi").val(inv_plot_func(parseInt($("#Ns").val())));
}

function update_y() {
    var py = parseFloat($("#py").val());
    var n = parseInt($("#N").val());
    var max_y = n * py;
    var min_mi = inv_plot_func(max_y);
    var newMi = parseInt($("#mi").val());
    if (newMi < min_mi) {
        $("#mi").val(min_mi);
    }
    $("#Ns").val(Math.ceil(plot_func(parseFloat($("#mi").val()))));
}


function draw(ncp) {
    var ncp_float = parseFloat(ncp);
    var py = parseFloat($("#py").val());
    var n = parseInt($("#N").val());
    inv_plot_func = _.partial(mi_v_ns,ncp_float,py,n);
    plot_func = _.partial(ns_v_mi,ncp_float,py,n);
    var mi_of_interest = parseFloat($("#miOfInterest").val());

    var min_x = 0.00001;
    var max_x = 2 * mi_of_interest;
    var min_y = 0;
    var max_y = n * py;

    $("#Ns").attr('max', max_y);
    $("#mi").attr('min', inv_plot_func(max_y));

    var axes = {
            x : {},
            y : {}
    };
    axes.x.label = "I(X;Y)";
    axes.x.min = min_x;
    axes.x.max = max_x;
    axes.y.label = "Ns";
    axes.y.min = min_y;
    axes.y.max = max_y;
    axes.y.strict = true;

    graph("mi_v_ns",plot_func,available_width(),400, axes);
    if ($("#mi").val()) {
        update_y();
    }
}