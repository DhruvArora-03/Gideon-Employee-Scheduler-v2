import http from 'http'
import express, { Express } from 'express'
import morgan from 'morgan'
import managers_routes from './routes/managers'
import employees_routes from './routes/employees'
import availability_routes from './routes/availability'
import shifts_routes from './routes/shifts'
import { connect, connection } from 'mongoose'

const router: Express = express();

// connect to mongodb
const uri = "mongodb+srv://Gideon:University380@ges.gjzwqlv.mongodb.net/?retryWrites=true&w=majority";
connect(uri);

// set up logging
router.use(morgan('dev'));

// allows for parsing of request body
router.use(express.urlencoded({extended: false}));

// parsing for json data
router.use(express.json());

// uhhhhh disable caching i think lol
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

router.use((req, res, next) => {
    // set the CORS policy, * --> allow requests from any client
    res.header('Access-Control-Allow-Origin', '*'); 
    
    // set the CORS headers that are allowed
    res.header('Access-Control-Allow-Headers',
        'origin, X-Requested-With,Content-Type,Accept, Authorization'
    );
    
    // set the CORS method headers that are allowed
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }

    // go to next middleware in stack
    next();
});

// use the routes in routes
router.use('/', managers_routes);
router.use('/', employees_routes);
router.use('/', availability_routes);
router.use('/', shifts_routes);

router.use('/test', (req, res, test) => {
    res.status(200).json({
        message: 'test successful!'
    });
});


// error handling - if we get here, no route was found
router.use((req, res, next) => {
    const error: any = new Error('Not found');
    return res.status(404).json({
        message: error.message
    });
});

// create the server
const httpServer: http.Server = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;

// start the server on PORT
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Closing the server');
    connection.close();
    process.exit(0);
  });

process.on('SIGTERM', () => {
console.log('Closing the server');
connection.close();
process.exit(0);
});