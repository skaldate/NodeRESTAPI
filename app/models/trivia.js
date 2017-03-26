var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionsSchema = new Schema({
    category: String,
    category_id: Number,
    type: String,
    difficulty: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String]
});

module.exports = mongoose.model('Questions', QuestionsSchema);