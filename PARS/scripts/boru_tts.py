import asyncio, sys, edge_tts

async def run():
    text  = sys.stdin.buffer.read().decode('utf-8').strip()
    if not text: return
    voice = sys.argv[1] if len(sys.argv) > 1 else 'tr-TR-EmelNeural'
    rate  = sys.argv[2] if len(sys.argv) > 2 else '-8%'
    pitch = sys.argv[3] if len(sys.argv) > 3 else '-3Hz'
    com   = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    async for chunk in com.stream():
        if chunk['type'] == 'audio':
            sys.stdout.buffer.write(chunk['data'])
    sys.stdout.buffer.flush()

asyncio.run(run())
