// this is a proxy server that forwards requests to the ERP system and adds the JWT token to the request headers.
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use(async (req, res) => {
    const url = 'https://erp-test-v2.fr.eurofiber.com' + req.url;
    
    if (req.url.startsWith('/api/token')) {
      // Request JWT token
      let jwtToken;
      try {
        const response = await axios.post('https://erp-test-v2.fr.eurofiber.com/api/token', req.body);
        jwtToken = response.data.access_token;
        console.log('JWT Token: ', jwtToken);
      } catch (error) {
        console.error("Error getting JWT token:", error);
        // Send back original error message
        res.status(500).json({ 
          message: error.message || "Error getting JWT token.",
          data: error.response.data
        });
        return;
      }
  
      // Send back JWT token
      res.json({
        access_token: jwtToken
      });
    } else {
      // Forward other requests to the ERP system
      try {
        const jwtToken = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const response = await axios.get(url, {
          headers: {
            'Authorization': 'Bearer ' + jwtToken
          }
        });
        res.json(response.data);
      } catch (error) {
        console.error("Error forwarding request:", error);
        res.status(500).json({
          message: error.message || "Error forwarding request."
        });
      }
    }
  });

app.listen(5000, () => console.log('Proxy server running on port 5000'));
