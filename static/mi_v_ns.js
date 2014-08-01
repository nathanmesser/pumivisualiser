
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
    $("#mi").val(inv_plot_func(parseInt($("#Ns").val())));
}

function update_y() {
    $("#Ns").val(Math.ceil(plot_func(parseFloat($("#mi").val()))));
}


function draw(ncp) {
    var ncp_float = parseFloat(ncp);
    var py = parseFloat($("#py").val());
    var n = parseInt($("#N").val());
    inv_plot_func = _.partial(mi_v_ns,ncp_float,py,n);
    plot_func = _.partial(ns_v_mi,ncp_float,py,n);

    var min_x = 0.00001;
    var max_x = 0.2;
    var min_y = 0;
    var max_y = parseInt($("#maxY").val());
    graph("mi_v_ns","I(X;Y)","Number of positive labelled samples required",plot_func,min_x,max_x,min_y,max_y,available_width(),400);
    if ($("#mi").val()) {
        update_y();
    }
}