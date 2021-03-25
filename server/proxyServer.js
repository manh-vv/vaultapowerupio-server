const GreenlockProxy = require('greenlock-proxy')

var proxy = new GreenlockProxy({
  maintainerEmail: "john@boid.com", // your email
  staging: false
})

// Just bind your domain to internal address - common example
proxy.register(["api.eospowerup.io"], ["http://localhost:3000"])

// Start proxiyng
proxy.start()