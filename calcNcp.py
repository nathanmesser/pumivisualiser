#!/usr/bin/env python
import web
import json
from scipy.optimize import minimize_scalar
from scipy.stats import ncx2, chi2
import math

urls = (
    '/calc_ncp_chi2', 'calc_ncps_post_handler',
    '/calc_ncp_chi2/params/(.*)', 'calc_ncps_handler',
    '/calc_ncp_chi2/alpha/(.*)/beta/(.*)/df/(.*)', 'calc_ncp_handler'
)

app = web.application(urls, globals())

def calc_ncp(alpha,beta,df):
    x = chi2.ppf(1-alpha,df)
    def to_minimize(ncp):
        return math.fabs(beta - ncx2.cdf(x,df,ncp))
    res = minimize_scalar(to_minimize)
    return res.x

def calc_from_json(args):
    return calc_ncp(args['alpha'],args['beta'],args['df'])

class calc_ncp_handler:
    def GET(self, alpha, beta, df):
        return calc_ncp(float(alpha),float(beta),int(df))

class calc_ncps_handler:

    def GET(self, args):
        params = json.loads(args)
        return json.dumps(map(calc_from_json,params))

class calc_ncps_post_handler:

    def POST(self):
        params = json.loads(web.data())
        print (len(params))
        return json.dumps(map(calc_from_json,params))

application = app.wsgifunc()

if __name__ == "__main__":
    app.run()



