import asyncio
import asyncpg

async def main():
    print('Connecting...')
    try:
        # First test WITHOUT brackets
        conn = await asyncpg.connect('postgresql://postgres.sehqlewyokmyctxklxpi:ye0YYGLy4JmIsnMG@aws-1-eu-central-1.pooler.supabase.com:6543/postgres')
        print('Connected WITHOUT brackets!')
        await conn.close()
    except Exception as e:
        print(f"Failed WITHOUT brackets: {e}")

    try:
        # Second test WITH brackets
        conn = await asyncpg.connect('postgresql://postgres.sehqlewyokmyctxklxpi:[ye0YYGLy4JmIsnMG]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres')
        print('Connected WITH brackets!')
        await conn.close()
    except Exception as e:
        print(f"Failed WITH brackets: {e}")

asyncio.run(main())
