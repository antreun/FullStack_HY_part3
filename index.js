const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan(':method :url :postData :status :res[content-length] - :response-time ms'))

morgan.token('postData', function getPostId (req) {
  return JSON.stringify(req.body);
})


let persons = [
  {
    id: 1,
    name: 'Matti Meikäläinen',
    number: '040-1234567'
  },
  {
    id: 2,
    name: 'Teppo Testi',
    number: '040-7654321'
  },
  {
    id: 3,
    name: 'Essi Eksample',
    number: '040-1726354'
  }
]


app.get('/', (req, res) => {
  res.send('<h1>Persons!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send('<h4>puhelinluettelossa on '+persons.length+' henkilön tiedot.</h4>'+
            new Date())
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  //console.log("deleting id:"+id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return parseInt(Math.random()*1000000);
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)
  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }
  if(persons.filter(person => person.name == body.name).length > 0) {
    return response.status(400).json({ error: 'person already present' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
