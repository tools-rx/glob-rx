/* eslint-env jasmine */

// import {globRx} from '../src/glob-rx'

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
  'a/symlink/a/b/c/a/b/c/a/b/c//a/b/c////a/b/c/**/b/c/**',
  '{./*/*,/tmp/glob-test/*}',
  '{/tmp/glob-test/*,*}',
  'a/!(symlink)/**',
  'a/symlink/a/**/*'
]

describe('glob-rx', () => {
  describe('with default files', () => {
    globTests.forEach((spec) => {
      it(`it should glob expected names from ${spec}`, (done) => {
        done()
      })
    })
  })
})
