PEER_GROUPS = {

    "AAPL": ["MSFT","GOOGL","META","AMZN","NVDA"],
    "MSFT": ["AAPL","GOOGL","META","AMZN","NVDA"],
    "GOOGL": ["AAPL","MSFT","META","AMZN","NFLX"],
    "META": ["AAPL","MSFT","GOOGL","NFLX","SNAP"],

    "NVDA": ["AMD","AVGO","INTC","TSM","QCOM"],
    "AMD": ["NVDA","INTC","AVGO","TSM","QCOM"],

    "JPM": ["BAC","WFC","C","GS","MS"],
    "BAC": ["JPM","WFC","C","GS","MS"],
    "GS": ["JPM","BAC","MS","C","WFC"],

    "GM": ["F","TSLA","TM","HMC","RIVN"],
    "F": ["GM","TSLA","TM","HMC","RIVN"],
    "TSLA": ["GM","F","TM","RIVN","LCID"],

    "WMT": ["COST","TGT","KR","DG","DLTR"],
    "COST": ["WMT","TGT","KR","BJ","DG"],

    "DIS": ["NFLX","CMCSA","WBD","PARA","FOX"],
    "NFLX": ["DIS","CMCSA","WBD","PARA","FOX"],

    "XOM": ["CVX","COP","BP","SHEL","EOG"],
    "CVX": ["XOM","COP","BP","SHEL","EOG"],

    "UNH": ["HUM","CI","ELV","CVS","MOH"],
    "PFE": ["MRK","JNJ","BMY","ABBV","LLY"]
}