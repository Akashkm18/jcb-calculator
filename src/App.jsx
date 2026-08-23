import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [customer, setCustomer] = useState("");
  const [jcbNumber, setJcbNumber] = useState("");
  const [hours, setHours] = useState("");
  const [rate, setRate] = useState("");
  const [diesel, setDiesel] = useState("");
  const [total, setTotal] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("https://jcb-calculator-5.onrender.com/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.log("History fetch error:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const calculate = async () => {
    const workAmount = Number(hours) * Number(rate);
    const finalAmount = workAmount + Number(diesel);

    const result = {
      workAmount,
      diesel: Number(diesel),
      finalAmount
    };

    setTotal(result);

    try {
      await fetch("https://jcb-calculator-5.onrender.com/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: customer || "N/A",
          jcbNumber: jcbNumber || "N/A",
          hours: Number(hours),
          rate: Number(rate),
          diesel: Number(diesel),
          workAmount,
          finalAmount
        })
      });

      fetchHistory();
    } catch (error) {
      console.log("History save error:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch("https://jcb-calculator-5.onrender.com/history", {
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

    pdf.setFontSize(22);
    pdf.text("JCB WORK RECEIPT", 105, 25, {
      align: "center"
    });

    pdf.setFontSize(11);
    pdf.text("JCB Work & Payment Details", 105, 33, {
      align: "center"
    });

    pdf.line(20, 40, 190, 40);

    pdf.setFontSize(12);

    pdf.text(`Date: ${date}`, 20, 52);
    pdf.text(`Customer: ${customer || "N/A"}`, 20, 62);
    pdf.text(`JCB Number: ${jcbNumber || "N/A"}`, 20, 72);

    pdf.line(20, 80, 190, 80);

    pdf.text("Description", 25, 92);
    pdf.text("Amount", 150, 92);

    pdf.line(20, 98, 190, 98);

    pdf.text(
      `JCB Work (${hours} hrs x Rs.${rate})`,
      25,
      110
    );

    pdf.text(`Rs.${total.workAmount}`, 150, 110);

    pdf.text("Diesel Cost", 25, 122);
    pdf.text(`Rs.${total.diesel}`, 150, 122);

    pdf.line(20, 130, 190, 130);

    pdf.setFontSize(15);

    pdf.text("TOTAL AMOUNT", 25, 145);
    pdf.text(`Rs.${total.finalAmount}`, 150, 145);

    pdf.setFontSize(11);

    pdf.text(
      "Thank you for using our JCB service.",
      105,
      170,
      {
        align: "center"
      }
    );

    pdf.save("JCB_Work_Receipt.pdf");
  };

  return (
    <div className="page">

      <div className="calculator">

        <div className="header">
          <div className="machine-icon">🚜</div>

          <h1>JCB Work Calculator</h1>

          <p>
            Calculate work charges and generate receipt
          </p>
        </div>

        <div className="form">

          <div className="input-group">
            <label>Customer Name</label>

            <input
              type="text"
              placeholder="Enter customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>JCB Number</label>

            <input
              type="text"
              placeholder="KA 01 AB 1234"
              value={jcbNumber}
              onChange={(e) => setJcbNumber(e.target.value)}
            />
          </div>

          <div className="row">

            <div className="input-group">
              <label>Working Hours</label>

              <input
                type="number"
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Rate / Hour</label>

              <input
                type="number"
                placeholder="Rs. Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>

          </div>

          <div className="input-group">
            <label>Diesel Cost</label>

            <input
              type="number"
              placeholder="Enter diesel cost"
              value={diesel}
              onChange={(e) => setDiesel(e.target.value)}
            />
          </div>

          <button
            className="calculate-btn"
            onClick={calculate}
          >
            Calculate Amount
          </button>

        </div>

        {total && (
          <div className="receipt">

            <div className="receipt-header">
              <div className="receipt-icon">🚜</div>

              <h2>JCB WORK RECEIPT</h2>

              <p>Payment Receipt</p>
            </div>

            <div className="receipt-info">

              <p>
                <span>Customer</span>
                <strong>{customer || "N/A"}</strong>
              </p>

              <p>
                <span>JCB Number</span>
                <strong>{jcbNumber || "N/A"}</strong>
              </p>

              <p>
                <span>Date</span>
                <strong>
                  {new Date().toLocaleDateString("en-IN")}
                </strong>
              </p>

            </div>

            <div className="line"></div>

            <div className="bill-row">
              <span>
                JCB Work ({hours} hrs x Rs.{rate})
              </span>

              <strong>
                Rs.{total.workAmount}
              </strong>
            </div>

            <div className="bill-row">
              <span>Diesel Cost</span>

              <strong>
                Rs.{total.diesel}
              </strong>
            </div>

            <div className="line"></div>

            <div className="total">
              <span>TOTAL</span>

              <strong>
                Rs.{total.finalAmount}
              </strong>
            </div>

            <button
              className="pdf-btn"
              onClick={downloadPDF}
            >
              Download PDF Receipt
            </button>

          </div>
        )}

        <div className="history">

          <div className="history-header">
            <h2>Calculation History</h2>

            <button
              className="clear-history-btn"
              onClick={clearHistory}
            >
              Clear History
            </button>
          </div>

          {history.length === 0 ? (
            <p className="no-history">
              No calculation history yet.
            </p>
          ) : (
            history.map((item) => (
              <div className="history-card" key={item._id}>

                <div>
                  <h3>{item.customer}</h3>

                  <p>
                    JCB: {item.jcbNumber}
                  </p>

                  <p>
                    {item.hours} hrs × Rs.{item.rate}
                  </p>

                  <p>
                    Diesel: Rs.{item.diesel}
                  </p>

                  <small>
                    {new Date(item.createdAt).toLocaleString("en-IN")}
                  </small>
                </div>

                <div className="history-total">
                  <span>Total</span>
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