import type { FileHashRequestParams } from '../../types'

/**
 * 文件格式：完整：文件名_hash.后缀
 *       chunk： 文件名_hash
 */
export const getFilename = ({
  name,
  hash,
  isChunk
}: FileHashRequestParams): string => {
  if (isChunk) {
    return hash
  }
  // 爱来自chatgpt
  const [prefix = name, suffix = ''] = (
    name.match(/(.*)\.([^.]+)$/) ?? []
  ).slice(1)
  return `${prefix}_${hash}${suffix.length ? '.' : ''}${suffix}`
}
