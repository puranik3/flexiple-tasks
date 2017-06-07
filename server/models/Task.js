let mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    title: String,
    deadline: Date,
    description: String,
    type: String,
    created: Date,
    userId: String,
    hours: Number
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;