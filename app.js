const express = require('express')
const app = express()
const postRoutes = require('./routes/post')
const not_found = require('./middlewares/not_found.js')
const logger = require('./middlewares/logger.js')

/*app.use('/posts', (req, res, next) => {
    throw new Error("Hai rotto tutto!");
  }); */
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.static('public'))
app.use('/posts', logger)
app.use('/posts', postRoutes)
app.use(not_found)

app.listen(3000, () => {
  console.log("Server started on port 3000")
});

app.use((err, req, res, next) => {
  console.log("Error: ", err.message);
  console.error(err.stack);
  res.status(500).send({
    message: "Qualcosa è andato storto!",
    error: err.message
  })
});
