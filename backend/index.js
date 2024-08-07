import express from "express"
import db from "./config.js"
import cors from "cors"

const app = express()
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json("hello this is the backend!!!")
})

app.get("/users",(req,res)=>{
    const query = "SELECT * FROM user"
    db.query(query,(err,data)=>{
        if(err){
            console.log(err)
            return res.json(err)
        }
        return res.json(data)
    })
})

app.post("/registeruser",(req , res)=>{
    const {name,password} = req.body;
    const sql = 'INSERT INTO user (name , password) VALUES (? , ?)';
    db.query(sql , [name,password],(err , result)=>{
        if(err){
            console.log('error executing sql' + err.stack);
            res.status(500).json({error : 'Internal server error'});
            return;
        }
        res.status(201).json({message:'User Registered Successfully'});
    })

})

app.post("/registercandidate",(req , res)=>{
    const {firstName,middleName, lastName, dateOfBirth,city,email,password,examId} = req.body;
    const sql = 'INSERT INTO candidate (firstName,middleName,lastName,dateOfBirth,city,email , password,examId) VALUES (? , ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql , [firstName,middleName,lastName,dateOfBirth,city,email,password,examId],(err , result)=>{
        if(err){
            console.log('error executing sql' + err.stack);
            res.status(500).json({error : 'Internal server error'});
            return;
        }
        res.status(201).json({message:'Candidate Registered Successfully'});
    })

})


app.post("/addexam/create-exam",(req , res)=>{
    const {examId,examDate, beginTime, endTime,numberOfQuestions,marksPerQuestion,totalMarks,status} = req.body;
    const sql = 'INSERT INTO exam (examId,examDate, beginTime, endTime,numberOfQuestions,marksPerQuestion,totalMarks,status) VALUES (? , ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql , [examId,examDate, beginTime, endTime,numberOfQuestions,marksPerQuestion,totalMarks,status],(err , result)=>{
        if(err){
            console.log('error executing sql' + err.stack);
            res.status(500).json({error : 'Internal server error'});
            return;
        }
        res.status(201).json({message:'Candidate Registered Successfully'});
    })

})

//alternate
// app.post("/addexam/create-questions-table", (req, res) => {
//     const { examId, questions } = req.body;
  
//     // Build the columns for the questions and time to complete dynamically
//     let columns = 'examId INT, ';
//     for (let i = 1; i <= questions; i++) {
//       columns += `q${i} TEXT, timetocomplete${i} INT, `;
//     }
//     columns = columns.slice(0, -2); // Remove the last comma and space
  
//     const tableName = `Questions_for_examId_${examId}`;
//     const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
//     console.log("entered here")
//     db.query(query, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('Error creating table');
//       }
//       res.status(201).send('Table created successfully');
//     });
//   });


//   app.post("/addexam/addquestions", (req, res) => {
//     const { examId, questions, timeToComplete } = req.body;
  
//     // Determine the table name based on examId
//     const tableName = `Questions_for_examId_${examId}`;
    
//     // Build the columns and values for the INSERT query dynamically
//     const columns = ['examId', ...Array.from({ length: questions.length }, (_, i) => `q${i + 1}`), ...Array.from({ length: questions.length }, (_, i) => `timetocomplete${i + 1}`)];
//     const values = [examId, ...questions, ...timeToComplete];
    
//     // Create placeholders for the SQL query
//     const placeholders = columns.map(() => '?').join(', ');
//     const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
  
//     // Execute the query
//     db.query(query, values, (err, result) => {
//       if (err) {
//         console.error('Error executing SQL:', err);
//         return res.status(500).send('Internal server error');
//       }
//       res.status(201).send('Questions added successfully');
//     });
//   });


app.post("/addexam/create-questions-table", (req, res) => {
    const { examId } = req.body;
  
    // Define the table structure with appropriate column types
    const tableName = `Questions_for_examId_${examId}`;
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
      examId INT,
      qid INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT,
      timetocomplete INT,
      ansid INT,
      answer TEXT
    )`;
  
    console.log("Creating table with query: ", query);
  
    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error creating table');
      }
      res.status(201).send('Table created successfully');
    });
  });
  
  app.post("/addexam/addquestions", (req, res) => {
    const { examId, questions, timeToComplete, answers } = req.body;
  
    // Build the insert query dynamically based on the number of questions
    const tableName = `Questions_for_examId_${examId}`;
    const values = questions.map((question, index) => [examId, question, timeToComplete[index], index + 1, answers[index]]);
  
    const query = `INSERT INTO ${tableName} (examId, question, timetocomplete, ansid, answer) VALUES ?`;
  
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error adding questions');
      }
      res.status(201).send('Questions added successfully');
    });
  });
  
  
  
  

app.listen(8800,()=>{
    console.log("server is running on port 8800 ")
})