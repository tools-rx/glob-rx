import {Observable} from 'rxjs'
import {spawn} from 'child_process'
import _ from 'lodash'

export const emptyBashFileSearchResult = {
  pattern: '**/*',
  matches: [
  ]
}

export function bashFileSearch (pattern, basedir) {
  let bashCommandLine = [
    '-O', 'globstar',
    '-O', 'extglob',
    '-O', 'nullglob',
    '-c',
    `for i in ${pattern}; do echo $i; done`
  ]

  return Observable.create((observer) => {
    let cp = spawn('bash', bashCommandLine, { cwd: basedir })
    let outputBuffer = new Buffer(0)
    cp.stdout.on('data', (data) => {
      outputBuffer = Buffer.concat([ outputBuffer, data ])
    })
    cp.stderr.on('data', (data) => console.error('bash: ' + data))
    cp.on('close', (code) => {
      if (code) {
        observer.error('bash test should finish nicely')
      } else {
        let matches = _(outputBuffer.toString().split(/\r*\n/))
          .filter((t) => t !== '')
          .map((t) => t.replace(/\/$/, ''))
          .sortBy((t) => t.toLowerCase())
          .value()
        observer.next({ pattern, matches })
        observer.complete()
      }
    })
  })
}
