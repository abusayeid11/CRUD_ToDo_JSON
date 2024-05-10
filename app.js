const express = require('express');
const app = express();

 const fs = require('fs')

 const bodyParser = require('body-parser')

 app.use(bodyParser.json())

 let data = JSON.parse(fs.readFileSync('data.json'))

app.post('/task', (req, res)=>{
     try {
        const newTask = {
            id: data.length + 1,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        }

        data.push(newTask)
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
        res.status(201).json(data)

     } catch (error) {
        res.status(404).json({message: error.message})
     }
})


app.get('/task', (req, res)=>{
    try {
       res.status(201).send(data);
 
    } catch (error) {
       res.status(404).json({message: error.message})
    }
 })

app.get('/task/sortById', (req, res) => {
    try {
      const sortedTasks = data.slice().sort((a, b) => a.id - b.id);
      res.status(201).json(sortedTasks);
    } catch (error) {
      res.status(404).json({ message: 'Task not found' });
    }
  });

app.get('/task/search', (req, res)=>{
    try {
        const {q} = req.query
        const searchRes = data.filter(task => task.title.toLowerCase().includes(q.toLowerCase()) || task.description.toLowerCase().includes(q.toLowerCase()))
        res.status(201).json(searchRes)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
})

app.put('/task/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id)
        const update = req.body
        const taskIndex = data.findIndex(task => task.id == taskId)

        if(taskIndex != -1){
              data[taskIndex] = {...data[taskIndex], ...update}
              fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
              res.status(201).json(data)
        }else{
            res.status(404).json({message: "Task doesn't exists"})
        }

    } catch (error) {
        res.status(404).json({message: error.message})
    }
})

app.delete('/task/:id', (req, res)=>{
    try {
       const taskId = parseInt(req.params.id) 
       const taskIndex = data.findIndex(task => task.id == taskId)

       if(taskIndex != -1){
         data.splice(taskIndex, 1);
         fs.writeFileSync('data.json', JSON.stringify(data, null, 2))
         res.status(201).json(data)
       }
       else{
        res.status(404).json({message: "task doesn't exist"})
       }
    } catch (error) {
        res.status(404).json({message: error.message})
    }
})


app.listen(4000, function(){
    console.log('console running');
})