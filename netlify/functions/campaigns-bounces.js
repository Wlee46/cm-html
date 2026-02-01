const fetch = require('node-fetch');

const API_KEY = process.env.CAMPAIGN_MONITOR_API_KEY;
const BASE_URL = "https://api.createsend.com/api/v3.3";

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "API key not configured" })
    };
  }

  // Extract campaign ID from path
  const pathParts = event.path.split('/');
  const campaignIndex = pathParts.indexOf('campaigns');
  const campaignId = campaignIndex >= 0 ? pathParts[campaignIndex + 1] : null;

  if (!campaignId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Campaign ID is required" })
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/campaigns/${campaignId}/bounces.json`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(API_KEY + ':x').toString('base64')
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch campaign bounces: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
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
