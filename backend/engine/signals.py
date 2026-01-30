import numpy as np
from .utils import linear_trend


def compute_core_signals(df):
    income = df[df.flow_type == "income"].groupby("month")["amount"].sum()
    expense = df[df.flow_type == "expense"].groupby("month")["amount"].sum()
    debt = df[df.flow_type == "debt_payment"].groupby("month")["amount"].sum()

    income_trend = linear_trend(income)
    expense_trend = linear_trend(expense)

    burn_rate = expense_trend - income_trend
    income_volatility = income.std() / income.mean() if len(income) > 1 else 0

    # Assume baseline liquidity buffer (months)
    buffer_months = 3

    return {
        "income_volatility": round(income_volatility, 2),
        "burn_rate": round(burn_rate, 2),
        "avg_income": round(income_trend, 2),
        "avg_expense": round(expense_trend, 2),
        "avg_debt": round(debt.mean(), 2) if not debt.empty else 0,
        "buffer_months": buffer_months
    }


# =========================
# INDIVIDUAL SIGNALS
# =========================
def individual_signals(df, core):
    discretionary = df[df.category == "discretionary"]["amount"].sum()
    fixed = df[df.category == "fixed"]["amount"].sum()
    total_expense = df[df.flow_type == "expense"]["amount"].sum()

    fixed_cost_ratio = fixed / core["avg_income"] if core["avg_income"] else 0
    debt_pressure = core["avg_debt"] / core["avg_income"] if core["avg_income"] else 0

    return {
        **core,
        "discretionary_ratio": round(discretionary / total_expense, 2) if total_expense else 0,
        "fixed_cost_ratio": round(fixed_cost_ratio, 2),
        "debt_pressure": round(debt_pressure, 2),
    }


# =========================
# SME SIGNALS (CRITICAL FIX)
# =========================
def sme_signals(df, core):
    fixed = df[df.category == "fixed"]["amount"].sum()
    growth = df[df.category == "growth"]["amount"].sum()

    operating_leverage = fixed / core["avg_income"] if core["avg_income"] else 0
    growth_ratio = growth / core["avg_income"] if core["avg_income"] else 0

    # Debt coverage < 1 means income cannot cover obligations
    debt_coverage = (
        (core["avg_income"] - core["avg_expense"]) / core["avg_debt"]
        if core["avg_debt"] > 0
        else 1
    )

    # Convert debt coverage into stress (higher = worse)
    debt_stress = (1 / debt_coverage) if debt_coverage > 0 else 2

    # Unified SME stress score (used by runway logic)
    sme_stress_score = (
        operating_leverage +
        growth_ratio +
        debt_stress
    )

    return {
        **core,
        "operating_leverage": round(operating_leverage, 2),
        "growth_ratio": round(growth_ratio, 2),
        "debt_coverage": round(debt_coverage, 2),
        "debt_stress": round(debt_stress, 2),
        "sme_stress_score": round(sme_stress_score, 2),
    }
