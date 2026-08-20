// ========================================
// CONFIGURATION
// ========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbxW0-5VPC3bEisqxFL7XktDUZci-OyykqF5Ddf-BQqxUQbOlXRG0zqS9jnnzcvGhAs/exec";


// ========================================
// URL PARAMETERS
// ========================================

const params =
  new URLSearchParams(window.location.search);

const teamId =
  params.get("team");

const challengeId =
  params.get("challenge");


// ========================================
// STATE
// ========================================

let repData = null;

let currentPage = 1;


// ========================================
// ELEMENTS
// ========================================

const loading =
  document.getElementById("loading");

const errorBox =
  document.getElementById("error");


// ========================================
// INITIALIZE
// ========================================

loadRep();


// ========================================
// LOAD TODAY'S REP
// ========================================

async function loadRep() {

  if (!teamId || !challengeId) {

    showError(
      "This Rep link is missing the team or challenge."
    );

    return;

  }


  const url =
    API_URL +
    "?endpoint=rep" +
    "&team=" +
    encodeURIComponent(teamId) +
    "&challenge=" +
    encodeURIComponent(challengeId);


  try {

    const response =
      await fetch(url);

    if (!response.ok) {

      throw new Error(
        "Unable to load today's Rep."
      );

    }


    const data =
      await response.json();


    if (!data.success) {

      throw new Error(
        data.error ||
        "Unable to load today's Rep."
      );

    }


    repData = data;

    renderRep(data);

    showPage(1);

  } catch (error) {

    console.error(error);

    showError(
      error.message ||
      "Something went wrong loading today's Rep."
    );

  }

}


// ========================================
// RENDER REP
// ========================================

function renderRep(data) {

  const rep =
    data.rep;


  // DAY

  document.getElementById("dayLabel").textContent =
    `Day ${data.currentDay} of ${data.challenge.Days}`;


  // REP NUMBER

  document.getElementById("repNumber").textContent =
    String(data.scheduledRep["Rep #"])
      .padStart(2, "0");


  // REP NAME

  document.getElementById("repName").textContent =
    rep["Rep Name"];


  // CORE IDEA

  document.getElementById("repCore").textContent =
    rep["Core Idea"];


  // COACH TAKEAWAY

  if (rep["Coach Takeaway"]) {

    document.getElementById(
      "coachTakeawayText"
    ).textContent =
      rep["Coach Takeaway"];

    document.getElementById(
      "coachTakeaway"
    ).style.display =
      "block";

  }


  // VIDEO
  //renderVideo(
  //  rep["Video URL"]
  //);
  
  // VIDEO

  renderVideo(rep);

  // JERSEYS

  renderRoster(
    data.roster
  );



  // QUESTIONS

  renderQuestion(
    1,
    rep
  );

  renderQuestion(
    2,
    rep
  );

}


// ========================================
// VIDEO
// ========================================

function renderVideo(rep) {

  const container =
    document.getElementById("videoContainer");

  const iframe =
    document.getElementById("repVideo");

  const videoUrl =
    String(rep["Video URL"] || "").trim();


  // No video

  if (!videoUrl) {

    container.style.display = "none";

    return;

  }


  const embedUrl =
    getEmbedUrl(videoUrl);


  // If we can't determine an embed URL,
  // don't show a broken player.

  if (!embedUrl) {

    container.style.display = "none";

    return;

  }


  iframe.src =
    embedUrl;

  container.style.display =
    "block";

}


// ========================================
// CONVERT VIDEO URL TO EMBED URL
// ========================================

function getEmbedUrl(url) {

  try {

    const parsed =
      new URL(url);


    // ------------------------------------
    // YOUTUBE
    // ------------------------------------

    if (
      parsed.hostname.includes("youtube.com")
    ) {

      // Already an embed URL

      if (
        parsed.pathname.startsWith("/embed/")
      ) {

        return url;

      }


      // Standard YouTube URL

      const videoId =
        parsed.searchParams.get("v");

      if (videoId) {

        return (
          "https://www.youtube.com/embed/" +
          videoId
        );

      }


      // YouTube Shorts

      const shortsMatch =
        parsed.pathname.match(
          /\/shorts\/([^/]+)/
        );

      if (shortsMatch) {

        return (
          "https://www.youtube.com/embed/" +
          shortsMatch[1]
        );

      }

    }


    // ------------------------------------
    // YOUTUBE SHORT URL
    // ------------------------------------

    if (
      parsed.hostname === "youtu.be"
    ) {

      const videoId =
        parsed.pathname.substring(1);

      if (videoId) {

        return (
          "https://www.youtube.com/embed/" +
          videoId
        );

      }

    }


    // ------------------------------------
    // VIMEO
    // ------------------------------------

    if (
      parsed.hostname.includes("vimeo.com")
    ) {

      const match =
        parsed.pathname.match(
          /\/(\d+)/
        );

      if (match) {

        return (
          "https://player.vimeo.com/video/" +
          match[1]
        );

      }

    }


    // ------------------------------------
    // ALREADY EMBEDDED / OTHER PROVIDER
    // ------------------------------------

    if (
      parsed.pathname.includes("/embed/")
    ) {

      return url;

    }


    // ------------------------------------
    // UNKNOWN PROVIDER
    // ------------------------------------

    // Try the supplied URL directly.

    return null;

  }

  catch (error) {

    console.error(
      "Invalid video URL:",
      url
    );

    return null;

  }

}


// ========================================
// ROSTER
// ========================================

function renderRoster(roster) {

  const select =
    document.getElementById("jersey");


  roster.forEach(jersey => {

    const option =
      document.createElement("option");

    option.value =
      jersey;

    option.textContent =
      jersey;

    select.appendChild(option);

  });

}


// ========================================
// QUESTIONS
// ========================================

function renderQuestion(number, rep) {

  const question =
    rep[`Question ${number}`];


  const title =
    document.getElementById(
      `question${number}Title`
    );


  const answers =
    document.getElementById(
      `question${number}Answers`
    );


  if (!question) {

    document.getElementById(
      `question${number}`
    ).style.display =
      "none";

    return;

  }


  title.textContent =
    question;


  answers.innerHTML =
    "";


  const letters =
    ["A", "B", "C", "D"];


  letters.forEach(letter => {

    const answer =
      rep[
        `Answer ${number}${letter}`
      ];


    if (!answer) {
      return;
    }


    const label =
      document.createElement("label");

    label.className =
      "answer-option";


    const input =
      document.createElement("input");

    input.type =
      "radio";

    input.name =
      `q${number}`;

    input.value =
      answer;

    input.required =
      true;


    const letterSpan =
      document.createElement("span");

    letterSpan.className =
      "answer-letter";

    letterSpan.textContent =
      letter;


    const answerSpan =
      document.createElement("span");

    answerSpan.textContent =
      answer;


    label.appendChild(input);

    label.appendChild(letterSpan);

    label.appendChild(answerSpan);


    answers.appendChild(label);

  });

}


// ========================================
// PAGE 1 NEXT
// ========================================

document
  .getElementById("page1Next")
  .addEventListener(
    "click",
    function() {

      const jersey =
        document
          .getElementById("jersey")
          .value;


      if (!jersey) {

        alert(
          "Please select your jersey number."
        );

        return;

      }


      showPage(2);

    }
  );


// ========================================
// PAGE 2 BACK
// ========================================

document
  .getElementById("page2Back")
  .addEventListener(
    "click",
    function() {

      showPage(1);

    }
  );


// ========================================
// PAGE 2 NEXT
// ========================================

document
  .getElementById("page2Next")
  .addEventListener(
    "click",
    function() {

      const q1 =
        document.querySelector(
          'input[name="q1"]:checked'
        );

      const q2 =
        document.querySelector(
          'input[name="q2"]:checked'
        );


      // Require both answers

      if (!q1 || !q2) {

        alert(
          "Please answer both questions before continuing."
        );

        return;

      }


      // Both answered

      showPage(3);

    }
  );


// ========================================
// FINISH
// ========================================

document
  .getElementById("finishButton")
  .addEventListener(
    "click",
    submitRep
  );


// ========================================
// SUBMIT
// ========================================

async function submitRep() {

  const finishButton =
    document.getElementById(
      "finishButton"
    );


  finishButton.disabled =
    true;

  finishButton.textContent =
    "Saving Rep...";


  const jersey =
    document
      .getElementById("jersey")
      .value;


  const q1 =
    getSelectedValue("q1");


  const q2 =
    getSelectedValue("q2");


  const parentCheckIn =
    document
      .getElementById("parentCheckIn")
      .checked;


  const parentFeedback =
    getSelectedValue(
      "parentFeedback"
    );


  const parentNotes =
    document
      .getElementById("parentNotes")
      .value
      .trim();


  const payload = {

    teamId:
      teamId,

    challengeId:
      challengeId,

    day:
      repData.currentDay,

    repId:
      repData.rep["Rep ID"],

    jersey:
      jersey,

    q1Answer:
      q1,

    q2Answer:
      q2,

    parentCheckIn:
      parentCheckIn
        ? "I saw my athlete complete today's Rep."
        : "",

    parentHomeFeedback:
      parentFeedback,

    parentNotes:
      parentNotes

  };


  try {

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(payload)
        }
      );


    const result =
      await response.json();


    if (!result.success) {

      throw new Error(
        result.error ||
        "Unable to save your Rep."
      );

    }


    showPage(4);


  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "Something went wrong. Please try again."
    );


    finishButton.disabled =
      false;

    finishButton.textContent =
      "Finish Rep";

  }

}


// ========================================
// GET SELECTED VALUE
// ========================================

function getSelectedValue(name) {

  const selected =
    document.querySelector(
      `input[name="${name}"]:checked`
    );


  return selected
    ? selected.value
    : "";

}


// ========================================
// SHOW PAGE
// ========================================

function showPage(pageNumber) {

  currentPage =
    pageNumber;


  document
    .querySelectorAll(".page-panel")
    .forEach(panel => {

      panel.classList.remove(
        "active"
      );

    });


  const page =
    document.getElementById(
      `page${pageNumber}`
    );


  if (page) {

    page.classList.add(
      "active"
    );

  }


  loading.style.display =
    "none";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// ERROR
// ========================================

function showError(message) {

  loading.style.display =
    "none";


  errorBox.textContent =
    message;


  errorBox.style.display =
    "block";

}
