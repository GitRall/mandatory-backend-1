const express = require('express');
const app = express();
const port = 3001;

app.get('/test', (req, res) => {
  console.log(req.method);
})

app.listen(port, () => console.log(`Listening on port ${port}!`));
