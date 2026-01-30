import numpy as np
from .utils import linear_trend

def compute_core_signals(df):
    income = df[df.flow_type == "income"].groupby("month")["amount"].sum()
    expense = df[df.flow_type == "expense"].groupby("month")["amount"].sum()
    debt = df[df.flow_type == "debt_payment"].groupby("month")["amount"].sum()

    income_trend = linear_trend(income)
    expense_trend = linear_trend(expense)

    burn_rate = expense_trend - income_trend
    iv_index = income.std() / income.mean() if len(income) > 1 else 0

    return {
        "income_volatility": round(iv_index, 2),
        "burn_rate": round(burn_rate, 2),
        "avg_income": income_trend,
        "avg_expense": expense_trend,
        "avg_debt": debt.mean() if not debt.empty else 0
    }

def individual_signals(df, core):
    discretionary = df[df.category == "discretionary"]["amount"].sum()
    fixed = df[df.category == "fixed"]["amount"].sum()
    total = df[df.flow_type == "expense"]["amount"].sum()

    return {
        **core,
        "discretionary_ratio": discretionary / total if total else 0,
        "fixed_cost_ratio": fixed / core["avg_income"] if core["avg_income"] else 0,
        "debt_pressure": core["avg_debt"] / core["avg_income"] if core["avg_income"] else 0
    }

def sme_signals(df, core):
    fixed = df[df.category == "fixed"]["amount"].sum()
    growth = df[df.category == "growth"]["amount"].sum()

    return {
        **core,
        "operating_leverage": fixed / core["avg_income"] if core["avg_income"] else 0,
        "growth_ratio": growth / core["avg_income"] if core["avg_income"] else 0,
        "debt_coverage": (core["avg_income"] - core["avg_expense"]) /
                         core["avg_debt"] if core["avg_debt"] else 1
    }
