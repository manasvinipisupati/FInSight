def simulate_discretionary_cut(signals, cut):
    if signals["burn_rate"] <= 0:
        return None

    new_burn = signals["burn_rate"] - cut
    old_runway = 1 / signals["burn_rate"]
    new_runway = 1 / new_burn if new_burn > 0 else float("inf")

    return round(new_runway - old_runway, 2)
