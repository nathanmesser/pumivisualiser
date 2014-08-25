
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

        $("#N").change(update_y);
        $("#mi").change(update_x);

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
    $("#N").val(Math.ceil(inv_plot_func(parseFloat($("#mi").val()))));
}

function update_y() {
    $("#mi").val(plot_func(parseInt($("#N").val())));
}


function draw(ncp) {
    var ncp_float = parseFloat(ncp);
    var py = parseFloat($("#py").val());
    var ns = parseInt($("#Ns").val());
    plot_func = _.partial(mi_v_ns,ncp_float,py,_,ns);
    inv_plot_func = _.partial(n_v_mi_ns,ncp_float,py,ns);

    var min_x = 0.00001;
    var max_x = 1000;
    var min_y = 0;
    var max_y = parseFloat($("#maxY").val());
    graph("mi_v_n","Total number of samples required","I(X;Y)",plot_func,min_x,max_x,min_y,max_y,available_width(),400);
    if ($("#mi").val()) {
        update_y();
    }
}