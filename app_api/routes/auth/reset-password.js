const Router = require ('express').Router;
const Token = require ('../../models/Token');
const User = require ('../../models/User');
const Validator= require ('../../validators/joiValidator')
const bcrypt = require ('bcryptjs');

const router = Router({mergeParams : true})

router.get ('/reset-password/:token', async (req, res) => {
     const token = await Token.findOne ({
        token : req.params.token,
        tokenType : "resetPassword" 
    })
    console.log(token); 
    if (!token){
        res.status(400).send({
            message : 'No token found!'
        })
    }
})

router.post ('/change-password/:token', async (req, res, next) => {
try{
    Validator.resetPasswordValidation(req.body);
    const token = await Token.findOne(
        {
            token : req.params.token,
            tokenType : 'resetPassword'
        })
        if(!token){
            res.status(400).send(
                {message : 'No token found!'
            })
        }
const user = await User.findOne (
    {
        _id : token._userId
    })
    if(!user){
        res.status(400).send(
            {message : 'No user found!'
        })
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedPassword;
    
    await user.save();
return res.status(200).send({
    message : "your password is reset"
})
}catch (error){
    next(error);
}  
})

module.exports = router;