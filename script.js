const runButton = document.getElementById("runButton");
const resetButton = document.getElementById("resetButton");
const pipelineStatus = document.getElementById("pipelineStatus");
const logOutput = document.getElementById("logOutput");
const historyList = document.getElementById("historyList");

const stageNames = [
"Checkout",
"Build",
"Test",
"Docker",
"Deploy"
];

let isRunning = false;
let runCount = 0;
let runHistory = [];

function wait(milliseconds) {
return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function addLog(message) {
const line = document.createElement("p");
line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
logOutput.appendChild(line);
logOutput.scrollTop = logOutput.scrollHeight;
}

function setStage(index, state, label) {
const stage = document.getElementById(`stage${index + 1}`);

```
stage.className = "stage";
stage.classList.add(state);
stage.querySelector(".status").textContent = label;
```

}

function resetStages() {
stageNames.forEach((name, index) => {
setStage(index, "", "Pending");
});

```
pipelineStatus.textContent = "Not Started";
```

}

function updateHistory(result) {
runHistory.unshift(result);
runHistory = runHistory.slice(0, 10);

```
historyList.replaceChildren();

runHistory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
});
```

}

async function runPipeline() {
if (isRunning) return;

```
isRunning = true;
runButton.disabled = true;
resetButton.disabled = true;

runCount++;
logOutput.replaceChildren();

resetStages();
pipelineStatus.textContent = "Running";

addLog(`Pipeline run #${runCount} started.`);

try {
    for (let i = 0; i < stageNames.length; i++) {
        const stageName = stageNames[i];

        setStage(i, "running", "Running...");
        addLog(`${stageName}: Started.`);

        await wait(1200);

        setStage(i, "success", "Success");
        addLog(`${stageName}: Completed successfully.`);
    }

    pipelineStatus.textContent = "Success";
    addLog("Pipeline completed successfully!");

    updateHistory(
        `Run #${runCount} — Success — ${new Date().toLocaleString()}`
    );

} catch (error) {
    pipelineStatus.textContent = "Failed";
    addLog("Pipeline failed.");
} finally {
    isRunning = false;
    runButton.disabled = false;
    resetButton.disabled = false;
}
```

}

function resetPipeline() {
if (isRunning) return;

```
resetStages();
logOutput.replaceChildren();

const message = document.createElement("p");
message.textContent = "Waiting for pipeline execution...";
logOutput.appendChild(message);
```

}

runButton.addEventListener("click", runPipeline);
resetButton.addEventListener("click", resetPipeline);
