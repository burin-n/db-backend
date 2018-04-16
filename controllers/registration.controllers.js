const db = require('../configs/mysql').database;

exports.greeting = (req,res) => {
    res.json({greet:"hello"})
}

exports.getResults = (req,res) => {
    const query_string = "select * from Request where StudentID = ?";
    const student_id = req.body.student_id;
    db.query(query_string,[student_id], (err,results) => {
        console.log(results);
        res.json(results);
    })
}

exports.register = (req,res) => {
    const query_string = "insert into Request (StudentID, SubjID, CYear, CSemester, SecID) VALUES ?"
    const values = req.body.data;
    db.query(query_string,[values], (err, results) => {
        console.log(results);
        res.json(results);
    }); 
}