let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg')
//let cors = require('cors');
const PORT = 3000;

let pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    password: '',
    database: 'simventory_db',
    user: 'sheriffsaliu',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));


app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/brands', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('SELECT * FROM brands', function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA FETCHED");
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});
app.post('/api/post-brand', function (request, response) {
    let values = [request.body.brand_name, request.body.brand_status, request.body.brand_active];
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('INSERT INTO brands (brand_name, brand_status, brand_active) VALUES($1, $2, $3)', [...values], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA INSERTED " + JSON.stringify(table));
                    //db.end();
                    response.status(201).send({ message: 'Data Inserted' });
                }
            })
        }
    })
    console.log(request.body);
})

app.post('/api/delete-brand/:id', function(request, response){
    var id = request.params.id;

    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('DELETE FROM brands WHERE brand_id = $1', [id], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    //db.end();
                    response.status(201).send({ message: 'Data Deleted' });
                }
            })
        }
    })
});

app.get('/api/get-total-product-count', function(request, response){
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('SELECT COUNT products', (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA Counted " + JSON.stringify(table));
                    //db.end();
                    response.status(201).send(table.rows);
                }
            })
        }
    })
})

app.get('/api/categories', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('SELECT * FROM categories', function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA FETCHED");
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});
app.post('/api/post-category', function (request, response) {
    let values = [request.body.category_name, request.body.category_status, request.body.category_active];
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('INSERT INTO categories (category_name, category_status, category_active) VALUES($1, $2, $3)', [...values], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA INSERTED " + JSON.stringify(table));
                    //db.end();
                    response.status(201).send({ message: 'Data Inserted' });
                }
            })
        }
    })
    console.log(request.body);
})

app.post('/api/delete-category/:id', function(request, response){
    var id = request.params.id;

    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('DELETE FROM categories WHERE category_id = $1', [id], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    //db.end();
                    response.status(201).send({ message: 'Data Deleted' });
                }
            })
        }
    })
});

app.get('/api/products', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('SELECT * FROM products', function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA FETCHED");
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});

app.post('/api/post-product', function (request, response) {
    let values = [
        request.body.product_name, 
        request.body.product_image, 
        request.body.brand_id,
        request.body.categories_id,
        request.body.quantity,
        request.body.rate,
        request.body.active,
        request.body.product_status
    ];
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('INSERT INTO brands (product_name, product_image, brand_id,categories_id,quantity,rate,active,brand_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [...values], (err, table) => {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA INSERTED " + JSON.stringify(table));
                    //db.end();
                    response.status(201).send({ message: 'Data Inserted' });
                }
            })
        }
    })
    console.log(request.body);
})

app.get('/api/orders', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('SELECT * FROM orders', function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA FETCHED");
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});

app.get('/api/users', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('SELECT * FROM users', function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log("DATA FETCHED");
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));
