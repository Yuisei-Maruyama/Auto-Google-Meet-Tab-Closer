import fs from 'fs'
import path from 'path'

const srcDir = '.'
const destDir = './dist'

// 指定された拡張子とファイル名のファイルをコピーする関数
function copyFilesWithExtensions(
  extensions: string[],
  filenames?: string[]
): void {
  const files = fs.readdirSync(srcDir).filter((file) => {
    const fileExtension = path.extname(file)
    const isExtensionValid = extensions.includes(fileExtension)
    if (filenames) {
      return isExtensionValid && filenames.includes(file)
    }
    return isExtensionValid
  })

  console.log(files)

  for (const file of files) {
    const srcFile = path.join(srcDir, file)
    const destFile = path.join(destDir, file)
    fs.copyFileSync(srcFile, destFile)
  }
}

// 複数の拡張子を対象にコピー
copyFilesWithExtensions(['.png'])
copyFilesWithExtensions(['.json'], ['manifest.json'])
