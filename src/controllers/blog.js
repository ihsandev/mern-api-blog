const { validationResult } = require('express-validator')
const BlogPost = require('../models/blog')
const path = require('path')
const fs = require('fs')

exports.createBlogPost = (req, res, next) => {
  
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    const err = new Error('Input value tidak sesuai')
    err.errorStatus = 400
    err.data = errors.array()
    throw err
  }
  
  if(!req.file) {
    const err = new Error('Image tidak boleh kosong')
    err.errorStatus = 422
    throw err
  }

  const title = req.body.title
  const body = req.body.body
  const image = req.file.path

  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: {uid: 1, name: 'Ihsan'}
  })

  Posting.save()
  .then(result => {
    res.status(201).json({
      message: 'Created Blog Post Success',
      data: result
    })
  })
  .catch(err => console.log(err))

}

exports.getBlogPost = (req, res, next) => {
  
  const currentPage = parseInt(req.query.page) || 1
  const perPage = parseInt(req.query.perPage) || 5
  let totalItems;
  
  BlogPost.find()
  .countDocuments()
  .then(count => {
    totalItems = count
    return BlogPost.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
  })
  .then(result => {
    res.status(200).json({
      message: 'Get Blog post successfull',
      data: result,
      total_data: totalItems,
      current_page: currentPage,
      per_page: perPage
    })
  })
  .catch(err => {
    next(err)
  })
}

exports.getCurrentBlogPost = (req, res, next) => {
  const postId = req.params.postId

  BlogPost.findById(postId)
    .then(result => {
      res.status(200).json({
        message: 'Get Current Blogpost success',
        data: result
      })
    })
    .catch(err => {
      next(err)
    })
}

exports.updateBlogPost = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    const err = new Error('Input value tidak sesuai')
    err.errorStatus = 400
    err.data = errors.array()
    throw err
  }
  
  if(!req.file) {
    const err = new Error('Image tidak boleh kosong')
    err.errorStatus = 422
    throw err
  }

  const title = req.body.title
  const body = req.body.body
  const image = req.file.path
  const postId = req.params.postId

  BlogPost.findById(postId)
  .then(post => {
    if(!post) {
      const err = new Error('Blogpost Tidak ditemukan')
      err.errorStatus = 404
      throw err
    }

    post.title = title
    post.body = body
    post.image = image

    return post.save()
  })
  .then(result => {
    res.status(200).json({
      message: 'Update Blogpost sucsess',
      data: result
    })
  })
  .catch(err => {
    next(err)
  })

}

exports.deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;
  
  BlogPost.findById(postId)
    .then(post => {
      if(!post) {
        const err = new Error('Blog Post tidak ditemukan')
        err.errorStatus = 404
        throw err
      }

      removeImage(post.image)
      return BlogPost.findByIdAndRemove(postId)
    })
    .then(result => {
      res.status(200).json({
        message: 'Berhasil menghapus blogpost',
        data: result
      })
    })
    .catch(err => {
      next(err)
    })
  }
  const removeImage = (filePath) => {
    const pathname = path.join(__dirname, '../..', filePath)
    fs.unlink(pathname, err => console.log(err))
  }