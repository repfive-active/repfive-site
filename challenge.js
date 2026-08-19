// ========================================
// REP FIVE — CHALLENGE PAGE
// Challenge + Team + Scoreboard + Journey
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  console.log("CHALLENGE JS VERSION: SCOREBOARD + JOURNEY + SUBMISSION 001");


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
  // JOURNEY TILES
  // ========================================

  const repTiles =
    document.querySelectorAll(".sport");


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


      const status =
        scoreboardData["Status"];


      const currentDay =
        Number(scoreboardData["Current Day"]);


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


        const formattedStartDate =
          startDate.toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric"
            }
          );


        if (
          status === "Active" ||
          status === "Completed"
        ) {

          challengeStart.textContent =
            `Started ${formattedStartDate}`;

        } else {

          challengeStart.textContent =
            `Starts ${formattedStartDate}`;

        }

      }


      // ========================================
      // CURRENT DAY
      // ========================================

      if (journeyDay) {

        journeyDay.textContent =
          `Day ${currentDay} of ${scoreboardData["Days"]}`;

      }


      // ========================================
      // CHALLENGE SUBMISSION URL
      // ========================================

      const submissionURL =
        challenge["Submission URL"];


      console.log(
        "Challenge Submission URL:",
        submissionURL
      );


      // ========================================
      // RESET JOURNEY TILES
      // ========================================

      repTiles.forEach(tile => {

        tile.classList.remove(
          "active",
          "clickable"
        );


        tile.removeAttribute(
          "role"
        );


        tile.removeAttribute(
          "tabindex"
        );


        const label =
          tile.querySelector(
            ".rep-active-label"
          );


        if (label) {

          label.style.display =
            "none";

        }


        // Remove any previous click handler
        tile.onclick = null;

      });


      // ========================================
      // ACTIVATE TODAY'S REP
      // ========================================

      if (
        status === "Active" &&
        currentDay >= 1 &&
        currentDay <= 10
      ) {

        const todayTile =
          document.querySelector(
            `.sport[data-rep-day="${currentDay}"]`
          );


        if (todayTile) {

          // ----------------------------------------
          // VISUAL ACTIVE STATE
          // ----------------------------------------

          todayTile.classList.add(
            "active"
          );


          const label =
            todayTile.querySelector(
              ".rep-active-label"
            );


          if (label) {

            label.style.display =
              "inline-flex";

          }


          // ----------------------------------------
          // MAKE TODAY'S TILE CLICKABLE
          // ----------------------------------------

          if (submissionURL) {

            todayTile.classList.add(
              "clickable"
            );


            todayTile.setAttribute(
              "role",
              "link"
            );


            todayTile.setAttribute(
              "tabindex",
              "0"
            );


            todayTile.setAttribute(
              "aria-label",
              "Take today's Rep"
            );


            // ----------------------------------------
            // MOUSE / TOUCH
            // ----------------------------------------

            todayTile.onclick = () => {

              console.log(
                "Opening Submission URL:",
                submissionURL
              );


              window.location.href =
                submissionURL;

            };


            // ----------------------------------------
            // KEYBOARD ACCESS
            // ----------------------------------------

            todayTile.addEventListener(
              "keydown",
              event => {

                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {

                  event.preventDefault();

                  window.location.href =
                    submissionURL;

                }

              }
            );


          } else {

            console.warn(
              "Today's Rep is active, but no Submission URL was provided."
            );

          }

        }

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
        parseFloat(
          scoreboardData["% Complete"]
        );


      if (isNaN(percent)) {

        percent = 0;

      }


      // Handles either:
      // 63
      // or
      // 0.63

      if (
        percent > 0 &&
        percent <= 1
      ) {

        percent =
          percent * 100;

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
          `${Math.min(
            Math.max(percent, 0),
            100
          )}%`;

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

        if (status === "Active") {

          journeyMessage.textContent =
            `Day ${currentDay} is live. Keep the Reps moving.`;

        } else if (status === "Completed") {

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

      console.log(
        "RepFive routing successful."
      );

      console.log(
        "Team:",
        team
      );

      console.log(
        "Challenge:",
        challenge
      );

      console.log(
        "Scoreboard:",
        scoreboardData
      );

      console.log(
        "Journey current day:",
        currentDay
      );

      console.log(
        "Journey status:",
        status
      );

      console.log(
        "Today's Submission URL:",
        submissionURL
      );

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
