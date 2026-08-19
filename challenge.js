// ========================================
// REP FIVE — CHALLENGE PAGE
// Challenge + Team routing
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxW0-5VPC3bEisqxFL7XktDUZci-OyykqF5Ddf-BQqxUQbOlXRG0zqS9jnnzcvGhAs/exec";

  // ========================================
  // READ URL PARAMETERS
  // ========================================

  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("team");
  const challengeId = params.get("challenge");

  fetch(`${API_URL}?challenge=${encodeURIComponent(challengeId)}`)
    .then(response => response.json())
    .then(data => {
      console.log("API response:", data);
    })
    .catch(error => {
      console.error("API error:", error);
    });


  // ========================================
  // TEMPORARY TEST DATA
  // ========================================

  const teams = {

    "TEAM-001": {
      teamName: "U13 Boys",
      challengeId: "CH-001",
      challengeName: "First RepFive Challenge"
    },

    "TEAM-002": {
      teamName: "U14 Girls",
      challengeId: "CH-002",
      challengeName: "Fall Challenge"
    }

  };


  // ========================================
  // VALIDATE TEAM
  // ========================================

  const team = teams[teamId];

  if (!team) {

    console.log("No valid Team ID supplied.");

    return;

  }


  // ========================================
  // VALIDATE CHALLENGE
  // ========================================

  if (challengeId !== team.challengeId) {

    console.log(
      "Challenge ID does not match the selected Team."
    );

    return;

  }


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
  // UPDATE PAGE
  // ========================================

  if (teamNameElement) {

    teamNameElement.textContent =
      team.teamName;

  }


  if (challengeNameElement) {

    challengeNameElement.textContent =
      team.challengeName;

  }


  if (scoreboard) {

    scoreboard.dataset.teamId =
      teamId;

    scoreboard.dataset.challengeId =
      challengeId;

  }


  // ========================================
  // DEBUG / TESTING
  // ========================================

  console.log("RepFive routing successful.");

  console.log("Team ID:", teamId);

  console.log("Challenge ID:", challengeId);

  console.log("Team:", team.teamName);

  console.log("Challenge:", team.challengeName);

  console.log("API response:", JSON.stringify(data, null, 2));

});
