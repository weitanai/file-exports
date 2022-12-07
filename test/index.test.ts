import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getStaticExports } from '../dist'
const path = resolve(process.cwd(), 'test/index.test.ts')

getStaticExports(path).then(console.log)

describe('ESM', () => {
  it('getStaticExports', async () => {
  const path = resolve(process.cwd(), 'test/index.test.ts')

    expect((await getStaticExports(path))).toMatchInlineSnapshot('{}') 
  })
})