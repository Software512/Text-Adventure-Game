// Really uses error handling in this one, as a lot can go wrong with custom game files.

var gameFile;
var saveURL;

document.getElementById("gameUpload").addEventListener("input", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        try {
            gameFile = JSON.parse(reader.result);
            try {
                document.getElementById("fileInfo").innerText = gameFile.name + "\n(" + e.target.files[0].name + ")";
                document.getElementById("play").disabled = false;
                if (!gameFile.progress || String(gameFile.progress) == String(["screens"])) {
                    gameFile.progress = ["screens"];
                    document.getElementById("save").disabled = true;
                    document.getElementById("reset").disabled = true;
                } else {
                    updateSaveButton();
                };
            } catch {
                alert("Game file does not have a name set.")
            }
        } catch {
            alert("Error in game file.");
        }
    }, false);

    if (file) {
        reader.readAsText(file);
    }
});

document.getElementById("uploadButton").addEventListener("click", () => {
    if (gameFile) {
        if (String(gameFile.progress) != String(["screens"])) {
            if (!confirm("This will reset any unsaved progress. Do you want to continue?")) {
                return;
            }
        }
    }
    document.getElementById("gameUpload").click();
});

document.getElementById("play").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "none";
    document.getElementById("playScreen").style.display = "";
    getScreen();
});

document.getElementById("reset").addEventListener("click", () => {
    if (confirm("This will reset any unsaved progress. Do you want to continue?")) {
        gameFile.progress = ["screens"];
        document.getElementById("save").disabled = true;
        document.getElementById("reset").disabled = true;
    }
});

function getValueFromPath(path) {
    let object = gameFile;
    try {
        for (const property of path.split(".")) {
            object = Object.getOwnPropertyDescriptor(object, property).value;
        }
        return object;
    } catch {
        alert("The game tried to access non-existent path in game file " + path + ".");
    }
}

function error(message) {
    alert(message);
    document.getElementById("mainMenu").style.display = "";
    document.getElementById("playScreen").style.display = "none";
    document.getElementById("save").disabled = true;
    document.getElementById("reset").disabled = true;
    document.getElementById("fileInfo").innerText = "No file chosen"
}

function getScreen() {
    const currentPathContents = getValueFromPath(gameFile.progress[gameFile.progress.length - 1]);
    document.getElementById("text").innerText = currentPathContents.text;
    let optionsText = "Type ";
    if (currentPathContents.type == "end") {
        optionsText += "quit to exit the game or restart to start over."
    } else if (currentPathContents.options) {
        if (Object.keys(currentPathContents.options).length) {
            let i = 0;
            const options = currentPathContents.options;
            for (const option of Object.entries(options)) {
                if (option[1].purpose) {
                    if (i == Object.keys(options).length - 1 && i > 0) {
                        optionsText += "or " + option[0] + " to " + option[1].purpose + ".";
                    } else if (Object.keys(options).length == 1) {
                        optionsText += option[0] + " to " + option[1].purpose + ".";
                    } else {
                        optionsText += option[0] + " to " + option[1].purpose + ", ";
                    }
                    i++
                } else {
                    error("No purpose for " + option[0] + ".");
                }
            }
        } else {
            error("No options were found.");
            return;
        }
    } else {
        error("No options were found.");
        return;
    }
    if (
        ((Object.hasOwn(currentPathContents, "disableUndo") && !currentPathContents.disableUndo) || (!Object.hasOwn(currentPathContents, "disableUndo") && !gameFile.disableUndo)) && gameFile.progress.length > 1) {
        optionsText += "\nType go back to undo the last choice.";
    }
    document.getElementById("inputOptions").innerText = optionsText;
}

document.getElementById("input").addEventListener("keydown", (e) => {
    let currentPathContents = getValueFromPath(gameFile.progress[gameFile.progress.length - 1]);
    if (e.key == "Enter") {
        if (e.target.value.toLowerCase() == "quit") {
            document.getElementById("mainMenu").style.display = "";
            document.getElementById("playScreen").style.display = "none";
        } else if (e.target.value.toLowerCase() == "restart") {
            if (confirm("This will reset any unsaved progress. Do you want to continue?")) {
                gameFile.progress = ["screens"];
                getScreen();
                updateSaveButton();
            }
        } else if (((Object.hasOwn(currentPathContents, "disableUndo") && !currentPathContents.disableUndo) || (!Object.hasOwn(currentPathContents, "disableUndo") && !gameFile.disableUndo)) && e.target.value.toLowerCase() == "go back" && gameFile.progress.length > 1) {
            gameFile.progress.pop();
            getScreen();
            updateSaveButton();
        } else if (String(Object.keys(currentPathContents.options)).toLowerCase().split(",").includes(e.target.value.toLowerCase())) {
            gameFile.progress.push(gameFile.progress[gameFile.progress.length - 1] + ".options." + Object.keys(currentPathContents.options).at(String(Object.keys(currentPathContents.options)).toLowerCase().split(",").indexOf(e.target.value.toLowerCase())));
            currentPathContents = getValueFromPath(gameFile.progress[gameFile.progress.length - 1]);
            if (currentPathContents.goto) {
                gameFile.progress.pop();
                console.log(currentPathContents.goto);
                gameFile.progress.push(currentPathContents.goto);
            }
            getScreen();
            updateSaveButton();
        } else {
            alert("Please type a valid option shown.");
        }

        document.getElementById("input").value = "";
    }
});

function updateSaveButton() {
    if (String(gameFile.progress) != String(["screens"])) {
        document.getElementById("save").disabled = false;
        document.getElementById("reset").disabled = false;
        if (saveURL) {
            URL.revokeObjectURL(saveURL);

        }
        saveURL = URL.createObjectURL(new Blob([JSON.stringify(gameFile)], { type: "application/json" }));
        document.getElementById("saveLink").href = saveURL;
        document.getElementById("saveLink").download = gameFile.name + "-save";
    } else {
        document.getElementById("save").disabled = true;
        document.getElementById("reset").disabled = true;
    }
}