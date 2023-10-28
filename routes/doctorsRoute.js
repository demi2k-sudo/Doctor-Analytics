const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const moment = require("moment")
router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.get(
  "/get-schedules",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const today =  new Date();
      console.log(today)
      const appointments = await Appointment.find({
        doctorId: doctor._id,
        date: { $gt: today.toISOString() }, 
      });
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);

router.get(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.body.userId });
      const appointments = await Appointment.find({ doctorId: doctor._id });
      res.status(200).send({
        message: "Appointments fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);

router.delete("/delete-appointment", authMiddleware, async (req, res) => {
  try {
    const { doctorId, time } = req.query;
    // console.log(time+' '+doctorId)
    const fromTime = moment(time)
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(time).add(1, "hours").toISOString();
    // Find the doctor based on the provided doctorId
    const doctor = await Doctor.findOne({ _id: doctorId });
    // console.log(fromTime+' '+toTime)
    // Find and delete the appointment with the specified time and doctorId
    
    const deletedAppointment = await Appointment.updateMany({
      doctorId: doctor._id,
      time: { $gte: fromTime, $lte: toTime },
      status : {$eq : "pending"}
    },
    {
      status:"rejected"
    }
    );
    
    // console.log(deletedAppointment)

    if (deletedAppointment) {
      res.status(200).send({
        message: "Appointment deleted successfully",
        success: true,
        data: deletedAppointment,
      });
    } else {
      res.status(404).send({
        message: "Appointment not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting appointment",
      success: false,
      error,
    });
  }
});

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const user = await User.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    res.status(200).send({
      message: "Appointment status updated successfully",
      success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
});

module.exports = router;
