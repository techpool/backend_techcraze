module.exports = function (app) {
    app.get('/register', function (req, res) {
        var sess = req.session;
        if (sess.emailId) {
            res.json({
                status: 'success',
                addInfo: 'Already Logged In'
            })
        } else {
            res.json({
                status: 'failed',
                addInfo: 'Please Log In'
            });
        }
    });


    app.post('/register', function (req, res) {

        var sess = req.session;
        var body = req.body;
        var studentObj = new Student({
            name: body.name,
            password: body.password,
            emailId: body.emailId,
            college: body.college,
            mobile: body.mobile
        });

        sess.emailId = body.emailId;
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
