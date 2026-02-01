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

  try {
    const authHeader = 'Basic ' + Buffer.from(API_KEY + ':x').toString('base64');

    // 1. Get Client ID
    const clientsResponse = await fetch(`${BASE_URL}/clients.json`, {
      headers: { 'Authorization': authHeader }
    });

    if (!clientsResponse.ok) {
      throw new Error('Failed to fetch clients');
    }

    const clients = await clientsResponse.json();
    if (!clients || clients.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No clients found" })
      };
    }

    const clientId = clients[0].ClientID;

    // 2. Get All Lists
    const listsResponse = await fetch(
      `${BASE_URL}/clients/${clientId}/lists.json`,
      { headers: { 'Authorization': authHeader } }
    );

    if (!listsResponse.ok) {
      throw new Error('Failed to fetch lists');
    }

    const activeLists = await listsResponse.json();

    // 3. Fetch stats for each list
    const finalResults = [];
    for (const lst of activeLists) {
      try {
        const listId = lst.ListID;
        const statsResponse = await fetch(
          `${BASE_URL}/lists/${listId}/stats.json`,
          { headers: { 'Authorization': authHeader } }
        );

        if (statsResponse.ok) {
          const data = await statsResponse.json();

          const totalSubscribers = data.TotalActiveSubscribers || 0;
          const newThisMonth = data.NewActiveSubscribersThisMonth || 0;
          const unsubThisMonth = data.UnsubscribesThisMonth || 0;
          const netChange = newThisMonth - unsubThisMonth;

          // Calculate percentage change
          const previousCount = totalSubscribers - netChange;
          const changePct = previousCount > 0 ? (netChange / previousCount * 100) : 0;

          finalResults.push({
            Name: lst.Name,
            Subscribers: totalSubscribers,
            SubscribersChange: netChange,
            SubscribersChangePct: Math.round(changePct * 10) / 10,
            Delivered: 0,
            OpenRate: 0.0,
            OpenRateChange: 0.0,
            ClickRate: 0.0,
            ClickRateChange: 0.0
          });
        }
      } catch (error) {
        console.error(`Error fetching stats for list ${lst.Name}:`, error);
        continue;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(finalResults)
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
