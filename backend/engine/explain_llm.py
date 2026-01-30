import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "deepseek-r1:7b"

def explain_risk(user_type, score, level, signals, weights, runway):
    signal_lines = [
        f"{k}: {round(signals.get(k, 0), 2)} (weight {w})"
        for k, w in weights.items()
    ]

    prompt = f"""
Respond in EXACTLY this format.

1. Overall Financial Health Summary
- 2–3 sentences.

2. Top Contributing Risk Factors and Why They Matter
- Bullet points.

3. Practical Actions for the Next 3 Months
- 2–4 actions.

User Type: {user_type}
Risk Score: {score}
Risk Level: {level}
Time to Financial Stress: {runway} months

Signals:
{chr(10).join(signal_lines)}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False
        },
        timeout=300  # IMPORTANT
    )

    response.raise_for_status()
    return response.json()["message"]["content"]
