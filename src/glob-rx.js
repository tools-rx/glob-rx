import {Observable} from 'rxjs'
import glob from 'glob'
import {GlobResultFile} from './glob-result-file'

export function globRx (pattern, options) {
  options = options || {}
  let basedir = options.cwd || process.cwd()

  return Observable
    .create((observer) => {
      let isFinished = false

      glob(pattern, options, (err, fileList) => {
        isFinished = true
        if (err) {
          return observer.error(err)
        }
        observer.next(fileList.map(fn => fn.replace(/[\/\\]$/, '')))
        observer.complete()
      })

      return () => {
        if (!isFinished) {
          glob.abort()
        }
      }
    })
    .mergeMap((fileList) => Observable.from(fileList))
    .map((name) => Object.assign(new GlobResultFile(), { basedir, name }))
}
