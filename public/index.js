const polls = document.getElementById("poll-container");

fetch("http://localhost:8000/polls", {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((resolved) => resolved.json())
  .then((data) => {
    const activePolls = data;
    polls.innerHTML = null;

    activePolls.forEach((e) => {
      let div = document.createElement("div");
      div.setAttribute("id", "question");

      let question = document.createElement("h3");
      question.textContent = e.question;

      div.append(question);

      e.options.forEach((option, index) => {
        let optionLabel = document.createElement("label");
        let optionInput = document.createElement("input");

        optionInput.type = "radio";
        optionInput.name = `question_${e._id}`;
        optionInput.value = index;

        optionLabel.textContent = option.option;

        optionLabel.appendChild(optionInput);
        div.appendChild(optionLabel);
      });

      let numOfVotes = document.createElement("p");
      voteCount(e._id)
        .then((totalVotes) => {
          numOfVotes.textContent = `${totalVotes} votes`;
        })
        .catch((error) => {
          console.error("Error fetching vote count:", error);
          numOfVotes.textContent = "Vote count unavailable";
        });

      let voteButton = document.createElement("button");
      voteButton.setAttribute("id", "voteBtn");
      voteButton.textContent = "Submit";
      voteButton.addEventListener("click", () => voteSubmit(e._id));

      div.append(numOfVotes, voteButton);

      polls.append(div);
    });
  });

function voteCount(pollId) {
  return fetch(`http://localhost:8000/polls/vote/count/${pollId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((resolved) => resolved.json())
    .then((data) => data.totalVotes)
    .catch((error) => {
      console.error("Error fetching vote count:", error);
      return 0;
    });
}

function openModal() {
  document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

const LoginWithGoogleButton = document.querySelector(".login-with-google-btn");

LoginWithGoogleButton.addEventListener("click", () => {
  window.location.href = "http://localhost:8000/auth/google";
});

function voteSubmit(pollId) {
  // Find the selected option index
  const selectedOptionIndex = document.querySelector(
    `input[name="question_${pollId}"]:checked`
  ).value;

  // Create the request body with the selected option index
  const requestBody = {
    optionIndex: selectedOptionIndex,
  };

  fetch(`http://localhost:8000/polls/${pollId}/vote`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Vote submission failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Error submitting vote:", error);
    });
}

var stateInput = document.querySelector("#stateInput");
var allStates = document.querySelectorAll(".dropdown-menu li");

stateInput.addEventListener("keyup", (e) => {
  var text = e.target.value
  var pat = new RegExp(text, 'i');

  //Show or hide the list based on whether ther's input
  document.querySelector(".dropdown-menu").style.display = text.trim() === '' ? "none" : "block";
  
  for(let i=0; i<allStates.length; i++){
    let state = allStates[i];
    if(pat.test(state.innerText)){
      state.classList.remove("hidden")
    }else{
      state.classList.add("hidden")
    }
  }
  
})