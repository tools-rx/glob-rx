import path from 'path'
import fs from 'fs'
import {Observable} from 'rxjs'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'

// import Rx from "rx"
// import _ from "lodash"

export const ROOT_PATH = '/tmp/glob-test'
export const LOCAL_PATH = path.join(__dirname, '..', '..', 'glob-test')

const writeFileRx = Observable.bindNodeCallback(fs.writeFile)
const mkdirpRx = Observable.bindNodeCallback(mkdirp)
const rimrafRx = Observable.bindNodeCallback(rimraf)
// const symlinkRx = Observable.bindNodeCallback(fs.symlink)

export const defaultFileSet = {
  localFiles: [
    'a/.abcdef/x/y/z/a',
    'a/abcdef/g/h',
    'a/abcfed/g/h',
    'a/b/c/d',
    'a/bc/e/f',
    'a/c/d/c/b',
    'a/cb/e/f'
  ],
  localDirectories: [],
  rootFiles: [],
  rootDirectories: [
    'foo',
    'bar',
    'baz',
    'asdf',
    'quux',
    'qwer',
    'rewq'
  ],
  symLinks: [
    [ 'a/symlink/a/b/c', 'a/symlink/a' ]
  ]
}

export function unixStylePath (path) {
  return path.replace(/\\/g, '/')
}

export function rootWorkPath (offsetPath) {
  return offsetPath ? path.join(ROOT_PATH, offsetPath) : ROOT_PATH
}

export function localWorkPath (offsetPath) {
  return offsetPath ? path.join(LOCAL_PATH, offsetPath) : LOCAL_PATH
}

// export function buildFileSet(fileSet) {
// }

export function cleanPath(basePath) {
  return rimrafRx(basePath)
    .mergeMap(() => mkdirpRx(basePath), () => basePath)
}

export function buildFiles (basePath, fileList) {
  return Observable.from(fileList || [])
    .map((fileName) => {
      let full = path.join(basePath, fileName)
      return {
        path: path.dirname(full),
        name: path.basename(full),
        full,
        originalName: fileName
      }
    })
    .mergeMap((file) => mkdirpRx(file.path), (file) => file)
    .mergeMap((file) => writeFileRx(file.full, `content ${file.name}`), (file) => file.originalName)
}

export function buildDirectories (basePath, directoryList) {
  return Observable.from(directoryList || [])
    .map((directoryName) => {
      let path = path.join(basePath, directoryName)
      return { path }
    })
    .mergeMap((directory) => mkdirpRx(directory.path), (directory) => directory)
}

/*
 class FileBuilder {

 static get DefaultFileSet() {
 return {
 }
 }

 static rootWorkPath(name) {
 return name ? Path.join(ROOT_PATH, name) : Path.join(ROOT_PATH)
 }

 static localWorkPath(name) {
 return name ? Path.join(LOCAL_PATH, name) : Path.join(LOCAL_PATH)
 }

 static buildDefault() {
 return FileBuilder.buildFileSet(FileBuilder.DefaultFileSet)
 }

 static buildFileSet(fileSet) {

 if(!_.isObject(fileSet)) {
 throw new Error("Expected file set object.")
 }

 let timeStamp = new Date().toString()
 let testHdr = `Test ${timeStamp} `

 let observable = Rx.Observable.fromPromise(
 FileBuilder
 .removeWorkPaths()
 .then(() => FileBuilder.createWorkPaths())
 ).ignoreElements()

 observable = buildFiles(observable, fileSet.localFiles, fn => ({
 name: fn,
 base: FileBuilder.localWorkPath(),
 full: FileBuilder.localWorkPath(fn),
 isLocalFile: true
 }))
 observable = buildDirectories(observable, fileSet.localDirectories, fn => ({
 name: fn,
 base: FileBuilder.localWorkPath(),
 full: FileBuilder.localWorkPath(fn),
 isLocalDirectory: true
 }))
 observable = buildFiles(observable, fileSet.rootFiles, fn => ({
 name: fn,
 base: FileBuilder.rootWorkPath(),
 full: FileBuilder.rootWorkPath(fn),
 isRootFile: true
 }))
 observable = buildDirectories(observable, fileSet.rootDirectories, fn => ({
 name: fn,
 base: FileBuilder.rootWorkPath(),
 full: FileBuilder.rootWorkPath(fn),
 isRootDirectory: true
 }))
 observable = buildSymLinks(observable, fileSet.symLinks, symLink => ({
 name: symLink[0],
 toName: symLink[1],
 base: FileBuilder.localWorkPath(),
 full: FileBuilder.localWorkPath(symLink[0]),
 isSymLink: true
 }))

 return observable

 function buildFiles(observable, fileList, mapFileInfo) {
 if(fileList && fileList.length) {
 observable = observable.concat(
 Rx.Observable
 .from(fileList)
 .map(mapFileInfo)
 .flatMap(fileInfo => {
 let dirName = Path.dirname(fileInfo.full)
 return mkdirpRx(dirName).map(() => fileInfo)
 })
 .flatMap(fileInfo =>
 writeFileRx(fileInfo.full, testHdr + fileInfo.name).map(() => fileInfo))
 )
 }
 return observable
 }

 function buildDirectories(observable, directoryList, mapDirectoryInfo) {
 if(directoryList && directoryList.length) {
 observable = observable.concat(
 Rx.Observable
 .from(directoryList)
 .map(mapDirectoryInfo)
 .flatMap(fileInfo => mkdirpRx(fileInfo.full).map(() => fileInfo))
 )
 }
 return observable
 }

 function buildSymLinks(observable, symLinkList, mapSymLinkInfo) {
 if(symLinkList && symLinkList.length) {
 observable = observable.concat(
 Rx.Observable
 .from(symLinkList)
 .map(mapSymLinkInfo)
 .flatMap(fileInfo => {
 if (process.platform === "win32") {
 let dirName = Path.dirname(fileInfo.full)
 return mkdirpRx(dirName).map(() => fileInfo)
 }
 else {
 return mkdirpRx(fileInfo.full).map(() => fileInfo)
 }
 })
 .flatMap(fileInfo =>
 symlinkRx(Path.join(fileInfo.base, fileInfo.toName), fileInfo.full, "junction")
 .map(() => fileInfo))
 )
 }
 return observable
 }
 }

 static removeWorkPaths() {
 return removePath(FileBuilder.localWorkPath())
 .then(removePath(FileBuilder.rootWorkPath()))
 }

 static createWorkPaths() {
 return createPath(FileBuilder.localWorkPath())
 .then(createPath(FileBuilder.rootWorkPath()))
 }

 static pathExists(workPath) {
 return new Promise((resolve, reject) => {
 FS.lstat(workPath, (err) => {
 if(err) {
 if(err.code === "ENOENT") {
 resolve(false)
 }
 reject(err)
 }
 else {
 resolve(true)
 }
 })
 })
 }

 static loadStats(fileInfo) {
 return Rx.Observable.create(observer => {
 FS.stat(fileInfo.full, (err, stats) => {
 if (err) {
 observer.onError(err)
 }
 else {
 fileInfo.stats = stats
 observer.onNext(fileInfo)
 observer.onCompleted()
 }
 })
 })
 }

 static loadSymLinkStats(fileInfo) {
 return Rx.Observable.create(observer => {
 FS.lstat(fileInfo.full, (err, stats) => {
 if (err) {
 observer.onError(err)
 }
 else {
 fileInfo.stats = stats
 observer.onNext(fileInfo)
 observer.onCompleted()
 }
 })
 })
 }
 }

 function removePath(workPath) {
 return FileBuilder
 .pathExists(workPath)
 .then(pathExists => {
 if(pathExists) {
 return new Promise((resolve, reject) => {
 rimraf(workPath, err => {
 if(err) {
 reject(err)
 }
 else {
 resolve()
 }
 })
 })
 }
 })
 }

 function createPath(workPath) {
 return FileBuilder
 .pathExists(workPath)
 .then(pathExists => {
 if (!pathExists) {
 return new Promise((resolve, reject) => {
 FS.mkdir(workPath, "0755", err => {
 if (err) {
 reject(err)
 }
 else {
 resolve()
 }
 })
 })
 }
 })
 }

 export default FileBuilder
 */
