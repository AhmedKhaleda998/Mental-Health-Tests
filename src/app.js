const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config();

const { connection } = require('./configurations/database');

const authenticationRoutes = require('./routes/authentication');
const testRoutes = require('./routes/test');
const contactRoutes = require('./routes/contact');
const error = require('./controllers/error');

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Mental Health Test' });
});

app.use('/auth', authenticationRoutes);
app.use('/tests', testRoutes);
app.use('/contact', contactRoutes);
app.use(error.notFound);

connection().then(() => {
    app.listen(process.env.PORT, async () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
    process.exit();
});
