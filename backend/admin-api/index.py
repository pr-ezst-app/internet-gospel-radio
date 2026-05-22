"""
24.7PraiseRadio Admin API
Handles login, and full CRUD for news, programs, and on-demand content.
"""
import json
import os
import hashlib
import hmac
import time
from datetime import datetime, date
import psycopg2
from psycopg2.extras import RealDictCursor


def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type not serializable")

SCHEMA = "t_p2604452_internet_gospel_radi"
SECRET = "praise247_admin_secret_key_2026"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def make_token(user_id: int) -> str:
    payload = f"{user_id}:{int(time.time()) + 86400 * 7}"
    sig = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}:{sig}"


def verify_token(token: str):
    if not token:
        return None
    parts = token.split(":")
    if len(parts) != 3:
        return None
    user_id, expires, sig = parts
    payload = f"{user_id}:{expires}"
    expected = hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return None
    if int(expires) < int(time.time()):
        return None
    return int(user_id)


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }


def resp(status: int, body: dict):
    return {"statusCode": status, "headers": {**cors_headers(), "Content-Type": "application/json"}, "body": json.dumps(body, default=json_serial)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    route = qs.get("route", "")
    item_id = qs.get("id", "")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # ── AUTH ──
    if route == "login" and method == "POST":
        username = body.get("username", "").strip()
        password = body.get("password", "")
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(f"SELECT id, password_hash FROM {SCHEMA}.admin_users WHERE username = %s", (username,))
        user = cur.fetchone()
        conn.close()
        if not user:
            return resp(401, {"error": "Invalid credentials"})
        import bcrypt
        if not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
            return resp(401, {"error": "Invalid credentials"})
        token = make_token(user["id"])
        return resp(200, {"token": token})

    # ── REQUIRE AUTH for all other routes ──
    auth_header = event.get("headers", {}).get("X-Authorization", "")
    token = auth_header.replace("Bearer ", "")
    user_id = verify_token(token)
    if not user_id:
        return resp(401, {"error": "Unauthorized"})

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # ── NEWS ──
        if route == "news" and not item_id:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.news ORDER BY id DESC")
                return resp(200, {"news": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.news (category, title, excerpt, date, read_time, published) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                    (d.get("category"), d.get("title"), d.get("excerpt"), d.get("date"), d.get("read_time", "3 min read"), d.get("published", True))
                )
                conn.commit()
                return resp(201, {"item": dict(cur.fetchone())})

        if route == "news" and item_id:
            if method == "PUT":
                d = body
                cur.execute(
                    f"UPDATE {SCHEMA}.news SET category=%s, title=%s, excerpt=%s, date=%s, read_time=%s, published=%s WHERE id=%s RETURNING *",
                    (d.get("category"), d.get("title"), d.get("excerpt"), d.get("date"), d.get("read_time"), d.get("published"), item_id)
                )
                conn.commit()
                row = cur.fetchone()
                return resp(200, {"item": dict(row)}) if row else resp(404, {"error": "Not found"})
            if method == "DELETE":
                cur.execute(f"DELETE FROM {SCHEMA}.news WHERE id=%s", (item_id,))
                conn.commit()
                return resp(200, {"ok": True})

        # ── PROGRAMS ──
        if route == "programs" and not item_id:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.programs ORDER BY sort_order ASC")
                return resp(200, {"programs": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.programs (time, title, host, type, day, sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                    (d.get("time"), d.get("title"), d.get("host"), d.get("type"), d.get("day", "Sunday"), d.get("sort_order", 99))
                )
                conn.commit()
                return resp(201, {"item": dict(cur.fetchone())})

        if route == "programs" and item_id:
            if method == "PUT":
                d = body
                cur.execute(
                    f"UPDATE {SCHEMA}.programs SET time=%s, title=%s, host=%s, type=%s, day=%s, sort_order=%s WHERE id=%s RETURNING *",
                    (d.get("time"), d.get("title"), d.get("host"), d.get("type"), d.get("day"), d.get("sort_order"), item_id)
                )
                conn.commit()
                row = cur.fetchone()
                return resp(200, {"item": dict(row)}) if row else resp(404, {"error": "Not found"})
            if method == "DELETE":
                cur.execute(f"DELETE FROM {SCHEMA}.programs WHERE id=%s", (item_id,))
                conn.commit()
                return resp(200, {"ok": True})

        # ── ON DEMAND ──
        if route == "on-demand" and not item_id:
            if method == "GET":
                cur.execute(f"SELECT * FROM {SCHEMA}.on_demand ORDER BY id DESC")
                return resp(200, {"on_demand": [dict(r) for r in cur.fetchall()]})
            if method == "POST":
                d = body
                cur.execute(
                    f"INSERT INTO {SCHEMA}.on_demand (title, artist, duration, type, published) VALUES (%s,%s,%s,%s,%s) RETURNING *",
                    (d.get("title"), d.get("artist"), d.get("duration"), d.get("type"), d.get("published", True))
                )
                conn.commit()
                return resp(201, {"item": dict(cur.fetchone())})

        if route == "on-demand" and item_id:
            if method == "PUT":
                d = body
                cur.execute(
                    f"UPDATE {SCHEMA}.on_demand SET title=%s, artist=%s, duration=%s, type=%s, published=%s WHERE id=%s RETURNING *",
                    (d.get("title"), d.get("artist"), d.get("duration"), d.get("type"), d.get("published"), item_id)
                )
                conn.commit()
                row = cur.fetchone()
                return resp(200, {"item": dict(row)}) if row else resp(404, {"error": "Not found"})
            if method == "DELETE":
                cur.execute(f"DELETE FROM {SCHEMA}.on_demand WHERE id=%s", (item_id,))
                conn.commit()
                return resp(200, {"ok": True})

        return resp(404, {"error": "Not found"})

    finally:
        conn.close()