const User = require("../models/User")
const express = require("express");
const axios = require("axios")
require("dotenv").config();
const OpenAI = require('openai');
const router  = express()


router.use(express.urlencoded(true));



const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
  });

router.post("/ask", async (req, res) => {
    const prompt = req.body.prompt;
    try {
      if (prompt == null) {
        throw new Error("Uh oh, no prompt was provided");
      }
      const completion = await openai.chat.completions.create({
          messages: [{ role: 'user', content : prompt}],
          model: 'gpt-3.5-turbo',
        });
  
      return res.status(200).json({
        success: true,
        message: completion,
      });
    } catch (error) {
      console.log(error.message);
    }
  });

  module.exports = router;