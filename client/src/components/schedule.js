import React from "react";
import { useNavigate } from "react-router-dom";

function Schedule({ schedule }) {
  const navigate = useNavigate();
  const scheduleDate = new Date(schedule.date);
  const formattedDate = `${scheduleDate.getDate()} ${scheduleDate.toLocaleString('default', { month: 'short' })}`;
  const formattedTime = scheduleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedYear = scheduleDate.getFullYear();
  return (
    
    <div
      className="card p-2 cursor-pointer"
    >
      <h1 className="card-title">
        {formattedDate + ' ' + formattedYear} 
      </h1>
      <p>
        <b>Time : </b>
        {formattedTime}
      </p>
      <p>
        <b>Patient : </b>
        {schedule.userInfo.name} 
      </p>
    </div>
  );
}

export default Schedule;
