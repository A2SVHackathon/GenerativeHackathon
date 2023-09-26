const express = require("express");
const router = express.Router();
const {whisper} = require("whisper-node");
router.route("/check").post(
    async(req,res,next)=>{
        
        
        // const filepath = path.resolve(__dirname,"voice2.wav");
        const transcript =  await whisper("voice2.wav");
        console.log(transcript)
    }
    
)
