const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello!', node: process.version });
});

app.listen(3000, () => console.log('Running on :3000'));
