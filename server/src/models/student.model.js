const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fathername: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },

}, { timestamps: true })
