// ========================================
// REP FIVE — CHALLENGE PAGE
// Challenge + Team routing via API
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("CHALLENGE JS VERSION: API TEST 002");

  const API_URL =
    "https://script.google.com/macros/s/AKfycbxW0-5VPC3bEisqxFL7XktDUZci-OyykqF5Ddf-BQqxUQbOlXRG0zqS9jnnzcvGhAs/exec";


  // ========================================
  // READ URL PARAMETERS
  // ========================================

  const params = new URLSearchParams(window.location.search);

  const teamId = params.get("team");
  const challengeId = params.get("challenge");

  console.log("Team ID:", teamId);
  console.log("Challenge ID:", challengeId);


  // ========================================
  // FETCH CHALLENGE DATA
  // ========================================

  fetch(
    `${API_URL}?team=${encodeURIComponent(teamId)}&challenge=${encodeURIComponent(challengeId)}`
  )

    .then(response => response.json())

    .then(data => {

      console.log("API response:", data);


      // ========================================
      // VALIDATE API RESPONSE
      // ========================================

      if (!data.success || !data.challenge) {

        console.error(
          "Challenge data not found:",
          data
        );

        return;
      }


      const challenge = data.challenge;


      // ========================================
      // DEBUG
      // ========================================

      console.log(
        "Team:",
        challenge["Team Name"]
      );

      console.log(
        "Sport:",
        challenge["Sport"]
      );

      console.log(
        "Challenge:",
        challenge["Challenge Name"]
      );

      console.log(
        "Status:",
        challenge["Status"]
      );


      // ========================================
      // FIND PAGE ELEMENTS
      // ========================================

      const teamNameElement =
        document.getElementById("team-name");

      const challengeNameElement =
        document.getElementById("challenge-name");

      const scoreboard =
        document.getElementById("challenge-scoreboard");


      // ========================================
      // UPDATE TEAM + SPORT
      // ========================================

      if (teamNameElement) {

        teamNameElement.textContent =
          `${challenge["Team Name"]} · ${challenge["Sport"]}`;

      }


      // ========================================
      // UPDATE CHALLENGE NAME
      // ========================================

      if (challengeNameElement) {

        challengeNameElement.textContent =
          challenge["Challenge Name"];

      }


      // ========================================
      // UPDATE SCOREBOARD IDENTIFIERS
      // ========================================

      if (scoreboard) {

        scoreboard.dataset.teamId =
          challenge["Team ID"];

        scoreboard.dataset.challengeId =
          challenge["Challenge ID"];

      }


      // ========================================
      // ROUTING CONFIRMATION
      // ========================================

      console.log("RepFive routing successful.");

    })


    // ========================================
    // API ERROR
    // ========================================

    .catch(error => {

      console.error(
        "API error:",
        error
      );

    });

});
