def score_individual(s):
    if s["income_volatility"] < 0.5:
        weights = {
            "discretionary_ratio": 0.3,
            "fixed_cost_ratio": 0.25,
            "debt_pressure": 0.2,
            "burn_rate": 0.25
        }
    else:
        weights = {
            "income_volatility": 0.35,
            "debt_pressure": 0.3,
            "burn_rate": 0.35
        }

    score = sum(min(abs(s[k]), 1) * w for k, w in weights.items())
    return round(score * 100, 1), weights

def score_sme(s):
    weights = {
        "operating_leverage": 0.3,
        "growth_ratio": 0.25,
        "burn_rate": 0.25,
        "income_volatility": 0.2
    }
    score = sum(min(abs(s[k]), 1) * w for k, w in weights.items())
    return round(score * 100, 1), weights
