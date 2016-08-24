/* eslint-env jasmine */

import path from 'path'
import {bashFileSearch, buildFileSet, defaultFileSet} from 'test-files-rx'
import {getSubscriber, sortedFileList} from './test-helpers'
import {globRx} from '../src/glob-rx'

// put more patterns here.
// anything that would be directly in / should be in /tmp/glob-test
let globTests = [
  'a/*/+(c|g)/./d',
  'a/**/[cg]/../[cg]',
  'a/{b,c,d,e,f}/**/g',
  'a/b/**',
  '**/g',
  'a/abc{fed,def}/g/h',
  'a/abc{fed/g,def}/**/',
  'a/abc{fed/g,def}/**///**/',
  '**/a/**/',
  '+(a|b|c)/a{/,bc*}/**',
  '*/*/*/f',
  '**/f',
  // TODO: These are failing on Windows
  // 'a/symlink/a/b/c/a/b/c/a/b/c//a/b/c////a/b/c/**/b/c/**',
  // '{./*/*,/tmp/glob-test/*}',
  // '{/tmp/glob-test/*,*}',
  'a/!(symlink)/**',
  'a/symlink/a/**/*'
]

const fileSet = Object.assign(defaultFileSet, {
  rootPath: '/tmp/glob-test',
  localPath: path.join(__dirname, '..', 'glob-test')
})

describe('glob-rx', () => {
  describe('with default files', () => {
    beforeAll((done) => {
      buildFileSet(fileSet).subscribe(getSubscriber(done))
    })

    globTests.forEach((pattern) => {
      it(`it should glob expected names from ${pattern}`, (done) => {
        bashFileSearch(pattern, fileSet.localPath)
          .mergeMap((bashResult) => {
            let bashNames = bashResult.matches
            return globRx(pattern, { cwd: fileSet.localPath })
              .reduce((names, globFile) => {
                names.push(globFile.name)
                return names
              }, [])
              .map((globNames) => ({ pattern, bashNames, globNames }))
          })
          .do((result) => {
            // console.log(JSON.stringify(pattern, null, 2))
            // console.log(JSON.stringify(result.bashNames, null, 2))
            // console.log(JSON.stringify(result.globNames, null, 2))
            expect(sortedFileList(result.globNames)).toEqual(sortedFileList(result.bashNames))
          })
          .subscribe(getSubscriber(done))
      })
    })
  })
})
