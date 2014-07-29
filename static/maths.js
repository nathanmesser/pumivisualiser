
function ps_v_n(ncp,py,mi,n) {
    return ncp / ((((1-py) * 2 * n * mi)/py) + ncp);
}

function n_v_ps(ncp,py,mi,ps) {
    return ncp/(((1 - py)/py)*(ps/(1-ps))*2*mi);
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
