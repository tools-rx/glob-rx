/* eslint-env jasmine */

import path from 'path'
import fs from 'fs'
import {
  ROOT_PATH,
  LOCAL_PATH,
  unixStylePath,
  rootWorkPath,
  localWorkPath,
  cleanPath,
  buildFiles
} from './test-file-builder'
import mkdirp from 'mkdirp'
import {Observable} from 'rxjs'
import {bashFileSearch, emptyBashFileSearchResult} from './bash-file-search'

const writeFileRx = Observable.bindNodeCallback(fs.writeFile)
const mkdirpRx = Observable.bindNodeCallback(mkdirp)

describe('test file builder', () => {
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

  describe('clean path', () => {
    it('should remove contents of path', (done) => {
      mkdirpRx(localWorkPath('a/b/c'))
        .mergeMap(() => writeFileRx(localWorkPath('a/b/c/file.txt'), 'some content'))
        .mergeMap(() => cleanPath(localWorkPath()))
        .do(path => {
          expect(unixStylePath(path)).toBe(unixStylePath(localWorkPath()))
        })
        .mergeMap(() => bashFileSearch('**/*', localWorkPath()))
        .do(result => {
          expect(result).toEqual(emptyBashFileSearchResult)
        })
        .subscribe(getSubscriber(done))
    })
  })

  describe('build files', () => {
    beforeEach((done) => {
      cleanPath(localWorkPath()).subscribe(getSubscriber(done))
    })

    it('should return empty list for undefined file list', (done) => {
      buildFiles(localWorkPath())
        .reduce(concatListItems, [])
        .do(fileList => {
          expect(fileList).toEqual([])
        })
        .flatMap(() => bashFileSearch('**/*', localWorkPath()))
        .do(actual => {
          expect(actual).toEqual(emptyBashFileSearchResult)
        })
        .subscribe(getSubscriber(done))
    })

    it('should create single file', (done) => {
      let buildList = [
        'a/b/c/file.txt'
      ]
      let expected = {
        pattern: '**/*',
        matches: [
          'a',
          'a/b',
          'a/b/c',
          'a/b/c/file.txt',
        ]
      }
      buildFiles(localWorkPath(), buildList)
        .reduce(concatListItems, [])
        .do(fileList => {
          expect(fileList).toEqual(buildList)
        })
        .flatMap(() => bashFileSearch('**/*', localWorkPath()))
        .do(actual => {
          expect(actual).toEqual(expected)
        })
        .subscribe(getSubscriber(done))
    })
  })
})

function concatListItems (lst, item) {
  lst.push(item)
  return lst
}

function getSubscriber(done) {
  return {
    next() { },
    error(err) { done.fail(err) },
    complete() { done() }
  }
}
