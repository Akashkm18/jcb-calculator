import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

const API = "https://jcb-calculator-5.onrender.com";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("cem_logged_in") === "true"
  );

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

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
      demo: "Demo OTP",
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
      demo: "ಡೆಮೊ OTP",
      welcome: "ಜೆಸಿಬಿ ಮಾಲೀಕರಿಗೆ ಸುರಕ್ಷಿತ ಪ್ರವೇಶ"
    }
  };

  const t = text[language];

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API}/history`);

      if (!response.ok) {
        throw new Error("History request failed");
      }

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.log("History fetch error:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchHistory();
    }
  }, [loggedIn]);

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Enter a valid 10 digit Indian mobile number");
      return;
    }

    const generatedOtp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    setDemoOtp(generatedOtp);
    setOtpSent(true);

    alert(`Demo OTP: ${generatedOtp}`);
  };

  const verifyOtp = () => {
    if (otp === demoOtp && otp.length === 6) {
      localStorage.setItem("cem_logged_in", "true");
      setLoggedIn(true);
      setOtp("");
      setOtpSent(false);
    } else {
      alert("Invalid OTP");
    }
  };

  const logout = () => {
    localStorage.removeItem("cem_logged_in");
    setLoggedIn(false);
    setTotal(null);
  };

  const calculate = async () => {
    if (!customer || !jcbNumber || !hours || !rate) {
      alert("Please enter customer, JCB number, hours and rate");
      return;
    }

    const workAmount = Number(hours) * Number(rate);
    const bataAmount = Number(driverBata) || 0;

    // Diesel is stored separately.
    // Diesel is NOT added to total.
    const finalAmount = workAmount + bataAmount;

    const result = {
      workAmount,
      diesel: Number(diesel) || 0,
      driverBata: bataAmount,
      finalAmount
    };

    setTotal(result);

    try {
      await fetch(`${API}/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: customer || "N/A",
          jcbNumber: jcbNumber || "N/A",
          hours: Number(hours),
          rate: Number(rate),
          diesel: Number(diesel) || 0,
          workAmount,
          driverBata: bataAmount,
          finalAmount
        })
      });

      fetchHistory();
    } catch (error) {
      console.log("History save error:", error);
    }
  };

  const clearHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all history?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API}/history`, {
        method: "DELETE"
      });

      setHistory([]);
    } catch (error) {
      console.log("Clear history error:", error);
    }
  };

  const downloadPDF = () => {
    if (!total) {
      alert("First calculate the amount");
      return;
    }

    const pdf = new jsPDF();
    const date = new Date().toLocaleDateString("en-IN");

    pdf.setFontSize(18);
    pdf.text("CHOWDESHWARI EARTH MOVERS", 105, 20, {
      align: "center"
    });

    pdf.setFontSize(15);
    pdf.text("JCB WORK RECEIPT", 105, 30, {
      align: "center"
    });

    pdf.setFontSize(10);
    pdf.text("JCB Work & Payment Details", 105, 37, {
      align: "center"
    });

    pdf.line(20, 44, 190, 44);

    pdf.setFontSize(11);

    pdf.text(`Date: ${date}`, 20, 55);
    pdf.text(`Customer: ${customer || "N/A"}`, 20, 65);
    pdf.text(`JCB Number: ${jcbNumber || "N/A"}`, 20, 75);

    pdf.line(20, 82, 190, 82);

    pdf.setFontSize(11);

    pdf.text("Description", 25, 94);
    pdf.text("Amount", 150, 94);

    pdf.line(20, 100, 190, 100);

    pdf.text(
      `JCB Work (${hours} hrs x Rs.${rate})`,
      25,
      112
    );

    pdf.text(`Rs.${total.workAmount}`, 150, 112);

    pdf.text("Driver Bata", 25, 124);
    pdf.text(`Rs.${total.driverBata}`, 150, 124);

    pdf.text("Diesel Cost", 25, 136);
    pdf.text(`Rs.${total.diesel}`, 150, 136);

    pdf.line(20, 143, 190, 143);

    pdf.setFontSize(15);

    pdf.text("TOTAL AMOUNT", 25, 157);
    pdf.text(`Rs.${total.finalAmount}`, 150, 157);

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

    pdf.save("Chowdeshwari_Earth_Movers_Receipt.pdf");
  };

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">

          <div className="login-logo">🚜</div>

          <h1>{t.company}</h1>

          <h2>{t.login}</h2>

          <p>{t.welcome}</p>

          <div className="language-switch">
            <button
              className={language === "en" ? "active-lang" : ""}
              onClick={() => setLanguage("en")}
            >
              English
            </button>

            <button
              className={language === "kn" ? "active-lang" : ""}
              onClick={() => setLanguage("kn")}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <div className="input-group">
            <label>{t.mobile}</label>

            <input
              type="tel"
              maxLength="10"
              placeholder={t.mobilePlaceholder}
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

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
                <label>{t.otp}</label>

                <input
                  type="text"
                  maxLength="6"
                  placeholder="******"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>

              <div className="demo-otp">
                {t.demo}: {demoOtp}
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

  return (
    <div className="page">

      <div className="top-bar">

        <div>
          <strong>{t.company}</strong>
        </div>

        <div className="top-actions">

          <button
            onClick={() =>
              setLanguage(language === "en" ? "kn" : "en")
            }
          >
            {language === "en" ? "ಕನ್ನಡ" : "English"}
          </button>

          <button onClick={logout}>
            {t.logout}
          </button>

        </div>

      </div>

      <div className="calculator">

        <div className="header">

          <div className="machine-icon">
            🚜
          </div>

          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>

        </div>

        <div className="form">

          <div className="input-group">
            <label>{t.customer}</label>

            <input
              type="text"
              placeholder={t.customerPlaceholder}
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>{t.jcb}</label>

            <input
              type="text"
              placeholder={t.jcbPlaceholder}
              value={jcbNumber}
              onChange={(e) =>
                setJcbNumber(e.target.value)
              }
            />
          </div>

          <div className="row">

            <div className="input-group">
              <label>{t.hours}</label>

              <input
                type="number"
                min="0"
                placeholder={t.hoursPlaceholder}
                value={hours}
                onChange={(e) =>
                  setHours(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>{t.rate}</label>

              <input
                type="number"
                min="0"
                placeholder={t.ratePlaceholder}
                value={rate}
                onChange={(e) =>
                  setRate(e.target.value)
                }
              />
            </div>

          </div>

          <div className="row">

            <div className="input-group">
              <label>{t.bata}</label>

              <input
                type="number"
                min="0"
                placeholder={t.bataPlaceholder}
                value={driverBata}
                onChange={(e) =>
                  setDriverBata(e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>{t.diesel}</label>

              <input
                type="number"
                min="0"
                placeholder={t.dieselPlaceholder}
                value={diesel}
                onChange={(e) =>
                  setDiesel(e.target.value)
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

              <h2>{t.receipt}</h2>

              <p>{t.payment}</p>

            </div>

            <div className="receipt-info">

              <p>
                <span>{t.customer}</span>
                <strong>
                  {customer || "N/A"}
                </strong>
              </p>

              <p>
                <span>{t.jcb}</span>
                <strong>
                  {jcbNumber || "N/A"}
                </strong>
              </p>

              <p>
                <span>{t.date}</span>
                <strong>
                  {new Date().toLocaleDateString("en-IN")}
                </strong>
              </p>

            </div>

            <div className="line"></div>

            <div className="bill-row">

              <span>
                {t.work} ({hours} hrs × Rs.{rate})
              </span>

              <strong>
                Rs.{total.workAmount}
              </strong>

            </div>

            <div className="bill-row">

              <span>{t.driver}</span>

              <strong>
                Rs.{total.driverBata}
              </strong>

            </div>

            <div className="bill-row">

              <span>{t.diesel}</span>

              <strong>
                Rs.{total.diesel}
              </strong>

            </div>

            <div className="line"></div>

            <div className="total">

              <span>{t.total}</span>

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

            <h2>{t.history}</h2>

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
                    {item.hours} hrs × Rs.{item.rate}
                  </p>

                  <p>
                    Driver Bata: Rs.{item.driverBata || 0}
                  </p>

                  <p>
                    Diesel: Rs.{item.diesel || 0}
                  </p>

                  <small>
                    {new Date(
                      item.createdAt
                    ).toLocaleString("en-IN")}
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