module.exports = function (app) {

    app.get('/login', function (req, res) {
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


    app.post('/login', function (req, res) {

        var body = req.body;

        Student.findOne({ emailId: body.emailId }).select('password').exec(function (err, student) {
            if (err) throw err;

            if (student) {
                // test a matching password
                student.comparePassword(body.password, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        res.json({
                            status: 'success'
                        });
                    } else {
                        res.json({
                            status: 'failed'
                        });
                    }
                });
            } else {
                res.json({
                    status: 'failed'
                });
            }
        });
    })
}
