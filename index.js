const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edzrn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 5055

const app = express()

app.use(cors());
app.use(express.json());

var serviceAccount = {
    "type": "service_account",
    "project_id": "burj-al-arab-after-auth-done",
    "private_key_id": "226528ce22c05448a5e9a066eb3f3790c00aaee8",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClRzLdugGhc6Hq\ndf/u8sYvUHgGo0UjUsgMocc8Rgs9vfIO6LX+NdRsdtrP5WX1YLBaK5rWIBlP4Qqk\nhsk15Q1sx0e+Ww0yF/T09vKeBXV/WfGxmcntIR8b0Al+Q9EpvyIeUQbYLKk7vKhL\nCuvHVdkQRubqniCwcRqRLkwOvjHWhqeIsFYTVdycRC7fc1HOqGoE7OV1Es9spx6O\nyCnWZ6tUPZ/1qN9a8zWwam7EFdC7z9oXkaHY1pIEEGd6wPCe2WjIYieHXIdTtzLw\nuoKHunGTccsX/vsgTPhNde4WV5L3AmROgy0KM1wQc6R6V9sfOAABdnW91/oS5VCR\nQi8aZ02FAgMBAAECggEAHzGvMMiOzrtdk7w2NBHnpF32bWBK6AYTgkjVavOYYwyS\n30v+L27W+yq6lTLpebTITBh/Rosz487oXJGg79ZdoIqDKLMULEB3x/VE6NzEZqch\n9iB9y07tSWlMJWPk2hF8PccSuOHDBiaPB+zVf9+c0pTjN+Rk7JBIUJ7xlXXBv8iH\n3L8xkTzL7sgGfeyU6/q2YQn2zJpkBiVMbGyFLcwsiselcXjPPjDCFOECo941VQmk\npkuridcIQDGUSYn14QP8Y0HsdI9mCUiek70ZVW0BTtxuu3K+rnlWZEkNXj22QLXS\nsuOe0CABbuOKbNY09bV4XZhJlLpW68EWHuAQoFeYqQKBgQDiaODhCUttWhq9kI9+\ncKeAdpMrL2vVq7ba1BGVm+Fg/P0EgB3r7B2hdPJX9cedSyiAAqTVSdouabHlltfg\nbK9jjQn8DLz0zPdSETQEkNYJerSC/CrPhZAMwdObCXl/yjnU5n39RyarIcsiM3jK\nIKUHbsGrwV9fcvq6VhQjVUaLjQKBgQC64QF4CqjHpsoAEtUXyy9iUJnBa9v0upVN\nVUVCKmexp0l18xJzlzva/aGbGFxSeCbKsqAnLt1iRMGqJc2J5Evhw2rYETwTwwUH\nO1oeBn2HqAgc8YfkCA5w79pQycyCRniscw92nyEgsgntCXpIrMXPc/athJP41ptO\nbkFEjtTP2QKBgHIx0dLPHFMgUkJwil+MtH9PzzTF607PGCBRPDlIcSm5EGjXsb/P\nzLYlxSHmXnMQeHHwY3EMmdY1Czwwk9unFeNRPMr7JccXJlsnQCRZZQtM74TtaS5Y\nQGqezHrzEWwJ9JdUVhGMdI12Mv2iFndkdbhE/bwCgXckCCA50Fht53H1AoGBAKYL\nvNljZzoWeY99LDf7Anwxr5xL8OFPU8+lv2cd9IrGYCBcPP3V14oqKAh9qbJhLd6W\nvnRyUKS7APTkp+8omT/c+bdIAQByHKqjUtww2iLJ64OEHEFB40r34xw7YeozIY/g\noFG+7Jl3eBhUfoHKeextVjYxAaVtUgtrLbTz0CVpAoGACmQbepZtquJzA/J3kiVl\n67+/U9NPdNR9OaVCKlB2P7ur536ih0sSQGcsgD74PU7X+2qwnuLdLXvhX3na8KLv\nD7xys+aGmxaaJ2gZK3b4wH1Sec4Z45VkdxqurRMv3VF2jgAODbtAqZd4+Q7XhzjX\nR50CVREw9hjXxeFTkai6dCE=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ws5sl@burj-al-arab-after-auth-done.iam.gserviceaccount.com",
    "client_id": "106876070185993344220",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ws5sl%40burj-al-arab-after-auth-done.iam.gserviceaccount.com"
}


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
    const bookings = client.db("volunteer").collection("bookings");
    const eventCollection = client.db("volunteer").collection("events");
    const servicesCollection = client.db("volunteer").collection("services");
    const reviewsCollection = client.db("volunteer").collection("reviews");
    const adminCollection = client.db("volunteer").collection("admins");

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        // console.log(newBooking);
        bookings.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
                // console.log(result);
            })
    })

    app.get('/events', (req, res) => {
        servicesCollection.find({})
            .toArray((err, items) => {
                res.send(items)
                // console.log("From Database", items);
            })
    })
    app.get('/reviews', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, items) => {
                res.send(items)
                // console.log("From Database", items);
            })
    })

    app.get('/events/:id', (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, items) => {
                res.send(items[0])
                // console.log("From Database", items);
            })
    })

    app.post('/addProduct', (req, res) => {
        const newEvent = req.body;
        console.log("adding new event: ", newEvent);
        servicesCollection.insertOne(newEvent)
            .then(result => {
                console.log('Inserted Count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/addReviews', (req, res) => {
        const newEvent = req.body;
        console.log("adding new event: ", newEvent);
        reviewsCollection.insertOne(newEvent)
            .then(result => {
                console.log('Inserted Count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })


        app.get('/bookings', (req, res) => {
            bookings.find({ email: req.query.email })
                .toArray((err, documents) => {
                    res.send(documents);
                })
        })


        // ==>>Tried to add admin access!
        // app.get('/bookings', (req, res) => {
        //     const queryEmail = req.query.email
        //     console.log(queryEmail)
        //     adminCollection.find({ email: queryEmail })
        //         .toArray((err, documents) => {
        //             res.send(documents.length > 0)
        //         })
        // })

        // app.post('/bookings', (req, res) => {
    //     const price = req.body;
    //     const email = req.query.email;
    //     adminCollection.find({ email: email })
    //         .toArray((err, doctors) => {
    //             const filter = {}
    //             if (doctors.length === 0) {
    //                 filter.email = email;
    //                 console.log(doctors)
    //             }
    //             bookings.find(filter)
    //                 .toArray((err, documents) => {
    //                     console.log(email, doctors, documents)
    //                     res.send(documents);
    //                 })
    //         })
    // })
    
    app.get('/items', (req, res) => {
        servicesCollection.find({})
            .toArray((err, items) => {
                res.send(items)
                // console.log("From Database", items);
            })
    })
    app.get('/allorders', (req, res) => {
        bookings.find({})
            .toArray((err, items) => {
                res.send(items)
                // console.log("From Database", items);
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
                res.send(result.deletedCount > 0);
            })
    })

    app.delete('/processed/:id', (req, res) => {
        console.log(req.params.id);
        bookings.deleteOne({ _id: req.params.id })
            .then(result => {
                console.log(result);
                // res.send(result.deletedCount > 0);
            })
    })

    app.delete('/remove/:id', (req, res) => {
        console.log(req.params.id);
        bookings.deleteOne({ _id: req.params.id })
            .then(result => {
                console.log(result);
                // res.send(result.deletedCount > 0);
            })
    })

});


app.get('/', (req, res) => {
    res.send('This is Server!')
})

app.listen(process.env.PORT || port)