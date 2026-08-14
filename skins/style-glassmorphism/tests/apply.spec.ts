// @vitest-environment jsdom
/**
 * Contract test: apply() mounts the skin surface (body attribute, favicon,
 * title) and retracts everything on fiber dispose, never clobbering a
 * session title projected over the skin title.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { apply } from '../src/client/index.ts'

let fiber: Fiber | undefined

async function mount(): Promise<Fiber> {
  const f = new Context().plugin({ apply })
  await f.await()
  return f
}

afterEach(async () => {
  await fiber?.dispose()
  fiber = undefined
  document.head.querySelectorAll('link[rel="icon"]').forEach((l) => l.remove())
  delete document.body.dataset.dshStyleGlassmorphism
  document.title = ''
})

describe('玻璃拟态 Glassmorphism skin apply', () => {
  it('mounts attribute, favicon and title', async () => {
    document.title = 'DeepSeek Harness'
    fiber = await mount()
    expect(document.body.dataset.dshStyleGlassmorphism).toBe('')
    expect(document.title).toBe('玻璃拟态 Glassmorphism')
    expect(document.head.querySelector('link[rel="icon"]')).not.toBeNull()
  })

  it('retracts everything on dispose', async () => {
    document.title = 'DeepSeek Harness'
    fiber = await mount()
    await fiber.dispose()
    fiber = undefined
    expect(document.body.dataset.dshStyleGlassmorphism).toBeUndefined()
    expect(document.head.querySelector('link[rel="icon"]')).toBeNull()
    expect(document.title).toBe('DeepSeek Harness')
  })

  it('never clobbers a session title', async () => {
    fiber = await mount()
    document.title = '我的会话 — 玻璃拟态 Glassmorphism'
    await fiber.dispose()
    fiber = undefined
    expect(document.title).toBe('我的会话 — 玻璃拟态 Glassmorphism')
  })
})
