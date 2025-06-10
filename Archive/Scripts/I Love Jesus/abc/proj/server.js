const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('client.html', { root: __dirname });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
