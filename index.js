const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render('index', {files: files});
  })
})

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
    res.redirect('/')
    console.log(err)
  })
})

app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  fs.readFile(`./files/${filename}`, 'utf-8' , (err, filedata) => {
    res.render('show', { filename: filename, filedata: filedata })
  })
})

app.get('/edit/:filename', (req, res) => {
  const { filename } = req.params;
  res.render('edit', { filename: filename })
})

app.post('/edit', (req, res) => {
  const { previous , current } = req.body;
  fs.rename(`./files/${previous}`, `./files/${current}`, err => {
    res.redirect('/')
  });
})

app.listen(3000)