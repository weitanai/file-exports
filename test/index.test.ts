import { describe, expect, it } from 'vitest'
import { getStaticExports } from '../dist/index.js'



describe('ESM', () => {
  it('getStaticExports', async () => {

    expect((await getStaticExports(import.meta.url))).toMatchInlineSnapshot() 
  })
})