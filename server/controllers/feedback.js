const ContactFeedback = require("../models/contactFeedback")

exports.newFeedback = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const feedback = new ContactFeedback({ name, email, message });
        await feedback.save();

        res.status(200).json({ message: "Feedback submitted successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "internal server error.", success: false });
    }
}

exports.allFeedbacks = async (req, res) => {
    try {
        const feedbacks = await ContactFeedback.find();
        res.status(200).json({ Feedbacks: feedbacks, success: true })
    } catch (error) {
        return res.status(500).json({ message: "internal server error.", success: false });
    }
}

exports.updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const feedback = await ContactFeedback.findByIdAndUpdate(id, { status }, { new: true })

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found", success: false });
        }

        res.status(200).json({ message: "Feedback status updated successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "internal server error.", success: false });
    }
}