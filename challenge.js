// ========================================
// REP FIVE — CHALLENGE PAGE
// Team routing test
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  // Read the Team ID from the URL
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("team");

  // Temporary test data
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

  // Find the requested team
  const team = teams[teamId];

  // If no valid team was supplied
  if (!team) {
    console.log("No valid Team ID supplied.");
    return;
  }

  // ========================================
  // UPDATE PAGE
  // ========================================

  const teamName = document.getElementById("team-name");
  const challengeName = document.getElementById("challenge-name");
  const scoreboard = document.getElementById("challenge-scoreboard");

  if (scoreboard) {
    scoreboard.dataset.challengeId = team.challengeId;
  }

  if (teamName) {
    teamName.textContent = team.teamName;
  }

  if (challengeName) {
    challengeName.textContent = team.challengeName;
  }

  if (challengeId) {
    challengeId.textContent = team.challengeId;
  }

});
