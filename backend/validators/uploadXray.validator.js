const { check, validationResult } = require("express-validator");

const validateUploadXray = async (req, res, next) => {

    await check("xray_image", "Xray image is required.").exists().run(req);

    await check("user_id", "User_id is required").exists().run(req);

    // await check("created_at", "Date required").exists().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).send({ error: errors.array() })
    } else {
        next();
    }
}

module.exports = {
    validateUploadXray,
}