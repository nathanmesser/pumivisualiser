
function ps_v_n(ncp,py,mi,n) {
    return ncp / ((((1-py) * 2 * n * mi)/py) + ncp);
}

function n_v_ps(ncp,py,mi,ps) {
    return ncp/(((1 - py)/py)*(ps/(1-ps))*2*mi);
}

function calc_a(ncp,py,mi) {
    return (ncp * py) / (2*mi*(1-py));
}

function ns_v_mi(ncp,py,n,mi) {
    var a = calc_a(ncp,py,mi);
    return (n * a) / (n + a);
}

function mi_v_ns(ncp,py,n,ns) {
    return (py*ncp*(n-ns)) / ((1-py)*ns*n*2);
}

function n_v_mi_ns(ncp,py,ns,mi) {
    return (ns * py * ncp) / ((py * ncp) - ((1-py)*ns*2*mi));
}

function k(py,ps) {
    return ((1 - py)/py)*(ps/(1-ps));
}

function mi_v_n(ncp,py,ps,n) {
    return ncp / (k(py,ps)*2*n);
}

function n_v_mi(ncp,py,ps,mi) {
    return ncp / (k(py,ps)*2*mi);
}

function mi_v_n_fs(ncp,n) {
    return ncp / (2*n);
}

function n_v_mi_fs(ncp,mi) {
    return ncp / (2*mi);
}

