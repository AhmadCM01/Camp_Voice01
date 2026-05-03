import asyncio
import os
import socket
import ssl

import asyncpg
from dotenv import dotenv_values
from sqlalchemy.engine.url import make_url


def _split_host(host: str) -> str:
    return host.strip().rstrip(".")


def _dns_report(host: str):
    host = _split_host(host)
    report = {"host": host, "A": [], "AAAA": [], "error": None}
    try:
        infos = socket.getaddrinfo(host, None)
        for family, _, _, _, sockaddr in infos:
            ip = sockaddr[0]
            if family == socket.AF_INET:
                if ip not in report["A"]:
                    report["A"].append(ip)
            elif family == socket.AF_INET6:
                if ip not in report["AAAA"]:
                    report["AAAA"].append(ip)
    except Exception as e:
        report["error"] = f"{type(e).__name__}: {e}"
    return report


async def _try_connect(*, host: str, port: int, user: str, password: str, database: str):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    conn = await asyncpg.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database,
        ssl=ctx,
        statement_cache_size=0,
    )
    try:
        await conn.execute("select 1")
    finally:
        await conn.close()


async def main():
    cfg = dotenv_values(".env")
    direct_url = cfg.get("DIRECT_DATABASE_URL") or os.environ.get("DIRECT_DATABASE_URL")
    if not direct_url:
        print("Missing DIRECT_DATABASE_URL")
        return

    supabase_url = cfg.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL") or ""
    project_ref = ""
    try:
        project_ref = supabase_url.split("//", 1)[1].split(".", 1)[0]
    except Exception:
        project_ref = ""

    u = make_url(direct_url)
    user = u.username or ""
    password = u.password or ""
    host = u.host or ""
    port = int(u.port or 5432)
    database = u.database or "postgres"

    print("DNS")
    print(_dns_report(host))
    print()

    print("Connect")
    try:
        await _try_connect(host=host, port=port, user=user, password=password, database=database)
        print("ok", host, port)
        return
    except Exception as e:
        print("fail", host, port, type(e).__name__, str(e)[:200])

    if host.startswith("db.") and host.endswith(".supabase.co"):
        dns = _dns_report(host)
        if dns.get("A") == [] and dns.get("AAAA"):
            print("Direct host is IPv6-only. If your machine has no IPv6, use the pooler connection string.")

    ref = project_ref or "sehqlewyokmyctxklxpi"
    pooler_host = "aws-1-eu-central-1.pooler.supabase.com"
    pooler_user = f"postgres.{ref}"
    for pooler_port in (5432, 6543):
        try:
            await _try_connect(host=pooler_host, port=pooler_port, user=pooler_user, password=password, database=database)
            print("ok", pooler_host, pooler_port, "as", pooler_user)
            return
        except Exception as e:
            print("fail", pooler_host, pooler_port, type(e).__name__, str(e)[:200])


if __name__ == "__main__":
    asyncio.run(main())
