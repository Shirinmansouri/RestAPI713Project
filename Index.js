var SERVER_NAME = 'image-api'
var PORT = 5000;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the images
  , imageSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images')
  console.log(' /images/:id')  
})

server
  // Allow the use of POSTnpm
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

var getRequestCout=0
var postRequestCount=0


// Get all images in the system
server.get('/images', function (req, res, next) {
  getRequestCout=getRequestCout+1
  console.log('Processed Request Count--> Get:%s, Post:%s',getRequestCout,postRequestCount)
  console.log('images GET: received request')
  // Find every entity within the given collection
  imageSave.find({}, function (error, images) {

    // Return all of the images in the system
    console.log('images GET: sending response')
    res.send(images)
  })
})


// Get a single image by their image id
server.get('/images/:id', function (req, res, next) {
  getRequestCout=getRequestCout+1
  console.log('Processed Request Count--> Get:%s, Post:%s',getRequestCout,postRequestCount)
  console.log(' images GET: received request')
  // Find a single image by their id within save
  imageSave.findOne({_id: req.params.id}, function(error,image)
  {
    if (error)  return next( new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    if (image)
    {
      console.log('images GET: sending response')
      res.send(image)
    }
    else
    {
      res.send(404)
    }

  })
})


// Create a new image
server.post('/images', function (req, res, next) {
  postRequestCount=postRequestCount+1
  console.log('Processed Request Count--> Get:%s, Post:%s',getRequestCout,postRequestCount)
  console.log(' images POST: received request') 
var newImage= {
  imageId : req.params.imageId,
  name : req.params.name,
  url : req.params.url,
  size : req.params.size
}

// Validations for make sure that all data is provided
if (newImage.imageId == undefined)
{
  return next (new restify.InvalidArgumentError('Id must be supplied !'))
}
if (newImage.name == undefined)
{
  return next (new restify.InvalidArgumentError('Name must be supplied !'))
}
if (newImage.size == undefined)
{
  return next (new restify.InvalidArgumentError('Size must be supplied !'))
}
if (newImage.url == undefined)
{
  return next (new restify.InvalidArgumentError('Url must be supplied !'))
}
  
  // Create the image using the persistence engine
  imageSave.create( newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    console.log('images POST: sending response')
    // Send the image if no issues
    res.send(201, image)
  })
})

// Update an image by their id
server.put('/images/:id', function (req, res, next) {
  postRequestCount=postRequestCount+1
  console.log('Processed Request Count--> Get:%s, Post:%s',getRequestCout,postRequestCount)
  console.log('images PUT: received request') 
  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.size === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('size must be supplied'))
  }
  if (req.params.url === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('url must be supplied'))
  }
  if (req.params.imageId === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('imageId must be supplied'))
  }
  
  var newImage = {
		imageId: req.params.imageId,
		name: req.params.name, 
		size: req.params.size,
    url : req.params.url,
    _id : req.params.id
	}
  
  // Update the image with the persistence engine
  imageSave.update(newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    console.log('images PUT: sending response')
    res.send(200)
  })
})

// Delete image with the given id
server.del('/images', function (req, res, next) {
  postRequestCount=postRequestCount+1
  console.log('Processed Request Count--> Get:%s, Post:%s',getRequestCout,postRequestCount)
  console.log(' images DELETE: received request') 
  // Delete the image with the persistence engine
  imageSave.deleteMany( {},function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    console.log('images DELETE: sending response')
    res.send()
  })
})


