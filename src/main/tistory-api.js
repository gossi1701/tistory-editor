const oauth2 = require('electron-oauth2');
const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const querystring = require('querystring')
const ipc = require('./ipc-event')
const FormData = require('form-data')
const {clipboard} = require('electron')
const stream = require('stream');

const errorHandler = (res) => {
  if (!res.ok) {
    throw res.json()
  }

  return res.json()
}

module.exports.getAccessToken = (callback) => {
  oauth2info = JSON.parse(fs.readFileSync(path.join(__dirname, "../../oauth2info.json"), 'utf8'))
  const tistoryOAuth = oauth2(oauth2info, {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
  })

  return tistoryOAuth.getAccessToken({})
    .then(token => callback(token))
}

module.exports.fetchBlogInfo = (auth) => {
  return fetch("https://www.tistory.com/apis/blog/info?" + querystring.stringify({
    access_token: auth.access_token,
    output: "json"
  }))
  .then(errorHandler)
}

module.exports.fetchUser = (auth) => {
  return fetch("https://www.tistory.com/apis/user/?" + querystring.stringify({
    access_token: auth.access_token,
    output: "json"
  }))
  .then(errorHandler)
}

module.exports.fetchPosts = (auth, blogName, page) => {
  return fetch("https://www.tistory.com/apis/post/list?" + querystring.stringify({
    access_token: auth.access_token,
    output: "json",
    blogName: blogName,
    count: 30,
    page: page? page : 1
  }))
  .then(errorHandler)
}

module.exports.fetchContent = (auth, blogName, postId) => {
  return fetch("https://www.tistory.com/apis/post/read?" + querystring.stringify({
    access_token: auth.access_token,
    output: "json",
    blogName: blogName,
    postId: postId
  }))
  .then(errorHandler)
}

module.exports.fetchCategories = (auth, blogName) => {
  return fetch("https://www.tistory.com/apis/category/list?" + querystring.stringify({
    access_token: auth.access_token,
    output: "json",
    blogName: blogName
  }))
  .then(errorHandler)
}

module.exports.saveContent = (auth, blogName, post) => {
  let formdata = makePostFormData(auth, blogName, post)
  formdata.append("postId", post.id)

  return fetch("https://www.tistory.com/apis/post/modify", {
    method: 'post',
    body: formdata
  })
  .then(errorHandler)
}

module.exports.addContent = (auth, blogName, post) => {
  let formdata = makePostFormData(auth, blogName, post)

  return fetch("https://www.tistory.com/apis/post/write", {
    method: 'post',
    body: formdata
  })
  .then(errorHandler)
}

const makePostFormData = (auth, blogName, post) => {
  let formdata = new FormData()
  formdata.append("access_token", auth.access_token)
  formdata.append("output", "json")
  formdata.append("blogName", blogName)
  formdata.append("title", post.title)
  formdata.append("content", post.content)
  if (post.categoryId) {
    formdata.append("category", post.categoryId)
  }
  if (post.visibility) {
    formdata.append("visibility", post.visibility)
  }
  if (post.tags.tag) {
    formdata.append("tag", post.tags.tag)
  }
  return formdata
}

module.exports.uploadFile = (auth, blogName, filepath) => {
	console.log("uploadFile", blogName, filepath)
	return uploadFile(auth.access_token, blogName, fs.createReadStream(filepath))
}

module.exports.uploadFileWithImage = (auth, blogName, image) => {
	console.log("uploadFileWithImage", blogName)
	var pngImageBuffer = image.toPNG()
	var imageStream = new stream.PassThrough()
	imageStream.end(pngImageBuffer)
	return uploadFile(auth.access_token, blogName, imageStream, {
		filename: 'clipboard.png',
		contentType: 'image/png',
		knownLength: pngImageBuffer.length
	})
}

const uploadFile = (accessToken, blogName, fileBlob, fileOption) => {
	let formdata = new FormData();
  formdata.append("access_token", accessToken)
  formdata.append("output", "json")
  formdata.append("blogName", blogName)
  formdata.append("uploadedfile", fileBlob, fileOption)

  return fetch("https://www.tistory.com/apis/post/attach", {
    method: 'post',
    body: formdata
  })
  .then(errorHandler)
}
