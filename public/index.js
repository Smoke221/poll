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
      div.setAttribute("id", "question")

      let question = document.createElement("h3");
      question.textContent = e.question;

      div.append(question);

      e.options.forEach((option, index) => {
        let optionLabel = document.createElement("label");
        let optionInput = document.createElement("input");

        optionInput.type = "radio";
        optionInput.name = `question_${e._id}`;
        optionInput.value = option._id;

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
