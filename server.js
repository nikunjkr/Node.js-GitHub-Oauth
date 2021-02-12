require('dotenv').config();
const axios = require('axios');
const express = require('express');
const path = require('path');
const fetch =require('node-fetch');


const app = express();

app.use(express.static('static'));

const PORT =process.env.PORT || 3000;

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret= process.env.GITHUB_SECRET;



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

async function getAccessToken({client_id, client_secret,code}) {
  const req = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  })
  const text =await req.text();
  const params =new URLSearchParams(text);
  console.log(params)
  return params.get("access_token");
}


async function getGithubUser(access_token) {
  const req = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `bearer ${access_token}`
    }
  })
  const data = await req.json();
  return data;
}


async function getEvents({username, access_token}){
  const req = await fetch(`https://api.github.com/users/${username}/events`,{
    headers: {
      Authorization: `bearer ${access_token}`
    }
  });

  const eventData = await req.json();
  return eventData;
}

app.get('/oauth-callback', async (req, res) => {
  
  const code= req.query.code;
  const access_token= await getAccessToken({client_id, client_secret, code})
  const githubData =await getGithubUser(access_token);
  const username = githubData.login;

  //dispay all activity of user
  const gitHubEvents = await getEvents({username, access_token});
  res.json(gitHubEvents);
  
})
  
app.listen(PORT);

