// ========================================
// REP FIVE — CHALLENGE PAGE
// Challenge + Team + Scoreboard
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("CHALLENGE JS VERSION: SCOREBOARD TEST 001");

  const API_URL =
    "https://script.google.com/macros/s/AKfycbxW0-5VPC3bEisqxFL7XktDUZci-OyykqF5Ddf-BQqxUQbOlXRG0zqS9jnnzcvGhAs/exec";


  // ========================================
  // READ URL PARAMETERS
  // ========================================

  const params =
    new URLSearchParams(window.location.search);

  const teamId =
    params.get("team");

  const challengeId =
    params.get("challenge");

  console.log("Team ID:", teamId);
  console.log("Challenge ID:", challengeId);


  // ========================================
  // FIND PAGE ELEMENTS
  // ========================================

  const teamNameElement =
    document.getElementById("team-name");

  const challengeNameElement =
    document.getElementById("challenge-name");

  const scoreboard =
    document.getElementById("challenge-scoreboard");

  const challengeStatus =
    document.getElementById("challenge-status");

  const challengeStart =
    document.getElementById("challenge-start");

  const journeyDay =
    document.getElementById("journey-day");

  const teamPoints =
    document.getElementById("team-points");

  const teamPercent =
    document.getElementById("team-percent");

  const teamProgressBar =
    document.getElementById("team-progress-bar");

  const pointsEarned =
    document.getElementById("points-earned");

  const pointsGoal =
    document.getElementById("points-goal");

  const journeyMessage =
    document.getElementById("journey-message");


  // ========================================
  // FETCH ONE API RESPONSE
  // ========================================

  fetch(
    `${API_URL}?team=${encodeURIComponent(teamId)}&challenge=${encodeURIComponent(challengeId)}`
  )

    .then(response => response.json())

    .then(data => {

      console.log("API response:", data);


      // ========================================
      // VALIDATE RESPONSE
      // ========================================

      if (
        !data.success ||
        !data.challenge ||
        !data.team ||
        !data.scoreboard
      ) {

        console.error(
          "Challenge, Team, or Scoreboard data not found."
        );

        return;

      }


      const challenge =
        data.challenge;

      const team =
        data.team;

      const scoreboardData =
        data.scoreboard;


      // ========================================
      // TEAM + SPORT
      // ========================================

      if (teamNameElement) {

        teamNameElement.textContent =
          `${team["Team Name"]} · ${team["Sport"]}`;

      }


      // ========================================
      // CHALLENGE NAME
      // ========================================

      if (challengeNameElement) {

        challengeNameElement.textContent =
          challenge["Challenge Name"];

      }


      // ========================================
      // SCOREBOARD IDENTIFIERS
      // ========================================

      if (scoreboard) {

        scoreboard.dataset.teamId =
          teamId;

        scoreboard.dataset.challengeId =
          challengeId;

      }


      // ========================================
      // STATUS
      // ========================================

      if (challengeStatus) {

        const status =
          scoreboardData["Status"];

        if (status === "Active") {

          challengeStatus.textContent =
            "🟢 Active";

        } else if (status === "Completed") {

          challengeStatus.textContent =
            "🏆 Completed";

        } else if (status === "Not Started") {

          challengeStatus.textContent =
            "🟡 Not Started";

        } else {

          challengeStatus.textContent =
            status;

        }

      }


      // ========================================
      // START DATE
      // ========================================

      if (challengeStart) {

        const startDate =
          new Date(challenge["Start Date"]);

        challengeStart.textContent =
          `Starts ${startDate.toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric"
            }
          )}`;

      }


      // ========================================
      // CURRENT DAY
      // ========================================

      if (journeyDay) {

        journeyDay.textContent =
          `Day ${scoreboardData["Current Day"]} of ${scoreboardData["Days"]}`;

      }


      // ========================================
      // TEAM POINTS
      // ========================================

      if (teamPoints) {

        teamPoints.innerHTML =
          `${Number(
            scoreboardData["Team Points"]
          ).toLocaleString()}`
          + ` <span class="scoreboard-points-total">`
          + `/ ${Number(
            scoreboardData["Goal"]
          ).toLocaleString()} points`
          + `</span>`;

      }


      // ========================================
      // PERCENT COMPLETE
      // ========================================

      let percent =
        parseFloat(scoreboardData["% Complete"]);

      if (isNaN(percent)) {

        percent = 0;

      }

      // Handles either:
      // 63
      // or
      // 0.63

      if (percent > 0 && percent <= 1) {

        percent = percent * 100;

      }


      if (teamPercent) {

        teamPercent.textContent =
          `${percent.toFixed(0)}%`;

      }


      // ========================================
      // PROGRESS BAR
      // ========================================

      if (teamProgressBar) {

        teamProgressBar.style.width =
          `${Math.min(Math.max(percent, 0), 100)}%`;

      }


      // ========================================
      // PROGRESS NUMBERS
      // ========================================

      if (pointsEarned) {

        pointsEarned.textContent =
          `${Number(
            scoreboardData["Team Points"]
          ).toLocaleString()} points earned`;

      }


      if (pointsGoal) {

        pointsGoal.textContent =
          `${Number(
            scoreboardData["Goal"]
          ).toLocaleString()} point goal`;

      }


      // ========================================
      // JOURNEY MESSAGE
      // ========================================

      if (journeyMessage) {

        if (scoreboardData["Status"] === "Active") {

          journeyMessage.textContent =
            `Day ${scoreboardData["Current Day"]} is live. Keep the Reps moving.`;

        } else if (scoreboardData["Status"] === "Completed") {

          journeyMessage.textContent =
            "The team reached the finish line. Time to celebrate.";

        } else {

          journeyMessage.textContent =
            "Every Rep and every Journey counts.";

        }

      }


      // ========================================
      // DEBUG
      // ========================================

      console.log("RepFive routing successful.");

      console.log("Team:", team);

      console.log("Challenge:", challenge);

      console.log("Scoreboard:", scoreboardData);

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
