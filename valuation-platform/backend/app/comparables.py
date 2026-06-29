import yfinance as yf

from company_universe import COMPANY_UNIVERSE


def build_company_record(symbol):

    try:

        stock = yf.Ticker(symbol)

        info = stock.info

        market_cap = info.get("marketCap", 0)

        revenue = info.get("totalRevenue", 0)

        ebitda = info.get("ebitda", 0)

        ev_revenue = 0

        ev_ebitda = 0

        if revenue > 0:

            ev_revenue = round(
                market_cap / revenue,
                2
            )

        if ebitda > 0:

            ev_ebitda = round(
                market_cap / ebitda,
                2
            )

        return {

            "ticker": symbol,

            "company":
                info.get(
                    "shortName",
                    symbol
                ),

            "marketCap":
                market_cap,

            "revenue":
                revenue,

            "ebitda":
                ebitda,

            "sector":
                info.get(
                    "sector",
                    ""
                ),

            "industry":
                info.get(
                    "industry",
                    ""
                ),

            "evRevenue":
                ev_revenue,

            "evEbitda":
                ev_ebitda

        }

    except Exception:

        return None


def get_comparables(ticker):

    ticker = ticker.upper()

    target = build_company_record(
        ticker
    )

    if not target:

        return []

    target_sector = target["sector"]

    target_industry = target["industry"]

    target_market_cap = target["marketCap"]

    peers = []

    for symbol in COMPANY_UNIVERSE:

        if symbol == ticker:

            continue

        company = build_company_record(
            symbol
        )

        if not company:

            continue

        score = 0

        if company["sector"] == target_sector:

            score += 25

        if company["industry"] == target_industry:

            score += 50

        market_cap_difference = abs(

            company["marketCap"] -
            target_market_cap

        )

        company["score"] = score

        company["distance"] = (
            market_cap_difference
        )

        peers.append(company)

    peers.sort(

        key=lambda x:
        (
            -x["score"],
            x["distance"]
        )

    )

    final_results = [target]

    for company in peers[:9]:

        company.pop(
            "score",
            None
        )

        company.pop(
            "distance",
            None
        )

        final_results.append(
            company
        )

    return final_results