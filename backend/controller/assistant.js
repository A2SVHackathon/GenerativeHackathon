const {Leopard} = require("@picovoice/leopard-node");
require('dotenv').config();
const OpenAI = require('openai');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const path = require('path')
const gTTS = require('gtts');

const openai = new OpenAI({
  api_key: process.env.OPENAI_API_KEY
});

exports.askByText = asyncHandler(async (req, res, next) => {
  const prompt = req.body.prompt;
  const gTTS = require('gtts');
  
  if(prompt == null) {
    return next(new ErrorResponse(`Prompt not found`, 404))
  }

  const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content : prompt}],
      model: 'gpt-3.5-turbo',
    });
    
  let speech = completion.choices[0].message.content;

  const gtts = new gTTS(speech, 'en');

  gtts.save('Response.mp3', function (err, result){
    if(err) { throw new Error(err); }
    console.log("Text to speech converted!");
  });

  return res.status(200).json({
    success: true,
    message: "Text to speech converted!"
  });
})

exports.askByVoice = asyncHandler(async (req, res, next) => {
  const prompt = req.body.prompt;
  const {Leopard} = require("@picovoice/leopard-node");
  const handle = new Leopard(process.env.STT_AccessKey , {enableAutomaticPunctuation: true});
  const result = handle.processFile(prompt);
  
  if(prompt == null) {
    return next(new ErrorResponse(`Prompt not found`, 404))
  }

  const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content : result.transcript}],
      model: 'gpt-3.5-turbo',
    });

    let speech = completion.choices[0].message.content;

    const gtts = new gTTS(speech, 'en');
  
    gtts.save('Response.mp3', function (err, result){
      if(err) { throw new Error(err); }
      console.log("Text to speech converted!");
    });
  
    return res.status(200).json({
      success: true,
      message: "Text to speech converted!"
    });
})
  