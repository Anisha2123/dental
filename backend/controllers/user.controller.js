const User = require('../models/user')

exports.setUser = (req, res) => {

    const user = new User(req.body);

    const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const regexNumOnly = /^[0-9]*$/;


    if (req.body.email == undefined || !req.body.email || req.body.email.trim() == "") {
        return res.status(500).send({ error: "Please enter the email." })
    } else if (!regex.test(req.body.email)) {
        return res.status(550).send({ error: "Please type proper format of email." })
    } else if (req.body.first_name == undefined || !req.body.first_name || req.body.first_name.trim() == "") {
        return res.status(500).send({ error: "Please enter the first name." })
    } else if (req.body.last_name == undefined || !req.body.last_name || req.body.last_name.trim() == "") {
        return res.status(500).send({ error: "Please enter the last name." })
    } else if (req.body.contact_number == undefined || !req.body.contact_number) {
        return res.status(500).send({ error: "Please enter the contact number." })
    } else if (!regexNumOnly.test(req.body.contact_number)) {
        return res.status(500).send({ error: "Contact must be number only." })
    } else if (req.body.password == undefined || !req.body.password || req.body.password.trim() == "") {
        return res.status(500).send({ error: "Please enter the password." })
    } else if (req.body.password.length < 6) {
        return res.status(500).send({ error: "Password should be at least 6 digits." })
    } else if (req.body.address1 == undefined || !req.body.address1 || req.body.address1.trim() == "") {
        return res.status(500).send({ error: "Please enter the address1 field." })
    } else if (req.body.role == undefined || !req.body.role || req.body.role.trim() == "") {
        return res.status(500).send({ error: "Please select the role." })
    } else if (req.body.city == undefined || !req.body.city || req.body.city.trim() == "") {
        return res.status(500).send({ error: "Please enter the city." })
    } else if (req.body.state == undefined || !req.body.state || req.body.state.trim() == "") {
        return res.status(500).send({ error: "Please enter the state." })
    } else if (req.body.country == undefined || !req.body.country || req.body.country.trim() == "") {
        return res.status(500).send({ error: "Please enter the country." })
    } else if (req.body.pincode == undefined || !req.body.pincode) {
        return res.status(500).send({ error: "Please enter the pin." })
    }

    user.email = user.email.toLowerCase().trim();
    user.first_name = user.first_name.trim();
    user.last_name = user.last_name.trim();
    user.address1 = user.address1.trim();
    user.address2 = user.address2.trim();
    user.password = user.password.trim();
    user.city = user.city.trim();
    user.state = user.state.trim();
    user.country = user.country.trim();
    // user.role = user.role.trim();
    user.password = user.generateHash(req.body.password);

    User.findOne({ email: req.body.email.toLowerCase().trim() }).exec((err, existingUser) => {
        if (err) {
            return res.status(500).send({ error: "Internal server error." })
        } else if (existingUser) {
            res.status(404).send({ err: "Email is already registered, please Sign-in or user different email." })
        } else {
            user.save((error, data) => {
                if (error) {
                    return res.status(500).send({ error: "Internal server error." })
                }
                res.status(200).send({ data: data })
            })
        }
    })

    // user.save((err, message) => {
    //     if (err) {
    //         return res.status(500).send({ err: "Internal server error" })
    //     }
    //     res.status(200).send({ message: "Created successfully" })
    // })
}

exports.getUser = (req, res) => {
    User.find({}).exec((err, data) => {
        if (err) {
            return res.status(500).send({ error: "Internal server error!" })
        }
        res.status(200).send({ data: data })
    })
}

// detecting existing user from header is faster
exports.detectingUser = (req, res) => {
    User.findOne({ email: req.body.email.toLowerCase().trim() }).exec((err, existingUser) => {
        if (err) {
            return res.status(500).send({ error: "Internal server error." })
        } else {
            if (existingUser) {
                req.status(200).send()
            } else {
                res.status(404).send()
            }
        }
    })
}

exports.resetPwd = (req, res) => {
    
}