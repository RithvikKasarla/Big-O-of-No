How to develop Express API Handlers.

> app.get()
> //this creates a GET api handler.
> 
> app.post()
> //this creates a POST api handler.
> 
> app.delete()
> //this creates a DELETE api handler.
> 
> app.patch()
> //this creates a PATCH api handler.

All of these functions require a 'URL'.  
For example, If I want to develop an API handler to GET the time, I would specify the api handler like this:

>app.get(
>	'/api/time',
>	(req,res) => {res.status(200).send(time)}
>)

>(req,res) => {code_to_call}
>//This portion is where the actual code is handled.


For testing the API handlers, use an app like Insomnia (recommended), or POSTMAN.

These programs let you input test API requests. 
You are required to specify the domain. For development this should almost always be 
>http://localhost/URL_HERE

You are also required to specify the request type, GET,POST,Etc.
Depending on the request type (POST, PATCH, Etc.), you might also be required to put in a 'body'. 

For our development, you should use the 'json' body content type.