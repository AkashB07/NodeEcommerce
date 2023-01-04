const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');


const errorController = require('./controllers/error');

const app = express();

const  cors = require('cors')

const dotnev = require('dotenv');
dotnev.config();

const sequelize=require('./util/database')

const Product=require('./models/product')
const User=require('./models/user')
const Cart=require('./models/cart')
const CartItem=require('./models/cart-item')
const Order=require('./models/order')
const OrderItem=require('./models/order-item')

app.use(cors())

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



app.use((req,res,next)=>{
    User.findByPk(1).then(user=>{
        req.user=user;
        console.log(req.user)
        next();
    }).catch(err=>console.log(err))
})





app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

User.hasOne(Cart);
Cart.belongsTo(User);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);


Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });

// sequelize.sync({force:true})
  sequelize.sync()
.then(result=>{
    console.log('data base connected');
    return User.findByPk(1)
    
   
}).then(user=>{
    if(!user){
        return User.create({name:'Max',email:"max@gmail.com"});
    }
    return user
}).then(user=>{
    // console.log(user);
   return user.createCart();
    
})
.then(user=>{
   
    app.listen(3000);
})
.catch(err=>{
    console.log(err)})