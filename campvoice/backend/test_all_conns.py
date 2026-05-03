import asyncio
import asyncpg
import ssl

async def test_conn(name, url, ssl_ctx=None):
    print(f"Testing {name}...")
    try:
        conn = await asyncio.wait_for(
            asyncpg.connect(url, ssl=ssl_ctx),
            timeout=10
        )
        print(f"SUCCESS: {name}")
        await conn.close()
    except asyncio.TimeoutError:
        print(f"TIMEOUT: {name}")
    except Exception as e:
        print(f"ERROR: {name}: {e}")

async def main():
    host = "aws-1-eu-central-1.pooler.supabase.com"
    user = "postgres.sehqlewyokmyctxklxpi"
    pw = "ye0YYGLy4JmIsnMG"
    pw_with_brackets = "[ye0YYGLy4JmIsnMG]"
    
    # Variation 1: Standard Pooler Port 6543, No SSL
    await test_conn("Port 6543, No SSL", f"postgresql://{user}:{pw}@{host}:6543/postgres")
    
    # Variation 2: Standard Pooler Port 6543, SSL require
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    await test_conn("Port 6543, SSL (No Verify)", f"postgresql://{user}:{pw}@{host}:6543/postgres", ssl_ctx=ctx)

    # Variation 3: Port 5432 on Pooler host (some regions support this for IPv4)
    await test_conn("Port 5432, SSL (No Verify)", f"postgresql://{user}:{pw}@{host}:5432/postgres", ssl_ctx=ctx)

    # Variation 4: Try with brackets in password (encoded)
    import urllib.parse
    pw_enc = urllib.parse.quote(pw_with_brackets)
    await test_conn("Port 6543, SSL, Brackets Encoded", f"postgresql://{user}:{pw_enc}@{host}:6543/postgres", ssl_ctx=ctx)

asyncio.run(main())
