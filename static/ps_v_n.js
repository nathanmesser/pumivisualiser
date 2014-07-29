function calc_ncp_and_draw() {

    var alpha = parseFloat($("#alpha").val());
    var beta = parseFloat($("#beta").val());
    var df = parseInt($("#df").val());

    var url = "/calc_ncp_chi2/alpha/" + alpha + "/beta/" + beta + "/df/" + df;

    $.get( url, draw);
}

function init() {
        $( ".graph_relevant" ).slider({
            stop: function( event, ui ) {
                calc_ncp_and_draw();
            }
        });

        $(".graph_relevant").on("change", function(){
            calc_ncp_and_draw();
        });


        $("#N").change(update_x);
        $("#ps").change(update_y);

        calc_ncp_and_draw();
}

var plot_func;
var inv_plot_func;

function update_x() {
    $("#ps").val(plot_func(parseInt($("#N").val())));
}

function update_y() {
    $("#N").val(inv_plot_func(parseFloat($("#ps").val())));
}

function draw(ncp) {
    var ncp_float = parseFloat(ncp);
    var py = parseFloat($("#py").val());
    var mi = parseFloat($("#mi").val());
    inv_plot_func = _.partial(ps_v_n,ncp_float,py,mi);
    plot_func = _.partial(n_v_ps,ncp_float,py,mi);

    var min_x = parseFloat($("#minX").val());
    var max_x = parseFloat($("#maxX").val());
    graph("ps_v_n","p(s)","N",plot_func,min_x,max_x,available_width(),400);

    if ($("#ps").val()) {
        update_x();
    }
}