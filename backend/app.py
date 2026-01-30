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


@app.route("/analyze/individual", methods=["POST"])
def analyze_individual():
    df = parse_csv(request.files["file"])

    core = compute_core_signals(df)
    signals = individual_signals(df, core)

    score, weights = score_individual(signals)
    runway = round(1 / signals["burn_rate"], 2) if signals["burn_rate"] > 0 else None

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
        "signal_contributions": weights,
        "signals": signals
    })


@app.route("/analyze/sme", methods=["POST"])
def analyze_sme():
    df = parse_csv(request.files["file"])

    core = compute_core_signals(df)
    signals = sme_signals(df, core)

    score, weights = score_sme(signals)
    runway = round(1 / signals["burn_rate"], 2) if signals["burn_rate"] > 0 else None

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
        "signal_contributions": weights,
        "signals": signals
    })


if __name__ == "__main__":
    app.run(debug=True)
