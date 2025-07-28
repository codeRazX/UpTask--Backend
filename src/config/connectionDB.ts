import mongoose from "mongoose";
import 'dotenv/config'
import colors from 'colors'
import { exit } from 'node:process';

(() => {
 
  const connection = async () => {
    try{
      
      if (!process.env.NODE_ENV){
        console.log(colors.bgRed.bold('Enviroment variable NODE_ENV not found! Check this!'))
        exit(1)
      }
      const connectionString = ['dev', 'test'].includes(process.env.NODE_ENV) 
      ? process.env.DATABASE_URI_DEV 
      : process.env.DATABASE_URI_PROD

      if (!connectionString){
        exit(1)
      }
    
      await mongoose.connect(connectionString)
      console.log(colors.bgCyan.bold('Connection to the DB succesful'))
    }
    catch(error){
     console.log(error)
     console.log(colors.bgRed.bold('Failed to connect to the DB'))
     exit(1)
    }
  }

  connection()
})();