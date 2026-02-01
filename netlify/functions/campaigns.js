const fetch = require('node-fetch');

const API_KEY = process.env.CAMPAIGN_MONITOR_API_KEY;
const BASE_URL = "https://api.createsend.com/api/v3.3";

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured" })
    };
  }

  try {
    // Get clients first
    const clientsResponse = await fetch(`${BASE_URL}/clients.json`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(API_KEY + ':x').toString('base64')
      }
    });

    if (!clientsResponse.ok) {
      throw new Error(`Failed to fetch clients: ${clientsResponse.statusText}`);
    }

    const clients = await clientsResponse.json();

    if (!clients || clients.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No clients found" })
      };
    }

    // Get campaigns for first client
    const clientId = clients[0].ClientID;
    const campaignsResponse = await fetch(
      `${BASE_URL}/clients/${clientId}/campaigns.json`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(API_KEY + ':x').toString('base64')
        }
      }
    );

    if (!campaignsResponse.ok) {
      throw new Error(`Failed to fetch campaigns: ${campaignsResponse.statusText}`);
    }

    const campaignsData = await campaignsResponse.json();
    const campaigns = campaignsData.Results || campaignsData || [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        campaigns: campaigns,
        total: campaigns.length
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
