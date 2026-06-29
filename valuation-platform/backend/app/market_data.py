import yfinance as yf

def get_company_data(ticker):

    stock = yf.Ticker(ticker)

    info = stock.info

    revenue = info.get("totalRevenue", 0)

    ebitda = info.get("ebitda", 0)

    ebitda_margin = 0

    if revenue and revenue > 0:
        ebitda_margin = (ebitda / revenue) * 100

    return {

        "company": info.get("longName"),

        "marketCap": info.get("marketCap"),

        "currentPrice": info.get("currentPrice"),

        "revenue": revenue,

        "ebitda": ebitda,

        "cash": info.get("totalCash", 0),

        "debt": info.get("totalDebt", 0),

        "sharesOutstanding":
            info.get("sharesOutstanding", 0),

        "netIncome":
            info.get("netIncomeToCommon", 0),

        "freeCashFlow":
            info.get("freeCashflow", 0),

        "ebitdaMargin":
            round(ebitda_margin, 2),

        "revenueGrowth": 8,

        "wacc": 9,

        "terminalGrowth": 2.5
    }