import { describe, it, expect } from 'vitest'
import { resizeImage, resizeImages } from '../../utils/image'

describe('image resizing utilities', () => {
  it('returns original file untouched when file size is under 1MB', async () => {
    // 500KB file
    const smallFile = new File([new ArrayBuffer(500 * 1024)], 'small-avatar.jpg', {
      type: 'image/jpeg'
    })

    const result = await resizeImage(smallFile)
    expect(result).toBe(smallFile)
    expect(result.size).toBe(smallFile.size)
  })

  it('handles multiple files concurrently with resizeImages', async () => {
    const file1 = new File([new ArrayBuffer(100 * 1024)], 'file1.jpg', { type: 'image/jpeg' })
    const file2 = new File([new ArrayBuffer(200 * 1024)], 'file2.jpg', { type: 'image/jpeg' })

    const results = await resizeImages([file1, file2])
    expect(results).toHaveLength(2)
    expect(results[0]).toBe(file1)
    expect(results[1]).toBe(file2)
  })
})
