/* eslint-env jasmine */

import _ from 'lodash'
import path from 'path'
import {bashFileSearch} from './bash-file-search'

const testsPath = path.join(__dirname, '..')

describe('bash file search', () => {
  it('should return expected file list', (done) => {
    let expected = {
      pattern: '**/*.js',
      matches: [
        'glob-result-file.spec.js',
        'glob-rx.spec.js',
        'helpers/bash-file-search.js',
        'helpers/bash-file-search.spec.js',
        'helpers/test-file-builder.js',
        'helpers/test-file-builder.spec.js',
        'helpers/test-helpers.js'
      ]
    }

    bashFileSearch('**/*.js', testsPath)
      .subscribe(
        (found) => {
          found.matches = _.sortBy(found.matches, (fn) => fn)
          expect(found).toEqual(expected)
        },
        (err) => done.fail(err),
        () => done()
      )
  })
})
