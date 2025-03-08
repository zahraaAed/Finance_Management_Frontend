import React, { useEffect, useState } from "react";

const Header = () => {
  const [userName, setUserName] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail") || "guest@gmail.com";
    let extractedName = userEmail.split("@")[0];
    extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
    setUserName(extractedName);

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(today);
  }, []);

  return (
    <div className="header-content">
      <h2>Hi, {userName}</h2>
      <p className="fs-4">{currentDate}</p>
      {/* Add more Header content if needed */}
    </div>
  );
};

export default Header;
