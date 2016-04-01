/* eslint-env jasmine */

import {GlobResultFile} from '../src/glob-result-file'

describe('glob result file', () => {
  describe('with defaults', () => {
    it('should have no name', () => {
      var actual = new GlobResultFile()
      expect(actual.hasName).toBe(false)
    })

    it('should have undefined fullname', () => {
      var actual = new GlobResultFile()
      expect(actual.fullname).toBeUndefined()
    })

    it('should have undefined basename', () => {
      var actual = new GlobResultFile()
      expect(actual.basename).toBeUndefined()
    })

    it('should have undefined dirname', () => {
      var actual = new GlobResultFile()
      expect(actual.dirname).toBeUndefined()
    })

    it('should have undefined extname', () => {
      var actual = new GlobResultFile()
      expect(actual.extname).toBeUndefined()
    })
  })
})
