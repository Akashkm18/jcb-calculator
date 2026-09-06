import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./App.css";
const API = "https://jcb-calculator-5.onrender.com";

const MSG91_WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const MSG91_TOKEN = import.meta.env.VITE_MSG91_TOKEN;

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("cem_logged_in") === "true"
  );

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpReqId, setOtpReqId] = useState("");
  const [msg91Ready, setMsg91Ready] = useState(false);

  const [language, setLanguage] = useState("en");

  const [customer, setCustomer] = useState("");
  const [jcbNumber, setJcbNumber] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [diesel, setDiesel] = useState("");
  const [driverBata, setDriverBata] = useState("");

  const [total, setTotal] = useState(null);
  const [history, setHistory] = useState([]);

  const text = {
    en: {
      company: "Chowdeshwari Earth Movers",
      title: "JCB Work Calculator",
      subtitle: "Calculate JCB work charges and generate receipt",

      customer: "Customer Name",
      customerPlaceholder: "Enter customer name",

      jcb: "JCB Number",
      jcbPlaceholder: "KA 01 AB 1234",

      hours: "Working Hours",
      hoursPlaceholder: "Enter working hours",

      rate: "Rate / Hour",
      ratePlaceholder: "Enter hourly rate",

      diesel: "Diesel Cost",
      dieselPlaceholder: "Enter diesel cost",

      bata: "Driver Bata",
      bataPlaceholder: "Enter driver bata",

      calculate: "Calculate Amount",

      receipt: "JCB WORK RECEIPT",
      payment: "Payment Receipt",
      date: "Date",
      work: "JCB Work",
      driver: "Driver Bata",
      dieselInfo: "Diesel Cost",
      total: "TOTAL AMOUNT",

      pdf: "Download PDF Receipt",

      history: "Calculation History",
      clear: "Clear History",
      noHistory: "No calculation history yet.",

      logout: "Logout",

      login: "Owner Login",
      mobile: "Mobile Number",
      mobilePlaceholder: "Enter 10 digit mobile number",
      sendOtp: "Send OTP",
      otp: "Enter OTP",
      verify: "Verify OTP",
      welcome: "Secure access for JCB owners"
    },

    kn: {
      company: "ಚೌಡೇಶ್ವರಿ ಅರ್ಥ್ ಮೂವರ್ಸ್",
      title: "ಜೆಸಿಬಿ ಕೆಲಸದ ಲೆಕ್ಕಾಚಾರ",
      subtitle: "ಜೆಸಿಬಿ ಕೆಲಸದ ಹಣದ ಲೆಕ್ಕ ಮತ್ತು ರಸೀದಿ",

      customer: "ಗ್ರಾಹಕರ ಹೆಸರು",
      customerPlaceholder: "ಗ್ರಾಹಕರ ಹೆಸರು ನಮೂದಿಸಿ",

      jcb: "ಜೆಸಿಬಿ ಸಂಖ್ಯೆ",
      jcbPlaceholder: "KA 01 AB 1234",

      hours: "ಕೆಲಸದ ಗಂಟೆಗಳು",
      hoursPlaceholder: "ಕೆಲಸದ ಗಂಟೆಗಳನ್ನು ನಮೂದಿಸಿ",

      rate: "ಗಂಟೆಗೆ ದರ",
      ratePlaceholder: "ಗಂಟೆಯ ದರ ನಮೂದಿಸಿ",

      diesel: "ಡೀಸೆಲ್ ವೆಚ್ಚ",
      dieselPlaceholder: "ಡೀಸೆಲ್ ವೆಚ್ಚ ನಮೂದಿಸಿ",

      bata: "ಡ್ರೈವರ್ ಬಾಟಾ",
      bataPlaceholder: "ಡ್ರೈವರ್ ಬಾಟಾ ನಮೂದಿಸಿ",

      calculate: "ಹಣ ಲೆಕ್ಕ ಹಾಕಿ",

      receipt: "ಜೆಸಿಬಿ ಕೆಲಸದ ರಸೀದಿ",
      payment: "ಪಾವತಿ ರಸೀದಿ",
      date: "ದಿನಾಂಕ",
      work: "ಜೆಸಿಬಿ ಕೆಲಸ",
      driver: "ಡ್ರೈವರ್ ಬಾಟಾ",
      dieselInfo: "ಡೀಸೆಲ್ ವೆಚ್ಚ",
      total: "ಒಟ್ಟು ಮೊತ್ತ",

      pdf: "PDF ರಸೀದಿ ಡೌನ್‌ಲೋಡ್",

      history: "ಲೆಕ್ಕಾಚಾರದ ಇತಿಹಾಸ",
      clear: "ಇತಿಹಾಸ ಅಳಿಸಿ",
      noHistory: "ಇನ್ನೂ ಯಾವುದೇ ಲೆಕ್ಕಾಚಾರ ಇಲ್ಲ.",

      logout: "ಲಾಗ್ ಔಟ್",

      login: "ಮಾಲೀಕರ ಲಾಗಿನ್",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      mobilePlaceholder: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
      sendOtp: "OTP ಕಳುಹಿಸಿ",
      otp: "OTP ನಮೂದಿಸಿ",
      verify: "OTP ಪರಿಶೀಲಿಸಿ",
      welcome: "ಜೆಸಿಬಿ ಮಾಲೀಕರಿಗೆ ಸುರಕ್ಷಿತ ಪ್ರವೇಶ"
    }
  };

  const t = text[language];

  // ==========================================
  // MSG91 INITIALIZATION
  // ==========================================
useEffect(() => {
  const initializeMSG91 = () => {
    if (!MSG91_WIDGET_ID || !MSG91_TOKEN) {
      console.error("MSG91 configuration missing.");
      return;
    }

    if (typeof window.initSendOTP !== "function") {
      console.error("MSG91 initSendOTP function is not available.");
      return;
    }

    const configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_TOKEN,
      exposeMethods: true,
      captchaRenderId: "msg91-captcha",

      success: (data) => {
        console.log("MSG91 success:", data);
      },

      failure: (error) => {
        console.error("MSG91 failure:", error);
      }
    };

    try {
      window.initSendOTP(configuration);

      setTimeout(() => {
        if (typeof window.sendOtp === "function") {
          console.log("MSG91 sendOtp loaded successfully");
          setMsg91Ready(true);
        } else {
          console.error("MSG91 sendOtp is not available.");
        }
      }, 1000);

    } catch (error) {
      console.error("MSG91 initialization error:", error);
    }
  };

  const script = document.createElement("script");

  script.type = "text/javascript";
  script.src = "https://verify.msg91.com/otp-provider.js";
  script.async = true;

  script.onload = () => {
    console.log("MSG91 script loaded");
    initializeMSG91();
  };

  script.onerror = () => {
    console.error("MSG91 script failed to load");
    alert("MSG91 script could not load.");
  };

  document.body.appendChild(script);

  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
}, []);

      
  // ==========================================
  // FETCH HISTORY
  // ==========================================

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API}/history`);

      if (!response.ok) {
        throw new Error("History request failed");
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("History fetch error:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchHistory();
    }
  }, [loggedIn]);

  // ==========================================
  // SEND OTP
  // ==========================================

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Enter a valid 10 digit Indian mobile number");
      return;
    }

    if (
      !msg91Ready ||
      typeof window.sendOtp !== "function"
    ) {
      alert(
        "MSG91 is still loading. Wait 2 seconds and try again."
      );
      return;
    }

    const identifier = `91${mobile}`;

    console.log("Sending OTP to:", identifier);

    try {
      window.sendOtp(
        identifier,

        (data) => {
          console.log("OTP sent successfully:", data);
console.log("OTP response type:", typeof data);
console.log("OTP response JSON:", JSON.stringify(data, null, 2));

    const requestId =
  data?.reqId ||
  data?.reqid ||
  data?.requestId ||
  data?.request_id ||
  data?.message ||
  data?.data?.reqId ||
  data?.data?.reqid ||
  data?.data?.requestId ||
  data?.data?.request_id ||
  data?.data?.message ||
  "";

console.log("MSG91 REQUEST ID:", requestId);

if (!requestId) {
  alert("OTP sent, but request ID not found. Check Console.");
  return;
}

setOtpReqId(requestId);
setOtpSent(true);
setOtp("");
alert("OTP sent successfully. Check your mobile.");

console.log("MSG91 FULL OTP RESPONSE:", data);
console.log("MSG91 REQUEST ID:", requestId);

if (!requestId) {
  alert("OTP sent, but MSG91 request ID was not received. Check Console.");
  return;
}

setOtpReqId(requestId);
setOtpSent(true);
setOtp("");
          setOtpSent(true);
          setOtp("");

          alert("OTP sent successfully. Check your mobile.");
        },

        (error) => {
          console.error("MSG91 send OTP error:", error);

          try {
            console.error(
              "MSG91 error JSON:",
              JSON.stringify(error, null, 2)
            );
          } catch (jsonError) {
            console.error("Error JSON conversion failed:", jsonError);
          }

          alert(
            "OTP could not be sent. Open F12 Console and check the MSG91 error."
          );
        }
      );
    } catch (error) {
      console.error("Send OTP exception:", error);
      alert("OTP sending failed.");
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const verifyOtp = () => {
    if (!/^\d{4}$/.test(otp)) {
      alert("Enter the 4 digit OTP");
      return;
    }

    if (
      !msg91Ready ||
      typeof window.verifyOtp !== "function"
    ) {
      alert("MSG91 is still loading. Wait and try again.");
      return;
    }

    if (!otpReqId) {
      alert("OTP request ID missing. Please send OTP again.");
      setOtpSent(false);
      return;
    }

    console.log("Verifying OTP:", otp);
    console.log("Request ID:", otpReqId);

    try {
      window.verifyOtp(
        Number(otp),

        async (data) => {
         console.log("OTP verified successfully:", data);
console.log("VERIFY RESPONSE TYPE:", typeof data);
console.log("VERIFY RESPONSE JSON:", JSON.stringify(data, null, 2));
const accessToken =
  data?.accessToken ||
  data?.["access-token"] ||
  data?.token ||
  data?.access_token ||
  data?.message;
          if (!accessToken) {
            console.error(
              "No MSG91 access token returned:",
              data
            );

            alert(
              "OTP verified, but secure login verification failed."
            );

            return;
          }

          try {
            const response = await fetch(
              `${API}/auth/verify`,
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json"
                },

                body: JSON.stringify({
                  accessToken
                })
              }
            );

            const result = await response.json();

            console.log(
              "Backend verification result:",
              result
            );

            if (!response.ok || !result.success) {
              console.error(
                "Backend MSG91 verification failed:",
                result
              );

              alert(
                "OTP verified, but server verification failed."
              );

              return;
            }

            localStorage.setItem(
              "cem_logged_in",
              "true"
            );

            setLoggedIn(true);
            setOtp("");
            setOtpSent(false);
            setOtpReqId("");

          } catch (error) {
            console.error(
              "Backend OTP verification error:",
              error
            );

            alert(
              "OTP verified, but server connection failed."
            );
          }
        },

        (error) => {
          console.error(
            "MSG91 verify OTP error:",
            error
          );

          alert("Invalid or expired OTP.");
        },

        otpReqId
      );
    } catch (error) {
      console.error(
        "Verify OTP exception:",
        error
      );

      alert("OTP verification failed.");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("cem_logged_in");

    setLoggedIn(false);
    setTotal(null);
  };

  // ==========================================
  // CALCULATE
  // ==========================================

  const calculate = async () => {
    if (
      !customer ||
      !jcbNumber ||
      !hours ||
      !rate
    ) {
      alert(
        "Please enter customer, JCB number, hours and rate"
      );

      return;
    }

    const workAmount =
      Number(hours) * Number(rate);

    const bataAmount =
      Number(driverBata) || 0;

    const dieselAmount =
      Number(diesel) || 0;

    const finalAmount =
      workAmount + bataAmount;

    const result = {
      workAmount,
      diesel: dieselAmount,
      driverBata: bataAmount,
      finalAmount
    };

    setTotal(result);

    try {
      const response = await fetch(
        `${API}/history`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            customer,
            jcbNumber,
            hours: Number(hours),
            rate: Number(rate),
            diesel: dieselAmount,
            workAmount,
            driverBata: bataAmount,
            finalAmount
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save calculation"
        );
      }

      await fetchHistory();

    } catch (error) {
      console.error(
        "History save error:",
        error
      );
    }
  };

  // ==========================================
  // CLEAR HISTORY
  // ==========================================

  const clearHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all history?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/history`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to clear history"
        );
      }

      setHistory([]);

    } catch (error) {
      console.error(
        "Clear history error:",
        error
      );
    }
  };

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const downloadPDF = () => {
    if (!total) {
      alert("First calculate the amount");
      return;
    }

    const pdf = new jsPDF();

    const date =
      new Date().toLocaleDateString("en-IN");

    pdf.setFontSize(18);

    pdf.text(
      "CHOWDESHWARI EARTH MOVERS",
      105,
      20,
      {
        align: "center"
      }
    );

    pdf.setFontSize(14);

    pdf.text(
      "JCB WORK RECEIPT",
      105,
      30,
      {
        align: "center"
      }
    );

    pdf.setFontSize(10);

    pdf.text(
      "JCB Work & Payment Details",
      105,
      37,
      {
        align: "center"
      }
    );

    pdf.line(
      20,
      44,
      190,
      44
    );

    pdf.setFontSize(11);

    pdf.text(
      `Date: ${date}`,
      20,
      55
    );

    pdf.text(
      `Customer: ${customer || "N/A"}`,
      20,
      65
    );

    pdf.text(
      `JCB Number: ${jcbNumber || "N/A"}`,
      20,
      75
    );

    pdf.line(
      20,
      82,
      190,
      82
    );

    pdf.text(
      "Description",
      25,
      94
    );

    pdf.text(
      "Amount",
      150,
      94
    );

    pdf.line(
      20,
      100,
      190,
      100
    );

    pdf.text(
      `JCB Work (${hours} hrs x Rs.${rate})`,
      25,
      112
    );

    pdf.text(
      `Rs.${total.workAmount}`,
      150,
      112
    );

    pdf.text(
      "Driver Bata",
      25,
      124
    );

    pdf.text(
      `Rs.${total.driverBata}`,
      150,
      124
    );

    pdf.text(
      "Diesel Cost",
      25,
      136
    );

    pdf.text(
      `Rs.${total.diesel}`,
      150,
      136
    );

    pdf.line(
      20,
      143,
      190,
      143
    );

    pdf.setFontSize(15);

    pdf.text(
      "TOTAL AMOUNT",
      25,
      157
    );

    pdf.text(
      `Rs.${total.finalAmount}`,
      150,
      157
    );

    pdf.setFontSize(10);

    pdf.text(
      "Diesel cost is recorded separately and is not included in total.",
      105,
      173,
      {
        align: "center"
      }
    );

    pdf.text(
      "Thank you for using Chowdeshwari Earth Movers.",
      105,
      184,
      {
        align: "center"
      }
    );

    pdf.save(
      "Chowdeshwari_Earth_Movers_Receipt.pdf"
    );
  };

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (!loggedIn) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-logo">
            🚜
          </div>

          <h1>
            {t.company}
          </h1>

          <h2>
            {t.login}
          </h2>

          <p>
            {t.welcome}
          </p>

          <div className="language-switch">

            <button
              className={
                language === "en"
                  ? "active-lang"
                  : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              English
            </button>

            <button
              className={
                language === "kn"
                  ? "active-lang"
                  : ""
              }
              onClick={() =>
                setLanguage("kn")
              }
            >
              ಕನ್ನಡ
            </button>

          </div>

          <div className="input-group">

            <label>
              {t.mobile}
            </label>

            <input
              type="tel"
              maxLength="10"
              placeholder={
                t.mobilePlaceholder
              }
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
            />

          </div>

          <div
            id="msg91-captcha"
            style={{
              minHeight: "0px"
            }}
          ></div>

          {!otpSent ? (

            <button
              className="calculate-btn"
              onClick={sendOtp}
            >
              {t.sendOtp}
            </button>

          ) : (

            <>
              <div className="input-group">

                <label>
                  {t.otp}
                </label>

                <input
                  type="text"
                  maxLength="4"
                  placeholder="4 digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

              </div>

              <button
                className="calculate-btn"
                onClick={verifyOtp}
              >
                {t.verify}
              </button>

            </>

          )}

        </div>

      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="page">

      <div className="top-bar">

        <div>
          <strong>
            {t.company}
          </strong>
        </div>

        <div className="top-actions">

          <button
            onClick={() =>
              setLanguage(
                language === "en"
                  ? "kn"
                  : "en"
              )
            }
          >
            {language === "en"
              ? "ಕನ್ನಡ"
              : "English"}
          </button>

          <button
            onClick={logout}
          >
            {t.logout}
          </button>

        </div>

      </div>

      <div className="calculator">

        <div className="header">

          <div className="machine-icon">
            🚜
          </div>

          <h1>
            {t.title}
          </h1>

          <p>
            {t.subtitle}
          </p>

        </div>

        <div className="form">

          <div className="input-group">

            <label>
              {t.customer}
            </label>

            <input
              type="text"
              placeholder={
                t.customerPlaceholder
              }
              value={customer}
              onChange={(e) =>
                setCustomer(
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <label>
              {t.jcb}
            </label>

            <input
              type="text"
              placeholder={
                t.jcbPlaceholder
              }
              value={jcbNumber}
              onChange={(e) =>
                setJcbNumber(
                  e.target.value
                )
              }
            />

          </div>

          <div className="row">

            <div className="input-group">

              <label>
                {t.hours}
              </label>

              <input
                type="number"
                min="0"
                placeholder={
                  t.hoursPlaceholder
                }
                value={hours}
                onChange={(e) =>
                  setHours(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="input-group">

              <label>
                {t.rate}
              </label>

              <input
                type="number"
                min="0"
                placeholder={
                  t.ratePlaceholder
                }
                value={rate}
                onChange={(e) =>
                  setRate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="row">

            <div className="input-group">

              <label>
                {t.bata}
              </label>

              <input
                type="number"
                min="0"
                placeholder={
                  t.bataPlaceholder
                }
                value={driverBata}
                onChange={(e) =>
                  setDriverBata(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="input-group">

              <label>
                {t.diesel}
              </label>

              <input
                type="number"
                min="0"
                placeholder={
                  t.dieselPlaceholder
                }
                value={diesel}
                onChange={(e) =>
                  setDiesel(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          <button
            className="calculate-btn"
            onClick={calculate}
          >
            {t.calculate}
          </button>

        </div>

        {total && (

          <div className="receipt">

            <div className="receipt-header">

              <div className="receipt-icon">
                🚜
              </div>

              <h2>
                {t.receipt}
              </h2>

              <p>
                {t.payment}
              </p>

            </div>

            <div className="receipt-info">

              <p>
                <span>
                  {t.customer}
                </span>

                <strong>
                  {customer || "N/A"}
                </strong>
              </p>

              <p>
                <span>
                  {t.jcb}
                </span>

                <strong>
                  {jcbNumber || "N/A"}
                </strong>
              </p>

              <p>
                <span>
                  {t.date}
                </span>

                <strong>
                  {new Date().toLocaleDateString(
                    "en-IN"
                  )}
                </strong>
              </p>

            </div>

            <div className="line"></div>

            <div className="bill-row">

              <span>
                {t.work} (
                {hours} hrs × Rs.
                {rate}
                )
              </span>

              <strong>
                Rs.{total.workAmount}
              </strong>

            </div>

            <div className="bill-row">

              <span>
                {t.driver}
              </span>

              <strong>
                Rs.{total.driverBata}
              </strong>

            </div>

            <div className="bill-row">

              <span>
                {t.dieselInfo}
              </span>

              <strong>
                Rs.{total.diesel}
              </strong>

            </div>

            <div className="line"></div>

            <div className="total">

              <span>
                {t.total}
              </span>

              <strong>
                Rs.{total.finalAmount}
              </strong>

            </div>

            <button
              className="pdf-btn"
              onClick={downloadPDF}
            >
              {t.pdf}
            </button>

          </div>

        )}

        <div className="history">

          <div className="history-header">

            <h2>
              {t.history}
            </h2>

            <button
              className="clear-history-btn"
              onClick={clearHistory}
            >
              {t.clear}
            </button>

          </div>

          {history.length === 0 ? (

            <p className="no-history">
              {t.noHistory}
            </p>

          ) : (

            history.map((item) => (

              <div
                className="history-card"
                key={item._id}
              >

                <div>

                  <h3>
                    {item.customer}
                  </h3>

                  <p>
                    JCB: {item.jcbNumber}
                  </p>

                  <p>
                    {item.hours} hrs × Rs.
                    {item.rate}
                  </p>

                  <p>
                    Driver Bata: Rs.
                    {item.driverBata || 0}
                  </p>

                  <p>
                    Diesel: Rs.
                    {item.diesel || 0}
                  </p>

                  <small>
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString("en-IN")
                      : ""}
                  </small>

                </div>

                <div className="history-total">

                  <span>
                    {t.total}
                  </span>

                  <strong>
                    Rs.{item.finalAmount}
                  </strong>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default App;