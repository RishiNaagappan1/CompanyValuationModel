from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from market_data import get_company_data
from comparables import get_comparables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "running",
        "message": "Valuation Platform API"
    }

@app.get("/company/{ticker}")
def company_data(ticker: str):
    return get_company_data(ticker)

@app.get("/comparables/{ticker}")
def comparables(ticker: str):
    return get_comparables(ticker)

@app.get("/test")
def test():
    return {
        "message": "hello"
    }