// ========================================
// REP FIVE — CHALLENGE PAGE
// Challenge + Team routing
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("CHALLENGE JS VERSION: API TEST 001");
  const API_URL = "https://script.google.com/macros/s/AKfycbxW0-5VPC3bEisqxFL7XktDUZci-OyykqF5Ddf-BQqxUQbOlXRG0zqS9jnnzcvGhAs/exec";

  // ========================================
  // READ URL PARAMETERS
  // ========================================

  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("team");
  const challengeId = params.get("challenge");

  fetch(
  `${API_URL}?team=${encodeURIComponent(teamId)}&challenge=${encodeURIComponent(challengeId)}`
)
    .then(response => response.json())
    .then(data => {

      console.log("API response:", data);

      if (!data.success || !data.challenge) {
        console.error("Challenge data not found.");
        return;
      }

      const challenge = data.challenge;

      const teamNameElement =
        document.getElementById("team-name");

      const challengeNameElement =
        document.getElementById("challenge-name");

      const scoreboard =
        document.getElementById("challenge-scoreboard");

      // Team + Sport
      if (teamNameElement) {
        teamNameElement.textContent =
          `${challenge["Team Name"]} · ${challenge["Sport"]}`;
      }

      // Challenge Name
      if (challengeNameElement) {
        challengeNameElement.textContent =
          challenge["Challenge Name"];
      }

      // Scoreboard identifiers
      if (scoreboard) {
        scoreboard.dataset.teamId =
          challenge["Team ID"];

        scoreboard.dataset.challengeId =
          challenge["Challenge ID"];
      }

})

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

});
