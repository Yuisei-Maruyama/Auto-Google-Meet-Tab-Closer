import fs from 'fs'
import path from 'path'

const srcDir = '.'
const destDir = './dist'

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

copyFilesWithExtensions(['.png'])
copyFilesWithExtensions(['.json'], ['manifest.json'])
