const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "vikas123",
  database: "vikas",
};

const pool = mysql.createPool(dbConfig);

app.post("/createContact", async (req, res) => {
  try {
    const { first_name, last_name, email, mobile_number, data_store } =
      req.body;

    if (data_store === "CRM") {
      const url = `https://domain.freshsales.io/api/sales_accounts`;
      const headers = {
        Authorization: `Token token=${freshSalesApiKey}`,
        "Content-Type": "application/json",
      };

      const data = {
        first_name,
        last_name,
        email,
        mobile_number,
      };

      try {
        const response = await axios.post(url, data, { headers });
        return response.data;
      } catch (error) {
        console.error(
          "Error creating contact in FreshSales CRM:"
        );
        throw error;
      }
    } else if (data_store === "DATABASE") {
      const [result] = await pool.execute(
        "INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)",
        [first_name, last_name, email, mobile_number]
      );

      res.json({
        message: "Contact created in DATABASE",
        contact_id: result.insertId,
      });
    } else {
      res.status(400).json({ message: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getContact", async (req, res) => {
  try {
    const { contact_id, data_store } = req.body;

    if (data_store === "CRM") {
        const url = `https://domain.freshsales.io/api/sales_accounts/view/${contact_id}`;
        const headers = {
          Authorization: `Token token=${freshSalesApiKey}`,
          "Content-Type": "application/json",
        };

  
        try {
          const response = await axios.get(url, { headers });
          return response.data;
        } catch (error) {
          console.error(
            "Error "
          );
          throw error;
        }
    } else if (data_store === "DATABASE") {
      const [result] = await pool.execute(
        "SELECT * FROM contacts WHERE id = ?",
        [contact_id]
      );
      if (result.length > 0) {
        res.json({ message: "Get contact from DATABASE", contact: result[0] });
      } else {
        res.status(404).json({ message: "Contact not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/updateContact", async (req, res) => {
  try {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;

    if (data_store === "CRM") {
      
      res.json({ message: "Update contact in CRM" });
    } else if (data_store === "DATABASE") {
      // Update contact in the 'contacts' table in MySQL
      await pool.execute(
        "UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?",
        [new_email, new_mobile_number, contact_id]
      );
      res.json({ message: "Update contact in DATABASE" });
    } else {
      res.status(400).json({ message: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post("/deleteContact", async (req, res) => {
  try {
    const { contact_id, data_store } = req.body;

    if (data_store === "CRM") {
      
      res.json({ message: "Delete contact in CRM" });
    } else if (data_store === "DATABASE") {
      
      await pool.execute("DELETE FROM contacts WHERE id = ?", [contact_id]);
      res.json({ message: "Delete contact in DATABASE" });
    } else {
      res.status(400).json({ message: "Invalid data_store parameter" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
