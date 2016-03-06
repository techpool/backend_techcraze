module.exports = function (app) {
    app.post('/register', function (req, res) {

        var body = req.body;
        var studentObj = new Student({
            name: body.name,
            password: body.password,
            emailId: body.emailId,
            college: body.college,
            mobile: body.mobile
        });

        studentObj.save(function (err, savedObj) {
            if (err) {
                console.log(err);
                res.json({
                    status: 'failed',
                    err: err
                });
            } else {
                savedObj = savedObj.toObject();
                delete savedObj.password;
                delete savedObj.__v;
                res.json({
                    status: 'success',
                    student: savedObj
                });
            }
        });
    })
}
