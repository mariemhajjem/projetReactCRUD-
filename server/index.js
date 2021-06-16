//import express from 'express' 
//import mongoose from 'mongoose'
//import cors from 'cors'
const app = require('./app');
const db = require('./config/db');
const express = require('express');
const cors = require('cors');
  

app.use(express.json({ limit: "30mb" , extended: true }));
app.use(express.urlencoded({ limit: "30mb" , extended: true }));
app.use(cors());
const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, function() {
    console.log('Express server listening on PORT ' + PORT);
  });

