"""
24.7PraiseRadio Public Content API
Returns published news, programs, and on-demand tracks for the frontend.
"""
import json
import os
from datetime import datetime, date
import psycopg2
from psycopg2.extras import RealDictCursor


def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type not serializable")

SCHEMA = "t_p2604452_internet_gospel_radi"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


def resp(status: int, body: dict):
    return {"statusCode": status, "headers": {**cors_headers(), "Content-Type": "application/json"}, "body": json.dumps(body, default=json_serial)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    qs = event.get("queryStringParameters") or {}
    route = qs.get("route", "")
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if route == "news":
            cur.execute(f"SELECT * FROM {SCHEMA}.news WHERE published = true ORDER BY id DESC LIMIT 20")
            return resp(200, {"news": [dict(r) for r in cur.fetchall()]})

        if route == "programs":
            cur.execute(f"SELECT * FROM {SCHEMA}.programs ORDER BY sort_order ASC")
            return resp(200, {"programs": [dict(r) for r in cur.fetchall()]})

        if route == "on-demand":
            cur.execute(f"SELECT * FROM {SCHEMA}.on_demand WHERE published = true ORDER BY id DESC")
            return resp(200, {"on_demand": [dict(r) for r in cur.fetchall()]})

        return resp(404, {"error": "Not found"})
    finally:
        conn.close()