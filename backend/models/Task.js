const mongoose = require('mongoose')


const TaskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters']
          },
          slug: String,
          
    }
)