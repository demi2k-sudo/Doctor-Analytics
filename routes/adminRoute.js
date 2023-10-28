const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.delete("/delete-user", authMiddleware, async (req, res) => {
  userId = req.query.id;

  try {
    // Find the user by their ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete the user
    await user.remove();

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });

      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "Doctor status updated successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.get("/get-analysis-1", authMiddleware, async (req, res) => {
  try {
    // Get the current year and the year before it
    // const currentYear = new Date().getFullYear();
    // const lastYear = currentYear - 1;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    
    
    // Aggregate query to find department-wise highest total amount paid for appointments in the last two years
    const result = await Appointment.aggregate([
      {
        $match: {
          "createdAt": {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
      {
        $group: {
          _id: "$doctorInfo.specialization", // Group by doctor's department from the embedded object
          totalAmountPaid: { $sum: "$doctorInfo.feePerCunsultation" } // Calculate total amount paid using fee per consultation
        }
      },
      {
        $sort: { totalAmountPaid: -1 } // Sort by total amount paid in descending order
      },
      
    ]);

    if (result.length === 0) {
      // Handle case where no data is found
      res.status(404).send({
        message: "No data found for the last two years",
        success: false
      });
    } else {
      res.status(200).send({
        message: "Highest total amount paid for appointments in the last two years by department",
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error querying data",
      success: false,
      error
    });
  }
});

router.get("/get-analysis-2", authMiddleware, async (req, res) => {
  try {
    // Get the current year and the year before it
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    // Aggregate query to find department-wise highest total amount paid for appointments in the last two years
    const result = await Appointment.aggregate([
      {
        $match: {
          "createdAt": {
			$gte: startDate,
			$lt: endDate
      }
        }
      },
      {
        $group: {
          _id: "$doctorInfo.specialization", // Group by department
          appointmentCount: { $sum: 1 } // Count the number of appointments
        }
      },
      {
        $sort: { appointmentCount: -1 } // Sort by total amount paid in descending order
      },
      
    ]);

    if (result.length === 0) {
      // Handle case where no data is found
      res.status(404).send({
        message: "No data found for the last two years",
        success: false
      });
    } else {
      res.status(200).send({
        message: "Highest total number for appointments in the last two years by department",
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error querying data",
      success: false,
      error
    });
  }
});

router.get("/get-analysis-3", authMiddleware, async (req, res) => {
  try {
    // Get the current year and the year before it
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    // Aggregate query to find department-wise highest total amount paid for appointments in the last two years
    const result = await Appointment.aggregate([
      {
        $match: {
          "createdAt": {
			$gte: startDate,
			$lt: endDate
      }
        }
      },
      {
        $group: {
          _id: "$doctorInfo.firstName", // Group by department
          appointmentCount: { $sum: 1 } // Count the number of appointments
        }
      },
      {
        $sort: { appointmentCount: -1 } // Sort by total amount paid in descending order
      },
    ]);

    if (result.length === 0) {
      // Handle case where no data is found
      res.status(404).send({
        message: "No data found for the last two years",
        success: false
      });
    } else {
      res.status(200).send({
        message: "Highest total number for appointments in the last two years by department",
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error querying data",
      success: false,
      error
    });
  }
});

router.get("/get-analysis-4", authMiddleware, async (req, res) => {
  try {
    // Get the current year and the year before it
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    // Aggregate query to find department-wise highest total amount paid for appointments in the last two years
    const result = await Appointment.aggregate([
      {
        $match: {
          "createdAt": {
            $gte: startDate,
            $lt: endDate
          }
        }
      },
          {
            $group: {
              _id: "$userInfo.name", // Group by doctor's department from the embedded object
              totalAmountPaid: { $sum: "$doctorInfo.feePerCunsultation" } // Calculate total amount paid using fee per consultation
            }
          },
          {
            $sort: { totalAmountPaid: -1 } // Sort by total amount paid in descending order
          }
        ]);
    

    if (result.length === 0) {
      // Handle case where no data is found
      res.status(404).send({
        message: "No data found for the last two years",
        success: false
      });
    } else {
      res.status(200).send({
        message: "Highest total number for appointments in the last two years by department",
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error querying data",
      success: false,
      error
    });
  }
});


module.exports = router;


