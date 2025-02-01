var multer = require('multer');

// var upload = multer({
//     dest: 'public/uploads/'
// })

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        // // console.log("FILE", file, "FILE");
        let extArray = file.mimetype.split("/");
        // // console.log("EXTARR", extArray, "EXTARR");
        let extension = extArray[extArray.length - 1];
        // // console.log("EXT", extension, "EXT");
        
        //cb(null , Date.now()+ '-' +file.originalname);

        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // check file type to be doc, or docx
            cb(null , Date.now()+ '.docx');
        } else if(file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){ // check file type to be excel
            cb(null , Date.now()+ '.xlsx');
        } else if(file.mimetype === 'text/plain'){ // check file type to be plain text, txt
            cb(null , Date.now()+ '.txt');
        } else {
            cb(null , file.originalname);
        }
    },
    // filename: function (req, file, cb) {
    //     // // console.log(file);
    //     cb(null , Date.now()+ '-' +file.originalname);
    // }
});
// // console.log("STORAGE", storage, "STORAGE")
var upload = multer({ storage: storage });

module.exports = upload;

// For all mimetypes
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types