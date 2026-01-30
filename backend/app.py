from flask import Flask, request, jsonify
from flask_cors import CORS

from engine.parser import parse_csv
from engine.signals import compute_core_signals, individual_signals, sme_signals
from engine.scoring import score_individual, score_sme
from engine.simulation import simulate_discretionary_cut
from engine.utils import risk_level
from engine.explain_llm import explain_risk

app = Flask(__name__)
CORS(app)


@app.route("/")
def health():
    return jsonify({"status": "FinSight backend running"})


# -------------------------
# VALIDATION
# -------------------------
def validate_dataset(df, expected_type):
    categories = set(df["category"].unique())

    if expected_type == "individual":
        allowed = {"fixed", "discretionary", "variable"}
        if not categories.intersection(allowed):
            raise ValueError("This CSV does not look like an Individual dataset.")

    if expected_type == "sme":
        required = {"fixed", "growth"}
        if not required.issubset(categories):
            raise ValueError("This CSV does not look like an SME dataset.")


# -------------------------
# CONTRIBUTIONS
# -------------------------
def compute_contributions(signals, weights):
    contributions = {}
    for key, weight in weights.items():
        value = min(abs(signals.get(key, 0)), 1)
        contributions[key] = round(value * weight, 3)
    return contributions


# -------------------------
# RUNWAY LOGIC
# -------------------------
def compute_runway(signals, user_type):
    buffer_months = signals.get("buffer_months", 3)

    if user_type == "individual":
        if signals["burn_rate"] > 0:
            return round(1 / signals["burn_rate"], 2)

        stress_pressure = (
            signals["income_volatility"]
            + signals.get("fixed_cost_ratio", 0)
            + signals.get("debt_pressure", 0)
        )

        return max(round(buffer_months / max(stress_pressure, 0.5), 1), 0.5)

    if user_type == "sme":
        debt_stress = (
            1 / signals["debt_coverage"]
            if signals["debt_coverage"] > 0
            else 2
        )

        stress_pressure = (
            signals["operating_leverage"]
            + signals["growth_ratio"]
            + debt_stress
        )

        return max(round(buffer_months / stress_pressure, 1), 0.5)


# -------------------------
# INDIVIDUAL ROUTE
# -------------------------
@app.route("/analyze/individual", methods=["POST"])
def analyze_individual():
    try:
        df = parse_csv(request.files["file"])
        validate_dataset(df, "individual")

        core = compute_core_signals(df)
        signals = individual_signals(df, core)

        score, weights = score_individual(signals)
        runway = compute_runway(signals, "individual")

        explanation = explain_risk(
            "Individual",
            score,
            risk_level(score),
            signals,
            weights,
            runway
        )

        impact = simulate_discretionary_cut(signals, 6000)

        return jsonify({
            "risk_score": score,
            "risk_level": risk_level(score),
            "time_to_stress_months": runway,
            "ai_explanation": explanation,
            "recommendations": [{
                "action": "Reduce discretionary spend by ₹6,000",
                "impact_months": impact
            }] if impact else [],
            "signal_contributions": compute_contributions(signals, weights),
            "signals": signals
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -------------------------
# SME ROUTE
# -------------------------
@app.route("/analyze/sme", methods=["POST"])
def analyze_sme():
    try:
        df = parse_csv(request.files["file"])
        validate_dataset(df, "sme")

        core = compute_core_signals(df)
        signals = sme_signals(df, core)

        score, weights = score_sme(signals)
        runway = compute_runway(signals, "sme")

        explanation = explain_risk(
            "SME",
            score,
            risk_level(score),
            signals,
            weights,
            runway
        )

        return jsonify({
            "risk_score": score,
            "risk_level": risk_level(score),
            "time_to_stress_months": runway,
            "ai_explanation": explanation,
            "signal_contributions": compute_contributions(signals, weights),
            "signals": signals
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
