const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');
const moment = require("moment");
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const xlsx =require('xlsx')
const app = express();
const crypto = require("crypto");

// other imports

// const port = 3001;
app.use(cors());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Sequelize,DataTypes} = require('sequelize');
const JWT_SECRET = "Hjkl2345Olkj0987Ooiuyhjnb0987Nbvcty12fgh675redf23";
const dotenv = require('dotenv');
require ('dotenv').config()

// Database configuration
const pool = new Pool({
  user: "postgres",
  host: "34.71.87.187",
  password: "India@5555",
  database: "studentinfo",

  port: 5432,
});

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/logos', express.static('logos'));

// get a list of student
app.get('/passion-api/ideation', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM student_ideation');
    res.json(result.rows);
  } finally {
    client.release();
  }
});

// POST API endpoint
app.post('/passion-api/add/ideation', async (req, res) => {
  try {
    const {
      student_name,
      student_class,
      student_roll_number,
      student_phone_no,
      email_id,
      student_college,
      description,
      problem_statement,
      solution,
      technology_inract,
      github_link,
      power_point_document,
      da_te_submited = moment().format('YYYY-MM-DD'),
      discipline,
      city,
      s_state,
      country,
      interested_in_startup,
      membervaliddate
    } = req.body;

    const daysDifference = Math.floor((new Date(membervaliddate) - new Date(da_te_submited)) / (1000 * 60 * 60 * 24));

    const flag = daysDifference > 0 ? false : true;
    const interested_in_membership = daysDifference > 0 ? false : true;
    const query = `
          INSERT INTO student_ideation (
              student_name,
              student_class,
              student_roll_number,
              student_phone_no,
              email_id,
              student_college,
              description,
              problem_statement,
              solution,
              technology_inract,
              github_link,
              power_point_document,
              da_te_submited,
              discipline,
              city,
              s_state,
              country,
              interested_in_membership,
              interested_in_startup,
              membervaliddate,
              flag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`;

    const values = [
      student_name,
      student_class,
      student_roll_number,
      student_phone_no,
      email_id,
      student_college,
      description,
      problem_statement,
      solution,
      technology_inract,
      github_link,
      power_point_document,
      da_te_submited,
      discipline,
      city,
      s_state,
      country,
      interested_in_membership,
      interested_in_startup,
      membervaliddate,
      flag
    ];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Data inserted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Define a function to update the flag for all students
async function updateFlagsI() {
  try {
    const query = 'SELECT * FROM student_ideation';
    const { rows: students } = await pool.query(query);

    for (const student of students) {
      const currentDate = new Date();
      const membershipEndDate = new Date(student.membervaliddate);
      const daysDifference = Math.floor((membershipEndDate - currentDate) / (1000 * 60 * 60 * 24));

      const flag = membershipEndDate > currentDate;

      const updateQuery = 'UPDATE student_ideation SET flag = $1 WHERE id = $2';
      await pool.query(updateQuery, [flag, student.id]);
    }

    console.log('Flag values updated successfully');
  } catch (error) {
    console.error('Error updating flag values:', error);
  }
}

updateFlagsI();

setInterval(updateFlagsI, 3600000);

// PUT API endpoint
app.put('/passion-api/update/ideation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      student_name,
      student_class,
      student_roll_number,
      student_phone_no,
      email_id,
      student_college,
      description,
      problem_statement,
      solution,
      technology_inract,
      github_link,
      power_point_document,
      da_te_submited = moment().format('YYYY-MM-DD'),
      discipline,
      city,
      s_state,
      country,
      interested_in_startup,
      membervaliddate,
    } = req.body;


    const daysDifference = Math.floor((new Date(membervaliddate) - new Date(da_te_submited)) / (1000 * 60 * 60 * 24));

    const flag = daysDifference > 0 ? true : false;
    const interested_in_membership = daysDifference > 0 ? true : false;
    const query = `
      UPDATE student_ideation
      SET
        student_name = $1,
        student_class = $2,
        student_roll_number = $3,
        student_phone_no = $4,
        email_id = $5,
        student_college = $6,
        description = $7,
        problem_statement = $8,
        solution = $9,
        technology_inract = $10,
        github_link = $11,
        power_point_document = $12,
        da_te_submited=$13,
        discipline = $14,
        city = $15,
        s_state = $16,
        country = $17,
        interested_in_membership = $18,
        interested_in_startup = $19,
        membervaliddate = $20,
        flag = $21
      WHERE id = $22
      RETURNING *`;

    const values = [
      student_name,
      student_class,
      student_roll_number,
      student_phone_no,
      email_id,
      student_college,
      description,
      problem_statement,
      solution,
      technology_inract,
      github_link,
      power_point_document,
      da_te_submited,
      discipline,
      city,
      s_state,
      country,
      interested_in_membership,
      interested_in_startup,
      membervaliddate,
      flag,
      id
    ];

    // Execute the query
    const result = await pool.query(query, values);

    // Check if any row was updated
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No record found for the provided ID.' });
    }

    res.status(200).json({ message: 'Data updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// delete Endpoint

app.delete('/passion-api/delete/ideation/:id', async (req, res) => {
  const studentId = req.params.id;

  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM student_ideation WHERE id = $1 RETURNING *', [studentId]);
    if (result.rows.length === 0) {
      console.log('Student not found');
      res.status(404).json({ message: 'Student not found' });
    } else {
      console.log(`Student Id Is :${studentId}`);
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

app.get('/testt', (req, res) => {
  res.send('Hello Worlddd!')
})


//  get idias of students id wise
app.get('/passion-api/get/ideation/:id', async (req, res) => {
  const studentId = req.params.id;

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM student_ideation WHERE id = $1', [studentId]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } finally {
    client.release();
  }
});

// GET API endpoint for retrieving ideation data by flag and total count
app.get('/passion-api/ideation/flag/:flag', async (req, res) => {
  const flag = req.params.flag;

  try {
    const query = 'SELECT * FROM student_ideation WHERE flag = $1';
    const countQuery = 'SELECT COUNT(*) FROM student_ideation WHERE flag = $1';
    const values = [flag];

    const { rows } = await pool.query(query, values);
    const { rows: countRows } = await pool.query(countQuery, values);

    if (rows.length === 0) {
      res.status(404).json({ message: `No ideation data found with flag: ${flag}` });
    } else {
      const totalCount = countRows[0].count;
      res.status(200).json({ data: rows, totalCount });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create a new student reference
app.post('/passion-api/post/studentsrefrence', async (req, res) => {
  try {
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone } = req.body;
    const result = await pool.query('INSERT INTO student_refrence_table (name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all students
app.get('/passion-api/studentsrefrence', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM student_refrence_table');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/get/studentsrefrence/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM student_refrence_table WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific student by ID
app.put('/passion-api/put/studentsrefrence/:ids', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone } = req.body;

    const result = await pool.query('UPDATE student_refrence_table SET name = $1, srnumber = $2, referencename = $3, college = $4, discipline = $5, cla_ss = $6, rollnumber = $7, referenceemail = $8, referencephone = $9 WHERE id = $10 RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/delete/studentsrefrence/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM student_refrence_table WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ///////////////////////////////
app.get('/passion-api/research', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM research_table');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});


// // GET endpoint to fetch research by research_id
app.get('/passion-api/get/research/:id', async (req, res) => {
  try {
    const researchId = req.params.id;
    const result = await pool.query('SELECT * FROM research_table WHERE id = $1', [researchId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Research entry not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST API endpoint for inserting data into research_table
app.post('/passion-api/add/research', async (req, res) => {
  try {
    const {
      name,
      designation,
      organization,
      phone_no,
      email,
      discipline,
      research_topic,
      research_category,
      sub_research_category,
      methodology,
      abstract,
      expected_outcome,
      file_upload,
      city,
      state,
      country,
      interested_in_startup,
      validupto_date
    } = req.body;

    const submit_date = new Date().toISOString();
    const daysDifference = Math.floor((new Date(validupto_date) - new Date(submit_date)) / (1000 * 60 * 60 * 24));
    const flag = daysDifference > 0 ? true : false;
    const interested_membership = flag ? true : false;

    const query = `
      INSERT INTO research_table (
        name,
        designation,
        organization,
        phone_no,
        email,
        discipline,
        research_topic,
        research_category,
        sub_research_category,
        methodology,
        abstract,
        expected_outcome,
        file_upload,
        submit_date,
        city,
        state,
        country,
        validupto_date,
        interested_membership,
        interested_in_startup,
        flag
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`;

    const values = [
      name,
      designation,
      organization,
      phone_no,
      email,
      discipline,
      research_topic,
      research_category,
      sub_research_category,
      methodology,
      abstract,
      expected_outcome,
      file_upload,
      submit_date,
      city,
      state,
      country,
      validupto_date,
      interested_membership,
      interested_in_startup,
      flag
    ];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Data inserted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


/// PUT API endpoint for updating data in research_table
app.put('/passion-api/update/research/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      designation,
      organization,
      phone_no,
      email,
      discipline,
      research_topic,
      research_category,
      sub_research_category,
      methodology,
      abstract,
      expected_outcome,
      file_upload,
      city,
      state,
      country,
      interested_in_startup,
      validupto_date
    } = req.body;

    const submit_date = new Date().toISOString();
    const daysDifference = Math.floor((new Date(validupto_date) - new Date(submit_date)) / (1000 * 60 * 60 * 24));
    const flag = daysDifference > 0 ? true : false;

    const interested_membership = flag ? true : false;

    const query = `
      UPDATE research_table
      SET
        name = $1,
        designation = $2,
        organization = $3,
        phone_no = $4,
        email = $5,
        discipline = $6,
        research_topic = $7,
        research_category = $8,
        sub_research_category = $9,
        methodology = $10,
        abstract = $11,
        expected_outcome = $12,
        file_upload = $13,
        submit_date = $14,
        city = $15,
        state = $16,
        country = $17,
        validupto_date = $18,
        interested_membership = $19,
        interested_in_startup = $20,
        flag = $21
      WHERE id = $22
      RETURNING *`;

    const values = [
      name,
      designation,
      organization,
      phone_no,
      email,
      discipline,
      research_topic,
      research_category,
      sub_research_category,
      methodology,
      abstract,
      expected_outcome,
      file_upload,
      submit_date,
      city,
      state,
      country,
      validupto_date,
      interested_membership,
      interested_in_startup,
      flag,
      id
    ];

    // Execute the query
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No record found for the provided ID.' });
    }

    res.status(200).json({ message: 'Data updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Define a function to update the flag for all students
async function updateFlagsr() {
  try {
    const query = 'SELECT * FROM research_table';
    const { rows: students } = await pool.query(query);

    for (const student of students) {
      const currentDate = new Date();
      const membershipEndDate = new Date(student.membervaliddate);
      const daysDifference = Math.floor((membershipEndDate - currentDate) / (1000 * 60 * 60 * 24));

      const flag = membershipEndDate > currentDate;

      const updateQuery = 'UPDATE research_table SET flag = $1 WHERE id = $2';
      await pool.query(updateQuery, [flag, student.id]);
    }

    console.log('Flag values updated successfully research_table');
  } catch (error) {
    console.error('Error updating flag values:', error);
  }
}

updateFlagsr();

setInterval(updateFlagsr, 3600000);
// setInterval(updateFlagsr,1000);

app.delete('/passion-api/delete/research/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Check if research_id is undefined
    if (!id) {
      return res.status(400).json({ error: 'Invalid research ID.' });
    }

    const result = await pool.query('DELETE FROM research_table WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Research entry not found.' });
    }

    res.json({ message: 'Research entry deleted successfully.', deletedResearch: result.rows[0] });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
});




// Create a new research reference
app.post('/passion-api/researchref', async (req, res) => {
  try {
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone } = req.body;
    const result = await pool.query('INSERT INTO research_refrence_table (name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get all students
app.get('/passion-api/researchref', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM research_refrence_table');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Get a specific student by ID
app.get('/passion-api/get/researchref/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM research_refrence_table WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update a specific student by ID
app.put('/passion-api/put/researchref/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone } = req.body;

    const result = await pool.query('UPDATE research_refrence_table SET name = $1, srnumber = $2, referencename = $3, college = $4, discipline = $5, cla_ss = $6, rollnumber = $7, referenceemail = $8, referencephone = $9 WHERE id = $10 RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a specific student by ID
app.delete('/passion-api/delete/researchref/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM research_refrence_table WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all ecosystems
app.get('/passion-api/ecosystems', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ecosystems ');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Get a specific ecosystem by ID
app.get('/passion-api/ecosystems/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM ecosystems  WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).send('Ecosystem not found');
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/passion-api/ecosystems', async (req, res) => {
  try {
    const {
      ecosystem_name,
      address,
      location,
      state,
      country,
      geo_coordinates,
      contact_name,
      contact_designation,
      website_link,
      phone_number,
      email_address,
      pincode,
      sector,
      areas_of_interest
    } = req.body;

    const result = await pool.query(
      'INSERT INTO ecosystems  (ecosystem_name, address, location, state, country, geo_coordinates, contact_name, contact_designation, website_link, phone_number, email_address, pincode, sector, areas_of_interest) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
      [
        ecosystem_name,
        address,
        location,
        state,
        country,
        geo_coordinates,
        contact_name,
        contact_designation,
        website_link,
        phone_number,
        email_address,
        pincode,
        sector,
        areas_of_interest
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT endpoint for updating an existing ecosystem
app.put('/passion-api/ecosystems/id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ecosystem_name,
      address,
      location,
      state,
      country,
      geo_coordinates,
      contact_name,
      contact_designation,
      website_link,
      phone_number,
      email_address,
      pincode,
      sector,
      areas_of_interest
    } = req.body;

    const result = await pool.query(
      'UPDATE ecosystems  SET Ecosystem_Name = $2, Address = $3, Location = $4, State = $5, Country = $6, Geo_Coordinates = $7, Contact_Name = $8, Contact_Designation = $9, Website_Link = $10, Phone_Number = $11, Email_Address = $12, Pincode = $13, Sector = $14, Areas_of_Interest = $15 WHERE id = $1 RETURNING *',
      [
        id,
        ecosystem_name,
        address,
        location,
        state,
        country,
        geo_coordinates,
        contact_name,
        contact_designation,
        website_link,
        phone_number,
        email_address,
        pincode,
        sector,
        areas_of_interest
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ecosystem not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// DELETE endpoint for deleting an existing ecosystem
app.delete('/passion-api/ecosystems/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM ecosystems  WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ecosystem not found' });
    }

    res.json({ message: 'Ecosystem deleted successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const date = moment().format('YYYY-MM-DD');
// //////////////////////MEMBERADD/////////////////////////////////////////////////////////////////////////////////////
// GET API for membergroupmaster table
app.get('/passion-api/api/get/membergroupmaster', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM membergroupmaster');
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error('Error fetching membergroupmaster data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST API for membergroupmaster table
app.post('/passion-api/api/membergroupmaster', async (req, res) => {
  const { Groupcode, Groupname, Groupdescription } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO membergroupmaster (Groupcode, Groupname, Groupdescription) VALUES ($1, $2, $3) RETURNING *',
      [Groupcode, Groupname, Groupdescription]
    );
    res.status(201).json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error adding data to membergroupmaster:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/passion-api/api/get/membertypes', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Membertype');
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error('Error fetching member types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/passion-api/api/membertypes', async (req, res) => {
  const { Typecode, Typename, Typedescription } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Membertype (Typecode, Typename, Typedescription) VALUES ($1, $2, $3) RETURNING *',
      [Typecode, Typename, Typedescription]
    );
    res.status(201).json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error adding member type:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


////////////////////MASTERTABLE////////////
app.get('/passion-api/api/get/membercategories', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Membercategory');
    const categories = result.rows;
    client.release();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching member categories', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/passion-api/api/membercategories', async (req, res) => {
  const { Categorycode, Categoryname, Categorydescription } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Membercategory (Categorycode, Categoryname, Categorydescription) VALUES ($1, $2, $3) RETURNING *',
      [Categorycode, Categoryname, Categorydescription]
    );
    const newCategory = result.rows[0];
    client.release();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding member category', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET endpoint to retrieve all members from the database
app.get('/passion-api/api/members', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM members');
    const members = result.rows;
    client.release();

    res.json(members);
  } catch (error) {
    console.error('Error fetching data from database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////

app.post('/passion-api/add/members/studentids', async (req, res) => {
  try {
    const { id_student } = req.body;

    const defaultValues = {
      member_name: null,
      member_code: null,
      member_phone: null,
      member_email: null,
      member_password: null,
      photo_image: null,
      resume: null,
      id_card_proof: null,
      other_documents: null,
      geolocation: null,
      specialisation: null,
      address: null,
      city: null,
      state: null,
      pincode: null,
      technology: null
    };

    // Combine default values with the provided student ID
    const dataToInsert = { ...defaultValues, id_student };
    const currentDate = new Date();

    // Prepare SQL query
    const result = await pool.query(
      `INSERT INTO members (
        member_name, member_code, member_phone, member_email, member_password, date_of_registration, photo_image,
        resume, id_card_proof, other_documents, geolocation, specialisation, address, city, state, pincode,
        technology, id_student
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        dataToInsert.member_name, dataToInsert.member_code, dataToInsert.member_phone, dataToInsert.member_email,
        dataToInsert.member_password, currentDate, dataToInsert.photo_image, dataToInsert.resume,
        dataToInsert.id_card_proof, dataToInsert.other_documents, dataToInsert.geolocation,
        dataToInsert.specialisation, dataToInsert.address, dataToInsert.city, dataToInsert.state,
        dataToInsert.pincode, dataToInsert.technology, id_student
      ]
    );

    // Respond with the new member data
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting member data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////////////////
app.post('/passion-api/api/members/networks', async (req, res) => {
  const { member_id, member_name, member_password, member_email, class_member } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO members (member_id, member_name, member_password,member_email,class_member) VALUES ($1, $2, $3,$4,$5) RETURNING *',
      [member_id, member_name, member_password, member_email, class_member]
    );
    res.status(201).json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error adding data to membergroupmaster:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Rename files to prevent collisions
  }
});

const saltRounds = 10;
const upload = multer({ storage: storage });

app.post('/passion-api/api/add/members', upload.single('photo'), async (req, res) => {
  const {
      member_name, member_code, member_phone, member_email, member_password, date_of_expire, photo_image, resume, id_card_proof,
      other_documents, geolocation, specialisation, address, city, state, pincode, technology, roll_number, class_member, discipline,
      membergroup, membercategory, membertype, id_student, organization_name, designation_role, country, interested_research,
      interested_startup, interested_investments, interested_mentoring, membership_frequency_renewal, skills
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  try {
      const hashedPassword = await bcrypt.hash(member_password, saltRounds);
      const client = await pool.connect();
      const date_of_registration = moment().format('YYYY-MM-DD');
      const dateOfRegistration = moment(date_of_registration);
      const dateOfExpire = moment(date_of_expire);
      const membership_duration = dateOfExpire.diff(dateOfRegistration, 'days');
      const interested_membership = membership_duration > 0;
      const membership_status = interested_membership ? 'active' : 'inactive';

      const result = await client.query(
          `INSERT INTO members (
              member_name, member_code, member_phone, member_email, member_password, date_of_registration, date_of_expire,
              photo_image, resume, id_card_proof, other_documents, geolocation, specialisation, address, city, state, pincode,
              technology, roll_number, class_member, discipline, membergroup, membercategory, membertype, id_student,
              organization_name, designation_role, country, interested_membership, interested_research, interested_startup,
              interested_investments, interested_mentoring, membership_duration, membership_frequency_renewal, membership_status,
              skills
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)
          RETURNING *`,
          [
              member_name, member_code, member_phone, member_email, hashedPassword, date_of_registration, date_of_expire,
              photo_image, resume, id_card_proof, other_documents, geolocation, specialisation, address, city, state, pincode,
              technology, roll_number, class_member, discipline, membergroup, membercategory, membertype, id_student,
              organization_name, designation_role, country, interested_membership, interested_research, interested_startup,
              interested_investments, interested_mentoring, membership_duration, membership_frequency_renewal, membership_status,
              skills
          ]
      );

      const newMember = result.rows[0];
      console.log(newMember)
      client.release();

      // Send confirmation email function
      sendConfirmationEmail(newMember);

      res.status(201).json(newMember);
      console.log('Member added successfully');
  } catch (error) {
      console.error('Error adding member', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

function sendConfirmationEmail(member) {
  // Implementation for sending confirmation email
}

///////////////////////////////////////

function sendConfirmationEmail(user) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'passionit.research@gmail.com',
      pass: 'kxwv cpet unur fjax',
    },
  });

  const mailOptions = {
    from: 'passionit.research@gmail.com',
    to: user.member_email,
    subject: 'Registration Confirmation',
    text: `Dear ${user.member_name},\n\nThank you for registering. Your registration was successful. your username is ${user.member_email} and password is ${user.member_password}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

async function updateFlags() {
  try {
    const currentDate = new Date();

    const query = 'SELECT * FROM members';
    const { rows: members } = await pool.query(query);

    for (const member of members) {
      const membershipEndDate = new Date(member.date_of_expire);

      if (membershipEndDate < currentDate) {
        const updateQuery = 'UPDATE members SET flag = $1, membership_status = $2 WHERE id = $3';
        await pool.query(updateQuery, [false, 'inactive', member.id]);
      } else {
        const updateQuery = 'UPDATE members SET flag = $1, membership_status = $2 WHERE id = $3';
        await pool.query(updateQuery, [true, 'active', member.id]);
      }
    }

    console.log('Flag values updated successfully in the member table');
  } catch (error) {
    console.error('Error updating flag values:', error);
  }
}

updateFlags();

setInterval(updateFlags, 3600000);


const sequelize = new Sequelize("studentinfo", "postgres", "India@5555", {
  host: "34.71.87.187",
  dialect: "postgres",
});

const members = sequelize.define(
  "members",
  {
    member_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    member_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "members", // Use the existing table name
    timestamps: false, // Disable timestamps if they are not present in the existing table
  }
);

////////////////login/////////////////
app.post('/passion-api/api/login', async (req, res) => {
  const { member_email, member_password } = req.body;

  try {
    // Query the user from the database
    const userQuery = 'SELECT * FROM public.members WHERE member_email = $1';
    const userResult = await pool.query(userQuery, [member_email]);

    if (userResult.rows.length === 0) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    const member = userResult.rows[0];

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(member_password, member.member_password);
    if (!validPassword) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }
    
    // Generate a JWT token with user role
    const token = jwt.sign(
      {
      
        email: member.meber_email,
        isAdmin: member.isadmin // Include isAdmin in the JWT payload
      },
      'secretKey',
      { expiresIn: '1h' }
    );

    res.send({ token, isAdmin: member.isadmin,MemberId:member.id }); // Send isAdmin status in response
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send({ message: 'An error occurred during login' });
  }
});

// get id wise user
app.get('/passion-api/get/api/members/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM members WHERE id = $1', [id]);

    const member = result.rows[0];

    if (member) {
      res.status(200).json(member);
    } else {
      res.status(404).json({ error: 'Member not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error fetching member data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to get user by ID
app.get('/passion-api/api/member_id/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM members WHERE member_id = $1', [id]);

    const member = result.rows;

    if (member) {
      res.status(200).json(member);
    } else {
      res.status(404).json({ error: 'Member not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error fetching member data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update endpoint
app.put('/passion-api/api/update/member/:id', async (req, res) => {
  const memberId = req.params.id;
  const {
    member_name,
    member_code,
    member_phone,
    member_email,
    member_password,
    photo_image,
    resume,
    id_card_proof,
    other_documents,
    geolocation,
    specialisation,
    address,
    city,
    state,
    pincode,
    technology,
    roll_number,
    class_member,
    discipline,
    membergroup,
    membercategory,
    membertype,
    id_student,
  } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      `UPDATE members
      SET 
        member_name = $1,
        member_code = $2,
        member_phone = $3,
        member_email = $4,
        member_password = $5,
        photo_image = $6,
        resume = $7,
        id_card_proof = $8,
        other_documents = $9,
        geolocation = $10,
        specialisation = $11,
        address = $12,
        city = $13,
        state = $14,
        pincode = $15,
        technology = $16,
        roll_number = $17,
        class_member = $18,
        discipline = $19,
        membergroup = $20,
        membercategory = $21,
        membertype = $22,
        id_student = $23
      WHERE id = $24
      RETURNING *`,
      [
        member_name,
        member_code,
        member_phone,
        member_email,
        member_password,
        photo_image,
        resume,
        id_card_proof,
        other_documents,
        geolocation,
        specialisation,
        address,
        city,
        state,
        pincode,
        technology,
        roll_number,
        class_member,
        discipline,
        membergroup,
        membercategory,
        membertype,
        id_student,
        memberId,
      ]
    );

    const updatedMember = result.rows[0];
    client.release();

    sendUpdateEmail(updatedMember);
    res.status(200).json(updatedMember);
    console.log('Member updated successfully');
  } catch (error) {
    console.error('Error updating member', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function sendUpdateEmail(user) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sakshikadam1892001@gmail.com',
      pass: 'hifg apya upde svpk',
    },
  });

  const mailOptions = {
    from: 'sakshikadam1892001@gmail.com',
    to: user.member_email,
    subject: 'Update Confirmation',
    text: `Dear ${user.member_name},\n\nYour registration details have been updated successfully. Here is your updated information:\n\nMember Name: ${user.member_name}\nMember Email: ${user.member_email}\n and Your Password is ${user.member_password} .`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// delete endpoint
app.delete('/passion-api/api/delete/members/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);

    const deletedMember = result.rows[0];

    if (deletedMember) {
      res.status(200).json({ message: 'Member deleted successfully', deletedMember });
    } else {
      res.status(404).json({ error: 'Member not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error deleting member', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

///////////////////MemberShip records //////////////////////////////////////////


// GET endpoint to retrieve all membership records
app.get('/passion-api/api/membershiprecords', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM membership_record');
    const membershipRecords = result.rows;
    client.release();

    res.json(membershipRecords);
  } catch (error) {
    console.error('Error fetching membership records', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


////////////////membershiprecord///////////////
app.post('/passion-api/api/add/membershiprecord', upload.single('photo'), async (req, res) => {
  const {
    member_id,
    membership_type,
    membership_category,
    membership_duration,
    membership_frequency_renewal,
    membership_status,
  } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO membership_record (member_id, membership_type, membership_category, membership_duration, membership_frequency_renewal, membership_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        member_id,
        membership_type,
        membership_category,
        membership_duration,
        membership_frequency_renewal,
        membership_status,
      ]
    );

    const newMembershipRecord = result.rows[0];
    client.release();

    res.status(201).json(newMembershipRecord);
  } catch (error) {
    console.error('Error adding membership record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////membershiprecords////////////////
// PUT endpoint to update a membership record by member ID
app.put('/passion-api/api/update/membershiprecord/:id', async (req, res) => {
  const membership_record_id = req.params.id;
  const {
    membership_type,
    membership_category,
    membership_duration,
    membership_frequency_renewal,
    membership_status,
  } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE membership_record SET Membership_Type=$1, Membership_Category=$2, Membership_Duration=$3, Membership_Frequency_Renewal=$4, Membership_Status=$5 WHERE membership_record_id=$6 RETURNING *',
      [
        membership_type,
        membership_category,
        membership_duration,
        membership_frequency_renewal,
        membership_status,
        membership_record_id,
      ]
    );

    const updatedMembershipRecord = result.rows[0];

    if (updatedMembershipRecord) {
      res.status(200).json(updatedMembershipRecord);
    } else {
      res.status(404).json({ error: 'Membership record not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error updating membership record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


////////////////////////membershiprecord/////////////////////
// DELETE endpoint to remove a membership record by member ID
app.delete('/passion-api/api/delete/membershiprecord/:id', async (req, res) => {
  const membership_record_id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM membership_record WHERE membership_record_id = $1 RETURNING *',
      [membership_record_id]
    );

    const deletedMembershipRecord = result.rows[0];

    if (deletedMembershipRecord) {
      res.status(200).json({ message: 'Membership record deleted successfully', deletedMembershipRecord });
    } else {
      res.status(404).json({ error: 'Membership record not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error deleting membership record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/////////////////MEMBERSHIPRECORDS//////////////////////////////
// GET endpoint to retrieve a specific membership record by ID
app.get('/passion-api/api/id/membershiprecord/:id', async (req, res) => {
  const membership_record_id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM membership_record WHERE membership_record_id = $1', [membership_record_id]);

    const membershipRecord = result.rows[0];

    if (membershipRecord) {
      res.status(200).json(membershipRecord);
    } else {
      res.status(404).json({ error: 'Membership record not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error fetching membership record data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




////////////////////////INTEREST//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET API to retrieve all interested people
// app.get('/passion-api/api/get/interestedpeople', async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM interested_people_table');
//     client.release();
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error retrieving interested people:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.get('/passion-api/api/get/interestedpeople/:member_id', async (req, res) => {
  try {
    const { member_id } = req.params;  // Accessing the member_id from req.params
    const client = await pool.connect();
    
    const result = await client.query(`
     SELECT 
    o.id AS opportunity_id,
    o.opportunity_name,
    o.opportunity_description,
    o.opportunity_provider,
    o.opportunity_start_date,
    o.opportunity_end_date,
    o.opportunity_problem_statement,
    o.opportunity_expected_solution,
    o.opportunity_expected_work_zone,
    o.opportunity_expected_work_time,
    o.opportunity_work_type,
    o.opportunity_budget_available,
    o.opportunity_estimate_budget,
    o.budget_currency,
    o.opportunity_resource_volume,
    o.opportunity_status,
    o.opportunity_code,
    o.revised_volume,
    o.revised_budget,
    o.create_date,
    o.flag,
    o.email,
    o.file_upload,
    o.photos,
    o.opportunity_type_id,
    o.projectname,
    o.educationstreams,
    o.member_id,
    ipt.id AS interested_person_id,
    ipt.interested_name,
    ipt.email AS interested_person_email,
    ipt.phonenumber,
    ipt.interest_id,
    ipt.event_timestamp
FROM 
    public.opportunities o
JOIN 
    public.interested_people_table ipt
ON 
    o.id = ipt.opportunity_id
WHERE 
    o.member_id = $1
    `, [member_id]);  // Passing member_id as a parameter to the query
    
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving interested people:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/passion-api/api/get/interestedpeople', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM interested_people_table');
    const membershipRecords = result.rows;
    client.release();

    res.json(membershipRecords);
  } catch (error) {
    console.error('Error fetching membership records', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST API to add a new interested person
app.post('/passion-api/api/post/interestedpeople', async (req, res) => {
  const { interested_name, email, phonenumber, interest_id, opportunity_id, opportunity_name, member_id, member_email } = req.body;
  try {
    const client = await pool.connect();
    
    // Check if the record already exists
    const checkQuery = 'SELECT * FROM interested_people_table WHERE opportunity_id = $1 AND opportunity_name = $2 AND member_id = $3';
    const checkResult = await client.query(checkQuery, [opportunity_id, opportunity_name, member_id]);
    
    if (checkResult.rows.length > 0) {
      // Record already exists
      client.release();
      return res.status(400).json({ error: 'Duplicate entry: The combination of opportunity_id, opportunity_name, and memberid already exists.' });
    }
    
    // Insert the new record
    const insertQuery = 'INSERT INTO interested_people_table (interested_name, email, phonenumber, interest_id, opportunity_id, opportunity_name, member_id, member_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const insertResult = await client.query(insertQuery, [interested_name, email, phonenumber, interest_id, opportunity_id, opportunity_name, member_id, member_email]);
    
    client.release();
    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error adding interested person:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



/////
// GET API to fetch all interested people data for a specific memberid
app.get('/passion-api/api/interestedpeople/:interest_id', async (req, res) => {
  const { interest_id } = req.params; // Extract memberid from the request parameters
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM interested_people_table WHERE interest_id = $1', [interest_id]);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching interested people data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////interset///////////////////////
// DELETE endpoint to remove an opportunity by ID
app.delete('/passion-api/api/delete/interested/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM interested_people_table WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunity not found' });
    } else {
      const deletedOpportunity = result.rows[0];
      client.release();
      res.json(deletedOpportunity);
    }
  } catch (error) {
    console.error('Error deleting opportunity', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


////////////////////////////////
app.post('/passion-api/post/api/selection_status/result', async (req, res) => {
  const { applicant_name, phonenumber, selection_status, opportunity_name, opportunity_id, flag, memberid } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO selection_table (applicant_name,phonenumber,selection_status,opportunity_name,opportunity_id,flag,memberid ) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *', 
    [applicant_name, phonenumber, selection_status, opportunity_name, opportunity_id, flag, memberid]);
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding :', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
////////////////////////////////////////
app.get('/passion-api/api/selection_status/result/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM selection_table WHERE id = $1 AND flag = $2', [id, true]);
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/////////////////////////////////////////
app.put('/passion-api/api/selection_status/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE selection_table SET flag = $1 WHERE id = $2 RETURNING *', [false, id]);
    client.release();

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating flag:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
////////////////////////////////////////
app.get('/passion-api/get/api/selection_status/results', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM selection_table');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/passion-api/api/selection_status/result', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM selection_table WHERE flag = $1', ['true']);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// //////////////////////////////////////

app.get('/passion-api/api/memberidoppodata/intre/:id', async (req, res) => {
  const id = req.params.id.split(',').map(id => parseInt(id));

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM interested_people_table WHERE id = ANY($1)',
      [id]
    );
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error('Error fetching data details from database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ///////////////////////////////////////////////////////
// GET API to retrieve all opportunity types
app.get('/passion-api/api/get/opportunity_types', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM opportunity_types');
    client.release();
    res.status(200).json(result.rows);
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST API to add a new opportunity type
app.post('/passion-api/api/opportunity_types', async (req, res) => {
  const { opportunity_type } = req.body;
  if (!opportunity_type) {
    return res.status(400).json({ error: 'Opportunity type is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO opportunity_types (opportunity_type) VALUES ($1) RETURNING *', [opportunity_type]);
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////
app.get('/passion-api/api/optiondata', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM opportunities_with_types');
    const opportunities = result.rows;
    client.release();

    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities records', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET endpoint to retrieve all opportunities from the database
app.get('/passion-api/api/opportunity', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Opportunities');

    const opportunities = result.rows;
    client.release();

    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities records', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/passion-api/api/opportunityu', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT DISTINCT ON (opportunity_provider,opportunity_expected_work_zone) * FROM Opportunities');
    const opportunities = result.rows;
    client.release();

    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching unique opportunities records', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/passion-api/api/useropportunity/:member_id', async (req, res) => {
  const { member_id } = req.params; // Extract member_id from the request parameters

  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM interested_people_table WHERE interest_id = $1'; // Use parameterized query
    const values = [member_id]; // Use member_id as a parameter

    const result = await client.query(query, values);
    const opportunities = result.rows;
    client.release();

    console.log(opportunities); // Log results for debugging
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint to remove an opportunity by ID
app.delete('/passion-api/api/delete/opportunities/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM Opportunities WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunity not found' });
    } else {
      const deletedOpportunity = result.rows[0];
      client.release();
      res.json(deletedOpportunity);
    }
  } catch (error) {
    console.error('Error deleting opportunity', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//////////////////opportunity/////////////
// Declare new storage and upload variables
const opportunityStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Configure Multer to handle multiple fields
const opportunityUpload = multer({ storage: opportunityStorage }).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'file_upload', maxCount: 1 }
]);

app.post('/passion-api/api/opportunity', opportunityUpload, async (req, res) => {
  const {
    opportunity_type_id,
    opportunity_name,
    opportunity_description,
    opportunity_provider,
    opportunity_start_date,
    opportunity_end_date,
    opportunity_problem_statement,
    opportunity_expected_solution,
    opportunity_expected_work_zone,
    opportunity_expected_work_time,
    opportunity_work_type,
    opportunity_budget_available,
    opportunity_estimate_budget,
    budget_currency,
    opportunity_resource_volume,
    opportunity_status,
    opportunity_code,
    revised_volume,
    revised_budget,
    email,
    member_id,
    projectname,
    educationstreams
  } = req.body;

  const photo = req.files['photo'] ? req.files['photo'][0].filename : null;
  const file_upload = req.files['file_upload'] ? req.files['file_upload'][0].filename : null;

  // Log values to check if any are null or undefined
  console.log({
    opportunity_type_id,
    opportunity_name,
    opportunity_description,
    opportunity_provider,
    opportunity_start_date,
    opportunity_end_date,
    opportunity_problem_statement,
    opportunity_expected_solution,
    opportunity_expected_work_zone,
    opportunity_expected_work_time,
    opportunity_work_type,
    opportunity_budget_available,
    opportunity_estimate_budget,
    budget_currency,
    opportunity_resource_volume,
    opportunity_status,
    opportunity_code,
    revised_volume,
    revised_budget,
    email,
    member_id,
    projectname,
    educationstreams,
    photo,
    file_upload
  });

  try {
    const client = await pool.connect();
    const query = `
      INSERT INTO Opportunities (
        opportunity_type_id, opportunity_name, opportunity_description, opportunity_provider, 
        opportunity_start_date, opportunity_end_date, opportunity_problem_statement, 
        opportunity_expected_solution, opportunity_expected_work_zone, opportunity_expected_work_time, 
        opportunity_work_type, opportunity_budget_available, opportunity_estimate_budget, budget_currency, 
        opportunity_resource_volume, opportunity_status, opportunity_code, revised_volume, revised_budget, 
        create_date, email, member_id, file_upload, photos, projectname, educationstreams
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, CURRENT_DATE, 
        $20, $21, $22, $23, $24, $25
      ) RETURNING *`;

    const values = [
      opportunity_type_id, opportunity_name, opportunity_description, opportunity_provider,
      opportunity_start_date, opportunity_end_date, opportunity_problem_statement,
      opportunity_expected_solution, opportunity_expected_work_zone, opportunity_expected_work_time,
      opportunity_work_type, opportunity_budget_available, opportunity_estimate_budget, budget_currency,
      opportunity_resource_volume, opportunity_status, opportunity_code, revised_volume, revised_budget,
      email, member_id, file_upload, photo, projectname, educationstreams
    ];

    const result = await client.query(query, values);
    client.release();

    const newOpportunity = result.rows[0];
    res.status(201).json(newOpportunity);
  } catch (error) {
    console.error('Error adding opportunity', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

///////////////////////upload file///////////////////////////
app.post("/passion-api/csvupload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Helper function to convert Excel serial date to JS date
    const excelDateToJSDate = (serial) => {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
    };

    // Nodemailer setup for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
    for (const row of excelData) {
      const {
        opportunity_name,
        opportunity_description,
        opportunity_provider,
        opportunity_start_date,
        opportunity_end_date,
        opportunity_problem_statement,
        opportunity_expected_solution,
        projectname,
        email
      } = row;

      // Convert date fields if in serial format
      const formatted_start_date = typeof opportunity_start_date === 'number' ? excelDateToJSDate(opportunity_start_date) : opportunity_start_date;
      const formatted_end_date = typeof opportunity_end_date === 'number' ? excelDateToJSDate(opportunity_end_date) : opportunity_end_date;

      // Check if the opportunity already exists in the Opportunities table
      const OpportunitiesResult = await pool.query(
        `SELECT COUNT(*) AS count FROM Opportunities WHERE opportunity_name = $1 AND opportunity_description = $2 AND opportunity_provider = $3 AND opportunity_start_date = $4
        AND opportunity_end_date=$5 AND opportunity_problem_statement=$6 AND opportunity_expected_solution=$7 AND projectname=$8 AND email=$9`,
        [
          opportunity_name,
          opportunity_description,
          opportunity_provider,
          formatted_start_date,
          formatted_end_date,
          opportunity_problem_statement,
          opportunity_expected_solution,
          projectname,
          email
        ]
      );

      const OpportunitiesCount = parseInt(OpportunitiesResult.rows[0].count);
      if (OpportunitiesCount === 0) {
        // Insert into Opportunities table
        await pool.query(
          `INSERT INTO Opportunities (opportunity_name, opportunity_description, opportunity_provider, opportunity_start_date, opportunity_end_date, opportunity_problem_statement, opportunity_expected_solution, projectname, email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            opportunity_name,
            opportunity_description,
            opportunity_provider,
            formatted_start_date,
            formatted_end_date,
            opportunity_problem_statement,
            opportunity_expected_solution,
            projectname,
            email
          ]
        );
      }

      // Split emails by comma, trim, and process each
      const emails = email.split(",").map(e => e.trim());
      for (const singleEmail of emails) {
        // Check if the email already exists in the Member table
        const memberResult = await pool.query(`SELECT COUNT(*) AS count FROM members WHERE member_email = $1`, [singleEmail]);
        if (parseInt(memberResult.rows[0].count) === 0) {
          // Generate a random password
          const randomPassword = crypto.randomBytes(8).toString("hex");
    
          // Hash the password
          const hashedPassword = await bcrypt.hash(randomPassword, 10); // 10 is the salt rounds
          await pool.query(`INSERT INTO members (member_email, member_password) VALUES ($1, $2)`, [singleEmail, hashedPassword]);
          // Send email with credentials
          const mailOptions = {
            from: "passionit.research@gmail.com",
            to: singleEmail,
            subject: "Your New Account Credentials",
            text: `Dear User,\n\nYour account has been created successfully.\n\nUsername: ${singleEmail}\nPassword: ${randomPassword}\n\nPlease use the following link to complete your registration:\n\nLINK:${process.env.CLIENT_URL}\n\nAfter logging in, please remember to change your password and Update Your Information\n\nBest Regards,\nYour Team`
          };          
          await transporter.sendMail(mailOptions);
        } }  }
      
    res.status(200).json({ message: "Data inserted and emails sent successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Function to update opportunity statuses
const updateOpportunityStatus = async () => {
  try {
    const client = await pool.connect();
    const currentDate = new Date().toISOString().split('T')[0];
    const query = {
      text: 'UPDATE Opportunities SET opportunity_status = $1 WHERE opportunity_end_date < $2',
      values: ['inactive', currentDate],
    };
    const result = await client.query(query);
    client.release();
    console.log(`Updated ${result.rowCount} opportunities`);
  } catch (error) {
    console.error('Error updating opportunity status:', error);
  }
};

updateOpportunityStatus();

setInterval(updateOpportunityStatus, 3600000);


const currentDate = new Date(); // Create a Date object representing the current date
app.get('/passion-api/api/opportunity/date-gap/:gap', async (req, res) => {
  const { gap } = req.params;

  try {
    const endDate = new Date(currentDate.getTime() + (gap * 24 * 60 * 60 * 1000));
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM Opportunities WHERE opportunity_start_date >= $1 AND opportunity_start_date <= $2`,
      [currentDate.toISOString(), endDate.toISOString()]
    );
    client.release();
    const Gaps = result.rows;
    res.status(200).json(Gaps);
  } catch (error) {
    console.error('Error fetching opportunities based on date gap', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///
app.get('/passion-api/api/opportunity/provider/:provider', async (req, res) => {
  const { provider } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM Opportunities WHERE opportunity_provider = $1`,
      [provider]
    );
    client.release();
    const providers = result.rows;
    res.status(200).json(providers);
  } catch (error) {
    console.error('Error fetching opportunities by provider', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//////
app.get('/passion-api/api/opportunity/work-zone/:workZone', async (req, res) => {
  const { workZone } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM Opportunities WHERE opportunity_expected_work_zone = $1`,
      [workZone]
    );
    client.release();
    const zonew = result.rows;
    res.status(200).json(zonew);
  } catch (error) {
    console.error('Error fetching opportunities by work zone', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///
app.get('/passion-api/api/opportunity/work-type/:workType', async (req, res) => {
  const { workType } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM Opportunities WHERE opportunity_work_type = $1`,
      [workType]
    );
    client.release();
    const worktype = result.rows;
    res.status(200).json(worktype);
  } catch (error) {
    console.error('Error fetching opportunities by work type', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /////////////////////////////////////////
app.put('/passion-api/api/update/opportunity/:id', async (req, res) => {
  const id = req.params.id;

  const {
    // opportunity_type,
    opportunity_name,
    opportunity_description,
    opportunity_provider,
    opportunity_start_date,
    opportunity_end_date,
    opportunity_problem_statement,
    opportunity_expected_solution,
    opportunity_expected_work_zone,
    opportunity_expected_work_time,
    opportunity_work_type,
    opportunity_budget_available,
    opportunity_estimate_budget,
    budget_currency,
    opportunity_resource_volume,
    opportunity_status,
    projectname,
    educationstreams
  } = req.body;

  // Convert empty date strings to null
  const start_date = opportunity_start_date || null;
  const end_date = opportunity_end_date || null;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Opportunities SET  opportunity_name = $1, opportunity_description = $2, opportunity_provider = $3, opportunity_start_date = $4, opportunity_end_date = $5, opportunity_problem_statement = $6, opportunity_expected_solution = $7, opportunity_expected_work_zone = $8, opportunity_expected_work_time = $9, opportunity_work_type = $10, opportunity_budget_available = $11, opportunity_estimate_budget = $12, budget_currency = $13, opportunity_resource_volume = $14, opportunity_status = $15 , projectname=$16 , educationstreams=$17 WHERE id = $18 RETURNING *',
      [
        // opportunity_type,
        opportunity_name,
        opportunity_description,
        opportunity_provider,
        start_date,
        end_date,
        opportunity_problem_statement,
        opportunity_expected_solution,
        opportunity_expected_work_zone,
        opportunity_expected_work_time,
        opportunity_work_type,
        opportunity_budget_available,
        opportunity_estimate_budget,
        budget_currency,
        opportunity_resource_volume,
        opportunity_status,
        projectname,
        educationstreams,
        id
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunity not found' });
    } else {
      const updatedOpportunity = result.rows[0];
      client.release();
      res.json(updatedOpportunity);
    }
  } catch (error) {
    console.error('Error updating opportunity', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET endpoint to retrieve details of an opportunity by ID
app.get('/passion-api/api/opportunitys/:opportunity_type_id', async (req, res) => {
  try {
    const opportunityTypeId = parseInt(req.params.opportunity_type_id);

    const client = await pool.connect();
    const query = {
      text: 'SELECT * FROM opportunities WHERE opportunity_type_id = $1',
      values: [opportunityTypeId],
    };
    const result = await client.query(query);

    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunities not found for the given opportunity type ID' });
    } else {
      const opportunityDetails = result.rows;
      res.json(opportunityDetails);
    }
  } catch (error) {
    console.error('Error fetching opportunities by opportunity_type_id from database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// GET endpoint to retrieve details of an opportunity by ID
app.get('/passion-api/api/get/opportunity/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Opportunities WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunity not found' });
    } else {
      const opportunityDetails = result.rows[0];
      client.release();
      res.json(opportunityDetails);
    }
  } catch (error) {
    console.error('Error fetching opportunity details from database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET endpoint to retrieve details of an opportunity by ID
app.get('/passion-api/api/getOpportunityByUserid/:member_id', async (req, res) => {
  const member_id = req.params.member_id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Opportunities WHERE member_id = $1', [member_id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunity not found' });
    } else {
      const opportunityDetails = result.rows[0];
      client.release();
      res.json(opportunityDetails);
    }
  } catch (error) {
    console.error('Error fetching opportunity details from database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/passion-api/send-email', async (req, res) => {
  const { selectedOpportunities, recipientEmails } = req.body;
  if (!Array.isArray(recipientEmails)) {
    return res.status(400).json({ error: 'recipientEmails must be an array' });
  }
  if (recipientEmails.length === 0) {
    return res.status(400).json({ error: 'recipientEmails array is empty' });
  }
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'passionit.research@gmail.com',
      pass: 'kxwv cpet unur fjax',
    }
  });

  try {
    let text = 'Dear Member,\n\n';
    selectedOpportunities.forEach((opportunity, index) => {
      text += `${index + 1}. ${opportunity.name}\n`;
    });
    text += '\nFor details, please log on to our site.\n\nThanks,\nThe pcombinator and passionit team';

    let mailOptions = {
      from: 'passionit.research@gmail.com',
      to: recipientEmails.join(','),
      subject: 'Opportunity',
      text: text
    };

    // Send email for all selected opportunities
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Error sending emails' });
  }
});

///////////////////////////////alloctionoppo////////////////////////////////////////////////////////////////
// GET endpoint to retrieve all Opportunity_Allocation records
app.get('/passion-api/api/get/opportunityallocation', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Opportunity_Allocation');
    const opportunityAllocations = result.rows;
    client.release();
    res.json(opportunityAllocations);
  } catch (error) {
    console.error('Error fetching data from database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to insert data into Opportunity_Allocation

app.post('/passion-api/api/post/opportunityallocation', async (req, res) => {
  const {
    opportunity_id,
    opportunity_allocated_by,
    opportunity_allocated_to,
    opportunity_for,
    opportunity_allocation_date,
    opportunity_allocation_status,
    opportunity_allocation_remark,
    opportunity_details_doc,
    memberrole
  } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Opportunity_Allocation (opportunity_id, opportunity_allocated_by, opportunity_allocated_to, opportunity_for, opportunity_allocation_date, opportunity_allocation_status, opportunity_allocation_remark, opportunity_details_doc,memberrole) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *',
      [
        opportunity_id,
        opportunity_allocated_by,
        opportunity_allocated_to,
        opportunity_for,
        opportunity_allocation_date,
        opportunity_allocation_status,
        opportunity_allocation_remark,
        opportunity_details_doc,
        memberrole
      ]
    );
    const newOpportunityAllocation = result.rows[0];
    client.release();
    res.status(201).json(newOpportunityAllocation);
  } catch (error) {
    console.error('Error adding Opportunity Allocation', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ///////ALLOCATIONUPDATE////////////////
app.put('/passion-api/api/update/opportunityallocation/:id', async (req, res) => {
  const id = req.params.id;
  const {
    opportunity_allocated_by,
    opportunity_allocated_to,
    opportunity_for,
    opportunity_allocation_date,
    opportunity_allocation_status,
    opportunity_allocation_remark,
    opportunity_details_doc,
    memberrole
  } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Opportunity_Allocation SET opportunity_allocated_by = $1, opportunity_allocated_to = $2, opportunity_for = $3, opportunity_allocation_date = $4, opportunity_allocation_status = $5, opportunity_allocation_remark = $6, opportunity_details_doc = $7, memberrole = $8 WHERE id = $9 RETURNING *',
      [
        opportunity_allocated_by,
        opportunity_allocated_to,
        opportunity_for,
        opportunity_allocation_date,
        opportunity_allocation_status,
        opportunity_allocation_remark,
        opportunity_details_doc,
        memberrole,
        id
      ]
    );
    const updatedOpportunityAllocation = result.rows[0];
    client.release();

    if (updatedOpportunityAllocation) {
      res.json(updatedOpportunityAllocation);
    } else {
      res.status(404).json({ error: 'Opportunity Allocation not found' });
    }
  } catch (error) {
    console.error('Error updating Opportunity Allocation', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

///////
app.delete('/passion-api/api/opportunityallocation/:id', async (req, res) => {
  const id = req.params.id;

  try {
    console.log('Attempting to delete opportunity allocation with ID:', id);

    const client = await pool.connect();
    const result = await client.query('DELETE FROM Opportunity_Allocation  WHERE id = $1 RETURNING *', [id]);

    const deletedOpportunityAllocation = result.rows[0];
    client.release();

    if (deletedOpportunityAllocation) {
      res.json(deletedOpportunityAllocation);
    } else {
      console.log('Opportunity Allocation not found');
      res.status(404).json({ error: 'Opportunity Allocation not found' });
    }
  } catch (error) {
    console.error('Error deleting Opportunity Allocation', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



////////////////ALLOCATIONUPDATE/////////////////////////
app.get('/passion-api/api/opportunity_allocation/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Opportunity_Allocation WHERE id = $1', [id]);

    const opportunityAllocation = result.rows[0];
    client.release();

    if (opportunityAllocation) {
      res.json(opportunityAllocation);
    } else {
      res.status(404).json({ error: 'Opportunity Allocation not found' });
    }
  } catch (error) {
    console.error('Error fetching Opportunity Allocation by ID', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// //////////////////////////INTERVIEW/////////////////////////////////////////////////
app.get('/passion-api/api/get/memberinterviewrecords', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM Member_Interview_Records ');

    const interviewRecords = result.rows;
    client.release();
    res.status(200).json(interviewRecords);
  } catch (error) {
    console.error('Error retrieving interview records', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//////////////////INTERVIEW/////////////////////
app.post('/passion-api/api/post/memberinterviewrecords', async (req, res) => {
  const {
    interviewed_by,
    interview_assessment,
    interview_score,
    interview_video_link,
    opportunity_id
  } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO Member_Interview_Records  (Interviewed_By, Interview_Assessment, Interview_Score, Interview_Video_Link,opportunity_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        interviewed_by,
        interview_assessment,
        interview_score,
        interview_video_link,
        opportunity_id
      ]
    );

    const newInterviewRecord = result.rows[0];
    client.release();
    res.status(201).json(newInterviewRecord);
  } catch (error) {
    console.error('Error adding interview record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/passion-api/get/api/member_interview_records/:interviewId', async (req, res) => {
  const interviewId = req.params.interviewId;
  const {
    Interviewed_By,
    Interview_Assessment,
    Interview_Score,
    Interview_Video_Link,
    id
  } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE Member_Interview_Records  SET Interviewed_By = $1, Interview_Assessment = $2, Interview_Score = $3, Interview_Video_Link = $4, id = $5 WHERE Interview_id = $6 RETURNING *',
      [
        Interviewed_By,
        Interview_Assessment,
        Interview_Score,
        Interview_Video_Link,
        id,
        interviewId
      ]
    );

    const updatedInterviewRecord = result.rows[0];
    client.release();

    if (!updatedInterviewRecord) {
      return res.status(404).json({ error: 'Interview record not found' });
    }

    res.json(updatedInterviewRecord);
  } catch (error) {
    console.error('Error updating interview record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/passion-api/api/memberinterviewrecords/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM Member_Interview_Records WHERE id = $1 RETURNING *',
      [id]
    );

    const deletedInterviewRecord = result.rows[0];
    client.release();

    if (!deletedInterviewRecord) {
      return res.status(404).json({ error: 'Interview record not found' });
    }

    res.json({ message: 'Interview record deleted successfully', deletedInterviewRecord });
  } catch (error) {
    console.error('Error deleting interview record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/passion-api/api/member_interview_records/:interviewId', async (req, res) => {
  const interviewId = req.params.interviewId;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM Member_Interview_Records  WHERE Interview_id = $1',
      [interviewId]
    );

    const interviewRecord = result.rows[0];
    client.release();

    if (!interviewRecord) {
      return res.status(404).json({ error: 'Interview record not found' });
    }

    res.json(interviewRecord);
  } catch (error) {
    console.error('Error fetching interview record', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// /////////////////////////////////////////////
// Create a new member reference
app.post('/passion-api/post/api/memberrefrence', async (req, res) => {
  try {
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone, membre_id} = req.body;
    const flag = true;
    const result = await pool.query('INSERT INTO refre_members (name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone,membre_id,flag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11) RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone, membre_id, flag]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all students
app.get('/passion-api/api/get/memberrefrence', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM refre_members');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/memberrefrence/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM refre_members WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/////////////////////////
app.get('/passion-api/api/memberreference/m/:mid', async (req, res) => {
  try {
    const { mid } = req.params;
    const result = await pool.query('SELECT * FROM refre_members WHERE membre_id = $1 AND flag = $2', [mid, true]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'No students found with the provided ID' });
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Update member reference flag
app.put('/passion-api/api/memberreference/:id/update-flag', async (req, res) => {
  try {
    const { id } = req.params;
    const { flag } = req.body;

    const result = await pool.query('UPDATE refre_members SET flag = $1 WHERE id = $2 RETURNING *', [flag, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member reference not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific student by ID
app.put('/passion-api/api/memberrefrence/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone } = req.body;

    const result = await pool.query('UPDATE refre_members SET name = $1, srnumber = $2, referencename = $3, college = $4, discipline = $5, cla_ss = $6, rollnumber = $7, referenceemail = $8, referencephone = $9 WHERE id = $10 RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/api/delete/memberrefrence/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM refre_members WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///////////////////////////////////////////////

app.post("/passion-api/reference/csvupload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Convert Excel serial number to date
    const excelDateToJSDate = (serial) => {
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
    };

    // Process excelData to remove duplicates
    for (const row of excelData) {
      const {
        name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone
      } = row;

      // Convert date fields if they are in serial format
      // const formatted_start_date = typeof opportunity_start_date === 'number' ? excelDateToJSDate(opportunity_start_date) : opportunity_start_date;
      // const formatted_end_date = typeof opportunity_end_date === 'number' ? excelDateToJSDate(opportunity_end_date) : opportunity_end_date;

      // Check if the entry already exists in the Opportunities table
      const refremembersResult = await pool.query(
        `SELECT COUNT(*) AS count FROM refre_members WHERE name = $1 AND srnumber = $2 AND referencename = $3 AND college = $4
        AND discipline=$5 AND cla_ss=$6 AND rollnumber=$7 AND referenceemail=$8 AND referencephone=$9`,
        [
          name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone
        ]
      );
      const refrememberCount = parseInt(refremembersResult.rows[0].count);
      if (refrememberCount === 0) {
        // Insert into Opportunities table
        await pool.query(
          `INSERT INTO refre_members (name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone
          ]
        );
      }
    }

    res.status(200).json({ message: "File processed and data inserted successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file", error: error.message });
  }
});

// ///////////////////////////////
app.post('/passion-api/api/resourcemaster', async (req, res) => {
  try {
    const { resourcename, designation, status, empcode, fromdate, todate } = req.body;
    const result = await pool.query('INSERT INTO resourcemaster (resourcename, designation, status,empcode,fromdate,todate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [resourcename, designation, status, empcode, fromdate, todate]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all students

app.get('/passion-api/api/get/resourcemaster', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resourcemaster');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/resourcemaster/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM refre_members WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific student by ID
app.put('/passion-api/api/resourcemaster/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone } = req.body;

    const result = await pool.query('UPDATE refre_members SET name = $1, srnumber = $2, referencename = $3, college = $4, discipline = $5, cla_ss = $6, rollnumber = $7, referenceemail = $8, referencephone = $9 WHERE id = $10 RETURNING *',
      [name, srnumber, referencename, college, discipline, cla_ss, rollnumber, referenceemail, referencephone, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/api/resourcemaster/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM refre_members WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


////////////////////////////////////////////////
app.post('/passion-api/send-emailfour/ids', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "passionit.research@gmail.com",
        pass: "kxwv cpet unur fjax",
      }
    });
    const { email1, email2, email3, email4 } = req.body;
    const mailOptions = {
      from: 'passionit.research@gmail.com',
      to: [email1, email2, email3, email4].filter(email => email !== ''),
      subject: 'Test Email',
      text: 'This is a test email sent from Node.js.'
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
    console.log("Email sent successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/passion-api/send-email/single/usr/data', async (req, res) => {
  const { recipientEmail } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "passionit.research@gmail.co",
        pass: "kxwv cpet unur fjax",
      },
    });

    let mailOptions = {
      from: "passionit.research@gmail.co",
      to: recipientEmail,
      subject: "check",
      text: "testing",
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/passion-api/post/api/opportunity_incentive', async (req, res) => {
  try {
    const { opportunity_id, designation, incentivepercentage, categoryid } = req.body;
    const result = await pool.query('INSERT INTO opportunity_incentive (opportunity_id, designation, incentivepercentage,categoryid) VALUES ($1, $2, $3,$4) RETURNING *',
      [opportunity_id, designation, incentivepercentage, categoryid]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all students

app.get('/passion-api/get/api/opportunity_incentive', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM opportunity_incentive');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/opportunity_incentive/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM opportunity_incentive WHERE incentive_id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific student by ID

app.put('/passion-api/api/opportunity_incentive/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { opportunity_id, designation, incentivepercentage } = req.body;

    const result = await pool.query('UPDATE opportunity_incentive SET opportunity_id = $1, designation = $2, incentivepercentage = $3 WHERE incentive_id = $4 RETURNING *',
      [opportunity_id, designation, incentivepercentage, id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Opportunity incentive not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete a specific student by ID
app.delete('/passion-api/delete/api/opportunity_incentive/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM opportunity_incentive WHERE incentive_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: ' deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');

// Ensure the 'logos' directory exists when the server starts
const logosDir = path.join(__dirname, 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, logosDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadS = multer({ storage: storage1 });

// const storage1 = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'logos');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const uploadS = multer({ storage: storage1 });

//////////////////////post add group//////////////////
app.post('/passion-api/api/create-group', uploadS.single('groupLogo'), async (req, res) => {
  const { memberid, groupcode, groupname, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue } = req.body;
  const groupLogoPath = req.file ? req.file.path : null;
  try {
    const client = await pool.connect();
    const query = `INSERT INTO group_s (memberid, groupcode, groupname, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue, grouplogo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    const values = [memberid, groupcode, groupname, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue, groupLogoPath];
    await client.query(query, values);
    client.release();
    res.status(201).json({ message: 'Group created successfully' });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all groups
app.get('/passion-api/api/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM group_s');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/group/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM group_s WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////////////////////////////////
app.get('/passion-api/api/group/mid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM group_s WHERE memberid = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'memberid not found' });
    } else {
      res.json(result.rows[0]);
      console.log(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'memberid Server Error' });
  }
});

// Update a specific student by ID
app.put('/passion-api/api/group/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { memberid, groupcode, groupname, grouplogo, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue } = req.body;
    const result = await pool.query('UPDATE group_s SET memberid=$1, groupcode=$2, groupname=$3, grouplogo=$4, groupcaption=$5, groupwebsitelink=$6, group_owner=$7, email=$8, phone=$9, transactionvalue=$10 WHERE id = $11 RETURNING *',
      [memberid, groupcode, groupname, grouplogo, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/delete/api/groups/:id', async (req, res) => {
  const groupId = req.params.id;
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM group_member WHERE group_id = $1', [groupId]);
    const result = await client.query('DELETE FROM group_s WHERE id = $1 RETURNING *', [groupId]);
    const deletedGroup = result.rows[0];
    if (deletedGroup) {
      res.status(200).json({ message: 'Group deleted successfully', deletedGroup });
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
    client.release();
  } catch (error) {
    console.error('Error deleting group', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// /////////////////////////////////////////////////////////////////////////////////////////////
app.post('/passion-api/api/group_member', async (req, res) => {
  try {
    const { group_id, memberid, membername, email, phone, transactionvalue } = req.body;
    const result = await pool.query('INSERT INTO group_member (group_id, memberid, membername, email, phone, transactionvalue) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [group_id, memberid, membername, email, phone, transactionvalue]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all students

app.get('/passion-api/get/api/group_member', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM group_member');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/group_member/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM group_member WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific group member by ID
app.put('/passion-api/api/group_member/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { group_id, memberid, membername, email, phone, transactionvalue } = req.body;
    const result = await pool.query(
      'UPDATE group_member SET group_id=$1, memberid=$2, membername=$3, email=$4, phone=$5, transactionvalue=$6 WHERE id = $7 RETURNING *',
      [group_id, memberid, membername, email, phone, transactionvalue, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Group member not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/delete/api/group_member/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM group_member WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: ' not found' });
    } else {
      res.json({ message: ' deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/passion-api/post/api/merged_groups', uploadS.single('groupLogo'), async (req, res) => {
  console.log("Request Body:", req.body); // Log incoming request data

  const { 
      member_id, 
      group_name, 
      other_group_name = '', // Provide default value
      group_owner, 
      new_group, 
      formed_date = new Date() // Default to current date if not provided
  } = req.body;

  // Check if the required fields are present
  if (!member_id || !group_name || !group_owner || !new_group) {
      console.log('Missing required fields:', { member_id, group_name, group_owner, new_group });
      return res.status(400).json({ error: 'Missing required fields' });
  }

  // File path for the uploaded file, if it exists
  const groupLogoPath = req.file ? req.file.path : null;

  try {
      const client = await pool.connect();  // Connect to the database

      const query = `
          INSERT INTO merged_groups 
          (member_id, group_name, other_group_name, group_owner, new_group, "groupLogoPath", formed_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      
      const values = [
          member_id, 
          group_name, 
          other_group_name,  
          group_owner, 
          new_group, 
          groupLogoPath, 
          formed_date
      ];

      await client.query(query, values); // Insert data into the database
      client.release();                  // Release the database connection

      res.status(201).json({ message: 'Group created successfully' }); // Send success response
  } catch (error) {
      console.error('Error creating group:', error);     // Log error to console
      res.status(500).json({ error: 'Internal Server Error' });  // Send error response
  }
});


// Get all groups
app.get('/passion-api/get/api/merged_groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM merged_groups');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/merged_groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM merged_groups WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'merged_groups not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'merged_groups Server Error' });
  }
});

// Update a specific student by ID
app.put('/passion-api/api/merged_groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { memberid, groupcode, groupname, grouplogo, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue } = req.body;
    const result = await pool.query('UPDATE group_s SET memberid=$1, groupcode=$2, groupname=$3, grouplogo=$4, groupcaption=$5, groupwebsitelink=$6, group_owner=$7, email=$8, phone=$9, transactionvalue=$10 WHERE id = $11 RETURNING *',
      [memberid, groupcode, groupname, grouplogo, groupcaption, groupwebsitelink, group_owner, email, phone, transactionvalue, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/delete/group_merged/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM merged_groups WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Group not found' });
    } else {
      res.json({ message: 'Group deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/passion-api/post/api/values_per', async (req, res) => {
  try {
    const { opportunity_type, rol_e, level_of_member } = req.body;
    const result = await pool.query('INSERT INTO values_per (opportunity_type,rol_e,level_of_member) VALUES ($1, $2, $3) RETURNING *',
      [opportunity_type, rol_e, level_of_member]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all students

app.get('/passion-api/get/api/values_per', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM values_per');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific student by ID
app.get('/passion-api/api/values_per/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM values_per WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///////////////////////////////////////////////////////////////////////////
app.put('/passion-api/put/api/values_per/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { opportunity_type, rol_e, level_of_member } = req.body;
    const result = await pool.query(
      'UPDATE values_per SET opportunity_type = $1, rol_e = $2, level_of_member = $3  WHERE id = $4 RETURNING *',
      [opportunity_type, rol_e, level_of_member,id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific student by ID
app.delete('/passion-api/delete/api/values_per/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM values_per WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: ' not found' });
    } else {
      res.json({ message: ' deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

////////////////////////transaction///////////////
app.post('/passion-api/post/transaction', async (req, res) => {
  try {
    const {
      vouchercode, date, member_name, membercategory,
      membertype, designation, transactiontype, opportunity_name,
      opportunity_work_type, ordervalue, percentage, amount, referencemember,
      currency, creditdays, paymentstatus, bankname, accountholder, accountnum, ifsccode
    } = req.body;

    const query = `
      INSERT INTO public.transaction (
        vouchercode, date, member_name, membercategory, membertype, designation,
        transactiontype, opportunity_name, opportunity_work_type,
        ordervalue, percentage, amount, referencemember, currency, creditdays,
        paymentstatus, bankname, accountholder, accountnum, ifsccode
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,$20)
      RETURNING transactionid, *
    `;

    const values = [
      vouchercode, date, member_name, membercategory, membertype,
      designation, transactiontype, opportunity_name, opportunity_work_type,
      ordervalue, percentage, amount, referencemember, currency, creditdays,
      paymentstatus, bankname, accountholder, accountnum, ifsccode
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Transaction created successfully', transaction: result.rows[0] });
  } catch (err) {
    console.error('Error inserting transaction:', err);
    res.status(500).json({ error: 'Transaction creation failed' });
  }
});

// GET API for fetching all transactions
app.get('/passion-api/get/transaction', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transaction');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/passion-api/get/transaction/:transactionid', async (req, res) => {
  const  transactionid = req.params.transactionid;

  try {
    const result = await pool.query('SELECT * FROM transaction WHERE transactionid=$1',[transactionid]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//FETCH BY NAME
app.get('/passion-api/get/transactiontype/:transactiontype', async (req, res) => {
  const  transactiontype = req.params.transactiontype;

  try {
    const result = await pool.query('SELECT * FROM transaction_master WHERE transactiontype=$1',[transactiontype]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete transaction
app.delete('/passion-api/api/delete/transaction/:transactionid', async (req, res) => {
  const  transactionid  = req.params.transactionid;

  console.log('transactionid:', transactionid);  // Log the transactionid to check its value

  if (!transactionid || isNaN(transactionid)) {
    return res.status(400).json({ error: 'Invalid transaction ID' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM transaction WHERE transactionid = $1 RETURNING *', 
      [transactionid]
    );

    const deletedTransaction = result.rows[0];

    if (deletedTransaction) {
      res.status(200).json({ 
        message: 'Transaction deleted successfully', 
        deletedTransaction 
      });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



////update api for transaction/////////////
app.put('/passion-api/transaction/:transactionid', async (req, res) => {
  const transactionid = req.params.transactionid;
  const {
      vouchercode,
      date,
      member_name,
      membertype,
      membercategory,
      opportunity_id,
      opportunity_name,
      opportunity_work_type,
      ordervalue,
      percentage,
      amount,
      referencemember,
      paymentstatus,
      bankname,
      accountholder,
      accountnum,
      ifsccode,
      currency,
      creditdays,
      designation,
      stockexchange,
      transactiontype,
  } = req.body;

  console.log("Received transaction update for ID:", transactionid);

  try {
      const client = await pool.connect();

      const result = await client.query(
        `UPDATE public.transaction
        SET 
            vouchercode = $1,
            date = $2,
            member_name = $3,
            membertype = $4,
            membercategory = $5,
            opportunity_id = $6,
            opportunity_name = $7,
            opportunity_work_type = $8,
            ordervalue = $9,
            percentage = $10,
            amount = $11,
            referencemember = $12,
            paymentstatus = $13,
            bankname = $14,
            accountholder = $15,
            accountnum = $16,
            ifsccode = $17,
            currency = $18,
            creditdays = $19,
            designation = $20,
            stockexchange = $21,
            transactiontype = $22
        WHERE transactionid = $23
        RETURNING *`,
        [
            vouchercode,
            date,
            member_name,
            membertype,
            membercategory,
            opportunity_id,
            opportunity_name,
            opportunity_work_type,
            ordervalue,
            percentage,
            amount,
            referencemember,
            paymentstatus,
            bankname,
            accountholder,
            accountnum,
            ifsccode,
            currency,
            creditdays,
            designation,
            stockexchange,
            transactiontype,
            transactionid,
        ]
    );    

      const updatedTransaction = result.rows[0];
      client.release();

      if (updatedTransaction) {
        res.json(updatedTransaction);
      } else {
        res.status(404).json({ error: 'Transaction entry not found' });
      }
    } catch (error) {
      console.error('Error updating transaction entry', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//////////transaction master/////////////
// GET API to fetch all records from transaction_master
app.get('/passion-api/get/transactionmaster', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transaction_master');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

app.get('/passion-api/get/tmaster/:tmasterid', async (req, res) => {
  const  tmasterid = req.params.tmasterid;

  try {
    const result = await pool.query('SELECT * FROM transaction_master WHERE tmasterid=$1',[tmasterid]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST API to insert a new record into transaction_master
app.post('/passion-api/post/transactionmaster', async (req, res) => {
  const {transactiontype, percentage, amount } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO public.transaction_master (transactiontype, percentage, amount) VALUES ($1, $2, $3) RETURNING *',
      [transactiontype, percentage, amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

///////////////////update////////////////
app.put('/passion-api/transactionmaster/:tmasterid', async (req, res) => {
  const id = req.params.tmasterid; // Use tmasterid instead of id
  const { transactiontype, percentage, amount, stockexchange } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE transaction_master SET transactiontype = $1, percentage = $2, amount = $3, stockexchange = $4 WHERE tmasterid = $5 RETURNING *',
      [transactiontype, percentage, amount, stockexchange, id]
    );
    const updatedmasterdata = result.rows[0];
    client.release();

    if (updatedmasterdata) {
      res.json(updatedmasterdata);
    } else {
      res.status(404).json({ error: 'Master entry not found' });
    }
  } catch (error) {
    console.error('Error updating entry', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/passion-api/api/transactionmaster/:transactionid', async (req, res) => {
  const { transactionid } = req.params;

  try {
    const result = await db.query('DELETE FROM transactionmaster WHERE transactionid = $1', [transactionid]);

    if (result.rowCount === 0) {
      return res.status(404).send('Transaction not found'); // Resource not found
    }
    res.status(200).send('Transaction deleted successfully');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).send('Internal Server Error');
  }
});

/////////////////stock exchange////////////
app.post('/passion-api/post/stockexchange', async (req, res) => {
  const { stockexchange, facevalue, currency } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO public.stockexchange (stockexchange, facevalue, currency) VALUES ($1, $2, $3) RETURNING *',
      [stockexchange, facevalue, currency]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});


// GET API to fetch all records from the stockexchange table
app.get('/passion-api/get/stockexchange', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM public.stockexchange');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/passion-api/get/stockexchange/:stockid', async (req, res) => {
  const  stockid = req.params.stockid;

  try {
    const result = await pool.query('SELECT * FROM stockexchange WHERE stockid=$1',[stockid]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update stock exchange entry
app.put('/passion-api/stockexchange/:stockid', async (req, res) => {
  const stockid = req.params.stockid; // Ensure correct stockid here
  const { stockexchange, facevalue, currency } = req.body;

  console.log("Received stock update for ID:", stockid); // Debug log

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE stockexchange SET stockexchange = $1, facevalue = $2, currency = $3 WHERE stockid = $4 RETURNING *',
      [stockexchange, facevalue, currency, stockid]
    );
    const updatedStock = result.rows[0];
    client.release();

    if (updatedStock) {
      res.json(updatedStock);
    } else {
      res.status(404).json({ error: 'Stock exchange entry not found' });
    }
  } catch (error) {
    console.error('Error updating stock exchange entry', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete stock exchange entry
app.delete('/passion-api/api/stockexchange/:stockid', async (req, res) => {
  const { stockid } = req.params;

  try {
    const result = await pool.query('DELETE FROM stockexchange WHERE stockid = $1', [stockid]); // Use pool instead of db

    if (result.rowCount === 0) {
      return res.status(404).send('Stock not found');
    }
    res.status(200).send('Stock deleted successfully');
  } catch (error) {
    console.error('Error deleting stock:', error); // Log the error
    res.status(500).send('Internal Server Error: ' + error.message); // Return detailed error response
  }
});

////////////////////CHatBOt/////////////////
 //////////////recruitebot resume parser///////////////////
 app.get('/passion-api/resumeparserget', (req, res) => {
  const sqlGet = 'SELECT * FROM resumeparser';
  pool.query(sqlGet, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(result.rows);
  });
});

// Handle file upload and data insertion
app.post('/passion-api/resumeparserpost', upload.single('uploadfile'), (req, res) => {
try {
  const { jobdescription, promptmsg } = req.body;
  const uploadfile = req.file;

  if (!uploadfile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!jobdescription || !promptmsg) {
    return res.status(400).json({ error: 'Job description and prompt message are required' });
  }

  const sqlInsert = 'INSERT INTO resumeparser (jobdescription, uploadfile, promptmsg) VALUES ($1, $2, $3)';
  const values = [jobdescription, uploadfile.originalname, promptmsg];

  pool.query(sqlInsert, values, (error) => {
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json({ message: 'Data inserted successfully' });
  });
} catch (error) {
  console.error('Error processing request:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

//**********************screening********************* */
   app.get('/passion-api/screeningget', (req, res) => {
   const sqlGet = 'SELECT * from screening';
   pool.query(sqlGet,(error,result)=>{
   if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
      res.json(result.rows);
  }
  );
});

app.post('/passion-api/screeningpost', upload.single('uploadfile'), async (req, res) => {
try {
  const { criteria, prompt } = req.body;
  const uploadfile = req.file;

  if (!uploadfile || !criteria || !prompt) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sqlInsert = 'INSERT INTO screening (criteria, fileupload, prompt) VALUES ($1, $2, $3)';
  const values = [criteria, uploadfile.originalname, prompt];
  await pool.query(sqlInsert, values);
  res.status(200).json({ message: 'Data inserted successfully' });
} catch (error) {
  console.error('Error processing request:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

//**************************schedule*********************** */
app.get('/passion-api/scheduleget', (req, res) => {
  const sqlGet= "SELECT * from schedule";
  pool.query(sqlGet,(error,result)=>{
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
      res.json(result.rows);
  });
});

app.use(bodyParser.json());

// POST route definition
app.post('/passion-api/schedulepost', async (req, res) => {
const { email, whatsapp, date, time, contact } = req.body;

if (!email || !whatsapp || !date || !time || !contact) {
  return res.status(400).json({ error: "All fields are required" });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: "Invalid email format" });
}

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!isoDateRegex.test(date)) {
  return res.status(400).json({ error: "Invalid date format, should be YYYY-MM-DD" });
}

const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
if (!timeRegex.test(time)) {
  return res.status(400).json({ error: "Invalid time format, should be HH:MM or HH:MM:SS" });
}

try {
  const sqlInsert = "INSERT INTO schedule (email, whatsapp, date, time, contact) VALUES ($1, $2, $3, $4, $5)";
  const values = [email, whatsapp, date, time, contact];
  await pool.query(sqlInsert, values);
  res.status(201).json({ message: "Data inserted successfully" });
} catch (error) {
  console.error("Error inserting data:", error);
  res.status(500).json({ error: "Internal server error" });
}
});

//************************interview************************ */
app.get('/passion-api/interviewget', (req, res) => {
const sqlGet= 'SELECT * from interview';
pool.query(sqlGet,(error,result)=>{
  if (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
    res.json(result.rows);
});
});

/////////////////////////////////////////////
app.post('/passion-api/interviewpost', upload.none(), async (req, res) => {
const { name, emailid, phone, link } = req.body;

// Validate input fields
if (!name || !emailid || !phone || !link) {
  return res.status(400).json({ error: 'All fields are required' });
}

// Additional validation for email and phone
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
if (!emailRegex.test(emailid)) {
  return res.status(400).json({ error: 'Invalid email format' });
}
if (!phoneRegex.test(phone)) {
  return res.status(400).json({ error: 'Invalid phone number format' });
}

try {
  const sqlInsert = 'INSERT INTO interview (name, emailid, phone, link) VALUES ($1, $2, $3, $4)';
  const values = [name, emailid, phone, link];
  await pool.query(sqlInsert, values);
  res.status(201).json({ message: 'Record inserted successfully' });
} catch (error) {
  console.error('Error inserting record:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});
//add a query
app.post('/passion-api/feedbackpost', upload.none(), (req, res) => {
const { interviewFeedback, whatWentWrong, rating } = req.body;

const ratingNumber = Number(rating);
if (isNaN(ratingNumber)) {
  return res.status(400).json({ error: 'Rating must be a number' });
}

const sqlInsert = 'INSERT INTO feedback (interviewfeed, whatwentwrong, rating) VALUES ($1, $2, $3)';
const values = [interviewFeedback, whatWentWrong, ratingNumber];

pool.query(sqlInsert, values, (error, result) => {
  if (error) {
    console.error('Error inserting feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(201).json({ message: 'Feedback inserted successfully' });
});
});

// Function to send reset email
const sendResetEmail = (email, token) => {
  const mailOptions = {
    from: 'sakshikadam1892001@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: http://localhost:3001/user/reset-password/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Route to handle forget password
app.post('/passion-api/forget-password', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM members WHERE member_email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).send('User not found');
    }

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '1h' });
    sendResetEmail(email, token); // Use sendResetEmail here
    res.send('Password reset link sent to your email');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Route to handle reset password
app.post('/passion-api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('UPDATE members SET member_password = $1 WHERE id = $2', [hashedPassword, decoded.id]);

    if (result.rowCount === 0) {
      return res.status(400).send('User not found or password not updated');
    }
    res.send('Password has been reset');
  } catch (error) {
    console.error(error);
    res.status(500).send('Invalid or expired token');
  }
});

////////update password for register student///////////
app.post('/api/update-password', async (req, res) => {
  const { userid, newpassword } = req.body;
  try {
    // Update password in the database (pseudo-code, adapt to your DB)
    await pool.query('UPDATE password_update SET password = $1 WHERE userid = $2', [newpassword, userid]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});


//////////authentication
app.post('/passion-api/authenticate', async (req, res) => {
  const { member_email, member_password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM members WHERE member_email = $1',
      [member_email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(member_password, user.member_password);

    if (isMatch) {
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(401).json({ message: 'Invalid User ID or Password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Start the server

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


app.listen(5001,()=>{
  console.log("server is running on port 5001");
})