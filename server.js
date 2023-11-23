import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';



//routes import
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';


 
//configure evv
dotenv.config();

//database connection
connectDB();


const PORT =process.env.PORT || 8080

//rest object
const app= express();

//middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

//rest api
app.get("/", (req,res)=>{
    res.send("<h1>Welcome to GIGAFIBER-PLAY</h1>");
})

app.listen(PORT, ()=>{
    console.log(`Server runnig on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);

});


