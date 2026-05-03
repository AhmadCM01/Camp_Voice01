import asyncio
import asyncpg
import ssl

async def main():
    print('Connecting with ssl=require...')
    try:
        conn = await asyncpg.connect(
            'postgresql://postgres.sehqlewyokmyctxklxpi:ye0YYGLy4JmIsnMG@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require'
        )
        print('Connected!')
        await conn.close()
    except Exception as e:
        print(f"Failed: {e.__class__.__name__}: {e}")

asyncio.run(main())
