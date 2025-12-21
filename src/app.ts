import express from 'express';

const app = express();

const PORT = process.env.PORT || 8800


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})

