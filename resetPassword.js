const mongoose = require("mongoose");
const User = require("./models/user"); // adjust path if needed

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

(async () => {
  try {
    const userId = "6851433971d88fa2fbefea9e"; // your user ID
    

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found.");
      return;
    }

    await user.setPassword(newPassword); // this handles hashing internally
    await user.save();

    console.log("✅ Password reset successfully!");
  } catch (err) {
    console.error("⚠️ Error resetting password:", err);
  } finally {
    mongoose.disconnect();
  }
})();
