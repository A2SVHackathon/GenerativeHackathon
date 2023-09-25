const ErrorResponse = require('../utils/errorResponse')
const { translate } = require('@vitalets/google-translate-api')
const asyncHandler = require('../middleware/async')
const language_dict = require("../config/language_codes")

exports.CreateTranslation = asyncHandler(async(req,res,next)=>{
    const toBeTranslated =  req.body.text;
    const toLanguage = req.body.to.toLowerCase();

    if(toLanguage in language_dict){
        const {text} = await translate(toBeTranslated, {to: language_dict[toLanguage]})
    
        res.status(200).json({success:true, data: text});
    }else{
        res.status(400).json({success:false, data: "unsupported language"})
    }

    
})

