const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
var fs = require("fs");

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];
// let PURCHASEDCOURSES = [];

let admins = [];
let users = [];
let courses = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var payload = req.body;
  var secretKey = "admin123";
  let time = {expiresIn : '1h'};
  let token = jwt.sign(payload, secretKey, time);
  fs.readFile("admins.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    todos.push(payload);
    fs.writeFile("admins.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(200).send({ message: 'Admin created successfully', token: token });
    });
  });
});

app.post('/admin/login', (req, res) => {
    // logic to log in admin
    let { username, password } = req.headers;
    fs.readFile("admins.json", "utf8", (err, data) => {
      if (err) throw err;
      const admins = JSON.parse(data);
      for (var j = 0; j < admins.length; j++) {
        if (username == admins[j].username && password == admins[j].password) {
          var payload = {username};
          const secretKey = "admin123";
          let time = {expiresIn : '1h'};
          var token = jwt.sign(payload,secretKey,time);
          return res.status(200).send({ message: 'Logged in successfully', token: token });
        }
      }
      res.status(401).send("invalid username or password");
    });
})
  

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'admin123', (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send('Authorization header not found');
  }
}

let courseId = 0;

app.post('/admin/courses', verifyToken, (req, res) => {
    // logic to create a course
    var {title, description, price, imageLink, published} = req.body;
    fs.readFile("courses.json", "utf8", (err, data) => {
      if (err) throw err;
      const courses = JSON.parse(data);
      const courseExists = courses.some(course => course.title === title);
      if (courseExists) {
        res.send("Course already exists");
      } else {
        const courseId = courses.length + 1;
        var course = {courseId, title, description, price, imageLink, published};
        courses.push(course);
        fs.writeFile("courses.json", JSON.stringify(courses), (err) =>{
          if (err) throw err;
          res.status(200).send({ message: 'Course created successfully', courseId: courseId });
        });
      }
    });
  })
  

app.put('/admin/courses/:courseId',verifyToken, (req, res) => {
  // logic to edit a course
  var courseId = req.params.courseId;
  var updatedCourse = req.body;
  fs.readFile("courses.json", "utf8", (err,data) => {
    if (err) throw err;
    var courses = JSON.parse(data);
    let courseExists = false;
    for (let j = 0; j < courses.length; j++) {
        if (courses[j].courseId === courseId) {
          courses[j] = updatedCourse;
          courseExists = true;
          break;
        }
      }
      if(courseExists){
        fs.writeFile("courses.json", JSON.stringify(courses, null, 2), (err) => {
            if (err) throw err;
            return res.status(200).send({ message: 'Course updated successfully' });
          });
      }else{
        res.status(404).send("no courseId exists");
      }
  })
});

app.get('/admin/courses',verifyToken, (req, res) => {
  // logic to get all courses
  fs.readFile("courses.json", "utf8", (err,data) =>{
    if (err) throw err;
    var courses = JSON.parse(data);
    res.status(200).send(courses);
  })
});

function verifyToken1(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'user123', (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send('Authorization header not found');
  }
}

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var payload = req.body;
  var secretKey = "user123";
  let time = {expiresIn : '1h'};
  let token = jwt.sign(payload, secretKey, time);
  fs.readFile("users.json", "utf8", (err,data) => {
    if (err) throw err;
    var users = JSON.parse(data);
    users.push(payload);
    fs.writeFile("users.json", JSON.stringify(users), (err) =>{
        if (err) throw err;
        res.status(200).send({ message: 'User created successfully', token: token });
    })
  })
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let { username, password } = req.headers;
  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) throw err;
    var users = JSON.parse(data);
    for (var j=0;j<users.length;j++){
        if (username == users[i].username && password == users[j].password){
            var payload = {username};
            const secretKey = "user123";
            let time = {expiresIn : '1h'};
            var token = jwt.sign(payload,secretKey,time);
            return res.status(200).send({ message: 'Logged in successfully', token: token });
        }
    }
    res.status(401).send("invalid username or password");
  });
});

app.get('/users/courses',verifyToken1, (req, res) => {
  // logic to list all courses
  fs.readFile("courses.json", "utf8", (err,data) =>{
    if (err) throw err;
    var courses = JSON.parse(data);
    res.status(200).send(courses);
  });
});

app.post('/users/courses/:courseId',verifyToken1, (req, res) => {
  // logic to purchase a course
  var courseId = req.params.courseId;
  fs.readFile("courses.json", "utf8", (err,data) =>{
    if (err) throw err;
    var courses = JSON.parse(data);
    for(var j =0;j<courses.lenght;j++){
        if(courseid == courses[j].courseId){
            fs.writeFile("purchase.json" , JSON.stringify(courses[j]), (err) => {
                if (err) throw err;
                res.status(200).send({ message: 'Course purchased successfully' })
            })
        }
    }
  });
});

app.get('/users/purchasedCourses',verifyToken1, (req, res) => {
  // logic to view purchased courses
  fs.readFile("purchase.json", "utf-8", (err,data) =>{
    if (err) throw err;
    var purchasedCourses = JSON.parse(data);
    res.status(200).send(purchasedCourses);
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});