const express = require('express');
const app = express();

app.use(express.static('./build'));

app.get('*', (req, res) => {
  return res.sendFile(__dirname + '/build/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Endo App working on PORT", PORT);
});
