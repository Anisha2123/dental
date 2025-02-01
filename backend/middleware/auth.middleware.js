const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.auth = (req, res, next) => {
    const token = req.get('authorization')?.split(' ')[1]; // Bearer YOUR_TOKEN
    
// console.log(token, "TOKENNNNNNNNNNNNNNN")
    if (!token) {
        req.isAuth = false;
        return res.send({
            message: 'Token not found',
            status: 200
        })
    }
    
    try {      
        let decodedToken = jwt.decode(token);
        if (!decodedToken) {
            req.isAuth = false;
            return res.send({
                message: 'Unauthorized',
                status: 401
            })
        }
        if(decodedToken.role == 'dentist'){
           
            let verifyUserToken = jwt.verify(token, config.user_jwt_secret);
            
            if(!verifyUserToken){
                
                req.isAuth = false;
            } else {
                req.sessionUserData = verifyUserToken
                // console.log(req.sessionUserData);
                req.isAuth = true;
            }
        }
        if(decodedToken.role == 'admin'){
            // console.log(decodedToken, decodedToken.role,"TOKEN ADMIN");
            let verifyAdminToken = jwt.verify(token, config.admin_jwt_secret);
            if(!verifyAdminToken){
                req.isAuth = false;
            } else {
                req.sessionUserData = verifyAdminToken
                // console.log(req.sessionUserData);
                req.isAuth = true;
               
            }
        }
        // decodedToken = jwt.verify(token, config.user_admin_jwt_secret);
        // decode basis on user and admin
        // if (!decodedToken) {
        //     req.isAuth = false;
        // } else {
        //     req.sessionUserData = decodedToken;
        //     req.isAuth = true;
        // }
        if (!req.isAuth) {
            return res.send({
                message: 'Unauthorized',
                status: 401
            })
        } 
        next();
    
    } catch (err) {
        
        req.isAuth = false;
        return res.send({
            message: 'Unauthorized',
            status: 401
        })
    }
}