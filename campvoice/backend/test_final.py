import asyncio
import asyncpg
import ssl

async def main():
    host = "aws-1-eu-central-1.pooler.supabase.com"
    user = "postgres.sehqlewyokmyctxklxpi"
    pw_with_brackets = "[ye0YYGLy4JmIsnMG]"
    pw_no_brackets = "ye0YYGLy4JmIsnMG"
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print("Testing WITHOUT brackets...")
    try:
        conn = await asyncpg.connect(
            user=user,
            password=pw_no_brackets,
            database="postgres",
            host=host,
            port=6543,
            ssl=ctx
        )
        print("SUCCESS WITHOUT brackets")
        await conn.close()
    except Exception as e:
        print(f"FAILED WITHOUT brackets: {e}")

    print("\nTesting WITH brackets...")
    try:
        conn = await asyncpg.connect(
            user=user,
            password=pw_with_brackets,
            database="postgres",
            host=host,
            port=6543,
            ssl=ctx
        )
        print("SUCCESS WITH brackets")
        await conn.close()
    except Exception as e:
        print(f"FAILED WITH brackets: {e}")

asyncio.run(main())
