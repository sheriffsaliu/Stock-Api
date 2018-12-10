let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg')
let env = require('dotenv').config()
//let cors = require('cors');
const PORT = 3000;

let pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
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
                    console.log(err);
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

app.get('/api/available-products-count', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            let status = '1'
            db.query('SELECT COUNT(*) FROM products WHERE product_status = $1' ,[status], function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log(JSON.stringify(table.rows));
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});

app.get('/api/available-orders', function(request, response){
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            let status = '1'
            db.query('SELECT * FROM orders WHERE order_status = $1' ,[status], function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log(JSON.stringify(table.rows));
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});

app.get('/api/available-orders-count', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            let status = '1'
            db.query('SELECT COUNT(*) FROM orders WHERE order_status = $1' ,[status], function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log(JSON.stringify(table.rows));
                    //db.end();
                    response.status(200).send(table.rows);
                }
            })
        }
    })
});

app.get('/api/low-stock-count', function (request, response) {
    pool.connect(function (err, db, done) {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            let status = '1';
            let quantity = 3;
            db.query('SELECT COUNT(*) FROM products WHERE product_status = $1 AND quantity <= 3' ,[status], function (err, table) {
                done();
                if (err) {
                    return response.status(400).send(err);
                }
                else {
                    console.log(JSON.stringify(table.rows));
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
        request.body.product_status,
        request.body.brand_id,
        request.body.categories_id,
        request.body.quantity,
        request.body.price,
        request.body.active
    ];
    pool.connect((err, db, done) => {
        if (err) {
            return response.status(400).send(err);
        }
        else {
            db.query('INSERT INTO products (product_name, product_image, product_status, brand_id, categories_id,quantity,price,active) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [...values], (err, table) => {
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
