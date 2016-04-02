/* eslint-env jasmine */

import path from 'path'
import {
  ROOT_PATH,
  LOCAL_PATH,
  unixStylePath,
  rootWorkPath,
  localWorkPath
} from './test-file-builder'

fdescribe('test file builder', () => {
  describe('unix style path', () => {
    it('should transform back slash characters to forward slash', () => {
      expect(unixStylePath('a\\b\\c\\file.txt')).toBe('a/b/c/file.txt')
    })
    it('should leave forward slash characters as is', () => {
      expect(unixStylePath('a/b/c/file.txt')).toBe('a/b/c/file.txt')
    })
  })

  describe('work paths', () => {
    it('should be exepected root work path', () => {
      expect(ROOT_PATH).toBe('/tmp/glob-test')
    })
    it('should be exepected work path', () => {
      expect(unixStylePath(LOCAL_PATH)).toBe(unixStylePath(path.join(__dirname, '..', '..', 'glob-test')))
    })
    it('should provide default root work path', () => {
      expect(unixStylePath(rootWorkPath())).toBe('/tmp/glob-test')
    })
    it('should provide offset root work path', () => {
      expect(unixStylePath(rootWorkPath('a/b/c/file.txt'))).toBe('/tmp/glob-test/a/b/c/file.txt')
    })
    it('should provide default local work path', () => {
      let expected = unixStylePath(path.join(__dirname, '..', '..', 'glob-test'))
      expect(unixStylePath(localWorkPath())).toBe(expected)
    })
    it('should provide offset root work path', () => {
      let expected = unixStylePath(path.join(__dirname, '..', '..', 'glob-test', 'a', 'b', 'c', 'file.txt'))
      expect(unixStylePath(localWorkPath('a/b/c/file.txt'))).toBe(expected)
    })
  })
})
