// ========================================
// CONFIGURATION
// ========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbxW0-5VPC3bEisqxFL7XktDUZci-OyykqF5Ddf-BQqxUQbOlXRG0zqS9jnnzcvGhAs/exec";
const DEBUG = false;

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

let isSubmitting = false;

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

if (isWeekend()) {
  showWeekend();
} else {
  loadRep();
}


// ========================================
// WEEKEND CHECK
// ========================================

function isWeekend() {

  const day =
    new Date().getDay();

  // 0 = Sunday
  // 6 = Saturday

  return day === 0 || day === 6;

}


// ========================================
// WEEKEND EXPERIENCE
// ========================================

function showWeekend() {

  loading.style.display =
    "none";

  errorBox.style.display =
    "block";

  errorBox.textContent =
    "Weekend mode 🌤️\nNo Rep today. Enjoy the day!";
}


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
    
    // CHALLENGE STATUS
    const challengeStatus = (data.challenge?.["Status"] || "").trim();

    if (DEBUG)
    {
        console.log("Challenge Status:", challengeStatus);
        console.log("Challenge Object:", data.challenge);
    }
    
    if (challengeStatus !== "Active") {
       throw new Error("This challenge is not Active.");
    }
    
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

  if (DEBUG) {
      console.log("RENDER REP DATA:", data);
      console.log("CHALLENGE:", data.challenge);
      console.log(
          "IMPACT PARTNER:",
          data.challenge?.["Impact Partner"]
      );
  }

  const rep =
    data.rep;
 
  // DAY

  const dayLabel = document.getElementById("dayLabel");
  const impactPartner = (data.challenge["Impact Partner"] || "").trim();

  dayLabel.innerHTML = `
    <div>Day ${data.currentDay} of ${data.challenge.Days}</div>
    ${
      impactPartner
        ? `<div class="powered-by">POWERED BY ${impactPartner}</div>`
        : ""
    }
  `;

  
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

  renderVideo(
  rep["Video URL"],
  rep["Start"],
  rep["End"]
);

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

let currentVideoEmbedUrl = null;


function renderVideo(url, start, end) {

  if (DEBUG) {
    console.log("Original URL:", url);
    console.log("Start:", start);
    console.log("End:", end);
  }

  const container =
    document.getElementById("videoContainer");

  const iframe =
    document.getElementById("repVideo");

  const replayButton =
    document.getElementById("replayVideoButton");


  if (!url) {

    iframe.removeAttribute("src");

    container.style.display =
      "none";

    if (replayButton) {
      replayButton.style.display =
        "none";
    }

    currentVideoEmbedUrl =
      null;

    return;
  }


  const embedUrl =
    getEmbedUrl(
      url,
      start,
      end
    );


  if (!embedUrl) {

    iframe.removeAttribute("src");

    container.style.display =
      "none";

    if (replayButton) {
      replayButton.style.display =
        "none";
    }

    currentVideoEmbedUrl =
      null;

    return;
  }


  if (DEBUG) {
    console.log(
      "Final Embed:",
      embedUrl
    );
  }


  currentVideoEmbedUrl =
    embedUrl;


  iframe.src =
    embedUrl;


  container.style.display =
    "block";


  if (replayButton) {

    replayButton.style.display =
      "inline-block";

  }

}


// ========================================
// REPLAY VIDEO
// ========================================
//
// Reloads the SAME YouTube embed URL.
//
// This causes the player to return to the
// configured Start position.
//
// It does NOT modify the YouTube video,
// creator settings, or source video.
//

function replayVideo() {

  const iframe =
    document.getElementById("repVideo");


  if (
    !iframe ||
    !currentVideoEmbedUrl
  ) {

    return;

  }


  // Remove the current player first.
  iframe.src =
    "";


  // Re-create the player on the next
  // browser rendering cycle.
  //
  // This reliably resets the YouTube
  // player to the configured start time.

  requestAnimationFrame(function() {

    iframe.src =
      currentVideoEmbedUrl;

  });

}


// ========================================
// REPLAY BUTTON
// ========================================

const replayVideoButton =
  document.getElementById(
    "replayVideoButton"
  );


if (replayVideoButton) {

  replayVideoButton.addEventListener(
    "click",
    replayVideo
  );

}


// ========================================
// CONVERT VIDEO URL TO EMBED URL
// ========================================
//
// Supports:
//
// YouTube standard:
// https://www.youtube.com/watch?v=VIDEO_ID
//
// YouTube Shorts:
// https://www.youtube.com/shorts/VIDEO_ID
//
// YouTube with existing parameters:
//
// https://www.youtube.com/watch?v=VIDEO_ID&start=50&end=250
//
// Google Sheet Start / End values override
// URL start/end values when supplied.
//
// Looping is explicitly disabled.
// ========================================

function getEmbedUrl(url, start, end) {

  try {

    const parsed =
      new URL(url);

    let videoId =
      null;


    // ------------------------------------
    // YOUTUBE
    // ------------------------------------

    if (
      parsed.hostname.includes("youtube.com")
    ) {

      // Standard YouTube URL
      videoId =
        parsed.searchParams.get("v");


      // YouTube Shorts
      if (!videoId) {

        const shortsMatch =
          parsed.pathname.match(
            /\/shorts\/([^/]+)/
          );

        if (shortsMatch) {
          videoId =
            shortsMatch[1];
        }

      }


      // Existing embed URL
      if (!videoId) {

        const embedMatch =
          parsed.pathname.match(
            /\/embed\/([^/]+)/
          );

        if (embedMatch) {
          videoId =
            embedMatch[1];
        }

      }

    }


    // ------------------------------------
    // YOUTUBE SHORT URL
    // ------------------------------------

    if (
      !videoId &&
      parsed.hostname === "youtu.be"
    ) {

      videoId =
        parsed.pathname.substring(1);

    }


    // ------------------------------------
    // NOT YOUTUBE
    // ------------------------------------

    if (!videoId) {

      return null;

    }


    // ------------------------------------
    // BUILD CLEAN EMBED URL
    // ------------------------------------

    const embed =
      new URL(
        "https://www.youtube-nocookie.com/embed/" +
        videoId
      );


    // ------------------------------------
    // START
    // ------------------------------------

    const startSeconds =
      parseVideoTime(start);


    if (startSeconds !== null) {

      embed.searchParams.set(
        "start",
        startSeconds
      );

    }


    // ------------------------------------
    // END
    // ------------------------------------

    const endSeconds =
      parseVideoTime(end);


    if (endSeconds !== null) {

      embed.searchParams.set(
        "end",
        endSeconds
      );

    }


    // ------------------------------------
    // NO LOOPING
    // ------------------------------------

    embed.searchParams.set(
      "loop",
      "0"
    );


    // ------------------------------------
    // PLAYER BEHAVIOR
    // ------------------------------------

    embed.searchParams.set(
      "playsinline",
      "1"
    );


    // ------------------------------------
    // PRIVACY-ENHANCED MODE
    // ------------------------------------

    // youtube-nocookie.com is already being
    // used above.
    //
    // No autoplay.
    // No playlist parameter.
    // Therefore the athlete controls playback.


    return embed.toString();

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
// PARSE VIDEO TIME
// ========================================
//
// Accepts:
//
// 50
// "50"
// "50s"
// "01:30"
// "1:30:00"
//
// Returns seconds or null.
// ========================================

function parseVideoTime(value) {

  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {

    return null;

  }


  const text =
    String(value).trim();


  // ------------------------------------
  // Plain number
  // ------------------------------------

  if (
    !isNaN(text)
  ) {

    const seconds =
      Number(text);

    return seconds >= 0
      ? Math.floor(seconds)
      : null;

  }


  // ------------------------------------
  // "50s"
  // ------------------------------------

  if (
    /^\d+(\.\d+)?s$/i.test(text)
  ) {

    const seconds =
      parseFloat(text);

    return seconds >= 0
      ? Math.floor(seconds)
      : null;

  }


  // ------------------------------------
  // MM:SS
  // ------------------------------------

  const parts =
    text.split(":");


  if (parts.length === 2) {

    const minutes =
      Number(parts[0]);

    const seconds =
      Number(parts[1]);


    if (
      !isNaN(minutes) &&
      !isNaN(seconds)
    ) {

      return (
        Math.floor(minutes * 60 + seconds)
      );

    }

  }


  // ------------------------------------
  // HH:MM:SS
  // ------------------------------------

  if (parts.length === 3) {

    const hours =
      Number(parts[0]);

    const minutes =
      Number(parts[1]);

    const seconds =
      Number(parts[2]);


    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      !isNaN(seconds)
    ) {

      return (
        Math.floor(
          hours * 3600 +
          minutes * 60 +
          seconds
        )
      );

    }

  }


  console.warn(
    "Unable to parse video time:",
    value
  );


  return null;

}



// ========================================
// ROSTER
// ========================================

function renderRoster(roster) {

  const select =
    document.getElementById("jersey");

  if (!select || !Array.isArray(roster)) {
    console.warn("No roster available.");
    return;
  }

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
    
  if (isSubmitting) {
    return;
  }
  
  if (!repData || !repData.rep) {

    alert(
      "Your Rep could not be loaded. Please refresh and try again."
    );

    return;
  }

  isSubmitting = true;

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

    isSubmitting = false;

    finishButton.disabled =
      false;

    finishButton.textContent =
      "Finish Rep → +20 Team Points";

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
