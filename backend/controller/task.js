const asyncHandler = require("../middleware/async");
const User = require("../models/User")
// const express = require("express");
// require("dotenv").config();
const OpenAI = require('openai');
// const router  = express()

const openai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY
  });
  
  
  
// router.use(express.urlencoded({ extended: true }));


// @desc Ask about travel sites
// @route POST /api/v1/tasks/ask
// @access public
exports.askAboutSites = asyncHandler(async (req, res) => {
  const prompt = "\"" +req.body.prompt + `\"If my question in quotes is not related to travel sites, tourism, or travel only
  want you to respond with json format with success false and data empty. if not can you list location. what it is and why i should visit it.
  who made it and when if applicable. what is the history behind it if applicable. what is the best time to visit it.
  I want you to respond it using json format. `

  if (prompt == null) {
    return next(new ErrorResponse(`Empty prompt was entered`, 404))
  }

  const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content : prompt}],
      model: 'gpt-3.5-turbo',
    });

    const jsonResponse = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      jsonResponse
    });
})


// @desc Create a travel plan
// @route POST /api/v1/tasks/create_plan
// @access public
exports.createPlan = asyncHandler(async (req, res) => {
  const request = req.body;
  const prompt = `I have some exciting plans for my upcoming adventure, and I can't wait to make it all happen. First off, I've decided to explore ${request.destination} and immerse myself in the unique culture and attractions there for ${request.duration}.
  When it comes to what I'm most interested in, I have a soft spot for ${request.interests}. That could be the energy of bustling cities, the tranquility of natural wonders, or a perfect blend of both.        
  Now, let's talk about the budget. I'm keeping it in mind, and I'm open to ${request.budget} options. And as for activities, I'm eager to experience ${request.activities}, whether that means wildlife safaris, cultural festivals,
  historical landmarks, beach relaxation, or adventure sports. As for my travel companions, I might go ${request.travel_companions}, and I'm still deciding. My dietary preferences? Well, I have some, and it's ${request.dietary_preferences}.
  I want my culinary experiences to be top-notch. In terms of transportation, I'm thinking of relying on ${request.transportation}. It just feels like the right fit for me. And when it comes to accommodations, I'm leaning towards ${request.accommodation} for a comfortable stay.
  Adventure is definitely on my radar. Whether it's hiking, snorkeling, or zip-lining, I'm up for the challenge, so you can count me in for ${request.adventure_activities}.
  Now, pace-wise, I want a bit of both worlds. A balanced mix of a fast-paced adventure with many activities and some relaxing, leisurely moments sounds perfect to me (${request.pace}).
  Cultural exploration is a big part of what I'm looking forward to. Count me in for learning about local culture, history, art, or all of the above (${request.cultural_exploration}).
  If there are specific landmarks or attractions in mind, I've got a few favorites like ${request.specific_landmarks}. But I'm also open to suggestions and hidden gems.
  When it comes to travel style, I'm all about variety. Let's explore off-the-beaten-path destinations, iconic tourist spots, and find that perfect mix (${request.travel_style}).
  So I want you to provide me the best travel plan for my upcoming adventure. can you list the days and tasks with times if applicable that i have to do in my stay.
  I want you to respond it using json format.`
  
  
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content : prompt}],
        model: 'gpt-3.5-turbo',
      });

    const jsonResponse = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json({
      success: true,
      message: jsonResponse
    });
  } 
  catch (error) {
    console.log(error.message);
  }
})