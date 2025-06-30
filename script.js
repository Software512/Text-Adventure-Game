// Really uses error handling in this one, as a lot can go wrong with custom game files.

var gameFile;
var saveURL;
var test;

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

document.getElementById("quit").addEventListener("click", () => {
    document.getElementById("mainMenu").style.display = "";
    document.getElementById("playScreen").style.display = "none";
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
    document.getElementById("header").textContent = currentPathContents.header;
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
                    return;
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
    let style;
    if (Object.hasOwn(currentPathContents, "style")) {
        style = getValueFromPath("styles." + currentPathContents.style);
    } else if (Object.hasOwn(gameFile, "styles")) {
        if (Object.hasOwn(gameFile.styles, "default")) {
            style = gameFile.styles.default;
        }
    }
    if (JSON.stringify(style).includes(";")) {
        error("Game file attempted to inject disallowed code into the player.");
        return;
    }
    if (style != undefined) {
        // Very innefficient with code size but I'm too lazy.
        if (Object.hasOwn(style, "all")) {
            document.getElementById("playScreen").style.backgroundColor = Object.hasOwn(style.all, "backgroundColor") ? style.all.backgroundColor : "";
            document.getElementById("playScreen").style.color = Object.hasOwn(style.all, "color") ? style.all.color : "";
            document.getElementById("playScreen").style.fontFamily = Object.hasOwn(style.choices, "fontFamily") ? style.all.fontFamily : "";
            document.getElementById("playScreen").style.fontSize = Object.hasOwn(style.all, "fontSize") ? style.all.fontSize : "";
            document.getElementById("playScreen").style.fontStyle = Object.hasOwn(style.all, "fontStyle") ? style.all.fontStyle : "";
            document.getElementById("playScreen").style.fontVariant = Object.hasOwn(style.all, "fontVariant") ? style.all.fontVariant : "";
            document.getElementById("playScreen").style.fontWeight = Object.hasOwn(style.all, "fontWeight") ? style.all.fontWeight : "";
            document.getElementById("playScreen").style.letterSpacing = Object.hasOwn(style.all, "letterSpacing") ? style.all.letterSpacing : "";
            document.getElementById("playScreen").style.lineHeight = Object.hasOwn(style.all, "lineHeight") ? style.all.lineHeight : "";
            document.getElementById("playScreen").style.textDecorationColor = Object.hasOwn(style.all, "textDecorationColor") ? style.all.textDecorationColor : "";
            document.getElementById("playScreen").style.textDecorationLine = Object.hasOwn(style.all, "textDecorationLine") ? style.all.textDecorationLine : "";
            document.getElementById("playScreen").style.textDecorationStyle = Object.hasOwn(style.all, "textDecorationStyle") ? style.all.textDecorationStyle : "";
            document.getElementById("playScreen").style.textDecorationThickness = Object.hasOwn(style.all, "textDecorationThickness") ? style.all.textDecorationThickness : "";
            document.getElementById("playScreen").style.textShadow = Object.hasOwn(style.all, "textShadow") ? style.all.textShadow : "";
            document.getElementById("playScreen").style.textTransform = Object.hasOwn(style.all, "textTransform") ? style.all.textTransform : "";
            document.getElementById("playScreen").style.textUnderlineOffset = Object.hasOwn(style.all, "textUnderlineOffset") ? style.all.textUnderlineOffset : "";
        } else {
            document.getElementById("playScreen").style = "";
        }
        if (Object.hasOwn(style, "header")) {
            document.getElementById("header").style.backgroundColor = Object.hasOwn(style.header, "backgroundColor") ? style.header.backgroundColor : "";
            document.getElementById("header").style.color = Object.hasOwn(style.header, "color") ? style.header.color : "";
            document.getElementById("header").style.fontFamily = Object.hasOwn(style.choices, "fontFamily") ? style.header.fontFamily : "";
            document.getElementById("header").style.fontSize = Object.hasOwn(style.header, "fontSize") ? style.header.fontSize : "";
            document.getElementById("header").style.fontStyle = Object.hasOwn(style.header, "fontStyle") ? style.header.fontStyle : "";
            document.getElementById("header").style.fontVariant = Object.hasOwn(style.header, "fontVariant") ? style.header.fontVariant : "";
            document.getElementById("header").style.fontWeight = Object.hasOwn(style.header, "fontWeight") ? style.header.fontWeight : "";
            document.getElementById("header").style.letterSpacing = Object.hasOwn(style.header, "letterSpacing") ? style.header.letterSpacing : "";
            document.getElementById("header").style.lineHeight = Object.hasOwn(style.header, "lineHeight") ? style.header.lineHeight : "";
            document.getElementById("header").style.outlineColor = Object.hasOwn( style.header, "outlineColor") ?  style.header.outlineColor : "";
            document.getElementById("header").style.outlineOffset = Object.hasOwn( style.header, "outlineOffset") ?  style.header.outlineOffset : "";
            document.getElementById("header").style.outlineStyle = Object.hasOwn( style.header, "outlineStyle") ?  style.header.outlineStyle : "";
            document.getElementById("header").style.outlineWidth = Object.hasOwn( style.header, "outlineWidth") ?  style.header.outlineWidth : "";
            document.getElementById("header").style.textDecorationColor = Object.hasOwn(style.header, "textDecorationColor") ? style.header.textDecorationColor : "";
            document.getElementById("header").style.textDecorationLine = Object.hasOwn(style.header, "textDecorationLine") ? style.header.textDecorationLine : "";
            document.getElementById("header").style.textDecorationStyle = Object.hasOwn(style.header, "textDecorationStyle") ? style.header.textDecorationStyle : "";
            document.getElementById("header").style.textDecorationThickness = Object.hasOwn(style.header, "textDecorationThickness") ? style.header.textDecorationThickness : "";
            document.getElementById("header").style.textShadow = Object.hasOwn(style.header, "textShadow") ? style.header.textShadow : "";
            document.getElementById("header").style.textTransform = Object.hasOwn(style.header, "textTransform") ? style.header.textTransform : "";
            document.getElementById("header").style.textUnderlineOffset = Object.hasOwn(style.header, "textUnderlineOffset") ? style.header.textUnderlineOffset : "";
        } else {
            document.getElementById("header").style = "";
        }
        if (Object.hasOwn(style, "text")) {
            document.getElementById("text").style.backgroundColor = Object.hasOwn(style.text, "backgroundColor") ? style.text.backgroundColor : "";
            document.getElementById("text").style.color = Object.hasOwn(style.text, "color") ? style.text.color : "";
            document.getElementById("text").style.fontFamily = Object.hasOwn(style.text, "fontFamily") ? style.choices.text : "";
            document.getElementById("text").style.fontSize = Object.hasOwn(style.text, "fontSize") ? style.text.fontSize : "";
            document.getElementById("text").style.fontStyle = Object.hasOwn(style.text, "fontStyle") ? style.text.fontStyle : "";
            document.getElementById("text").style.fontVariant = Object.hasOwn(style.text, "fontVariant") ? style.text.fontVariant : "";
            document.getElementById("text").style.fontWeight = Object.hasOwn(style.text, "fontWeight") ? style.text.fontWeight : "";
            document.getElementById("text").style.letterSpacing = Object.hasOwn(style.text, "letterSpacing") ? style.text.letterSpacing : "";
            document.getElementById("text").style.lineHeight = Object.hasOwn(style.text, "lineHeight") ? style.text.lineHeight : "";
            document.getElementById("text").style.outlineColor = Object.hasOwn( style.text, "outlineColor") ?  style.text.outlineColor : "";
            document.getElementById("text").style.outlineOffset = Object.hasOwn( style.text, "outlineOffset") ?  style.text.outlineOffset : "";
            document.getElementById("text").style.outlineStyle = Object.hasOwn( style.text, "outlineStyle") ?  style.text.outlineStyle : "";
            document.getElementById("text").style.outlineWidth = Object.hasOwn( style.text, "outlineWidth") ?  style.text.outlineWidth : "";
            document.getElementById("text").style.textDecorationColor = Object.hasOwn(style.text, "textDecorationColor") ? style.text.textDecorationColor : "";
            document.getElementById("text").style.textDecorationLine = Object.hasOwn(style.text, "textDecorationLine") ? style.text.textDecorationLine : "";
            document.getElementById("text").style.textDecorationStyle = Object.hasOwn(style.text, "textDecorationStyle") ? style.text.textDecorationStyle : "";
            document.getElementById("text").style.textDecorationThickness = Object.hasOwn(style.text, "textDecorationThickness") ? style.text.textDecorationThickness : "";
            document.getElementById("text").style.textShadow = Object.hasOwn(style.text, "textShadow") ? style.text.textShadow : "";
            document.getElementById("text").style.textTransform = Object.hasOwn(style.text, "textTransform") ? style.text.textTransform : "";
            document.getElementById("text").style.textUnderlineOffset = Object.hasOwn(style.text, "textUnderlineOffset") ? style.text.textUnderlineOffset : "";
        } else {
            document.getElementById("text").style = "";
        }
        if (Object.hasOwn(style, "choices")) {
            document.getElementById("inputOptions").style.backgroundColor = Object.hasOwn(style.choices, "backgroundColor") ? style.choices.backgroundColor : "";
            document.getElementById("inputOptions").style.color = Object.hasOwn(style.choices, "color") ? style.choices.color : "";
            document.getElementById("inputOptions").style.fontFamily = Object.hasOwn(style.choices, "fontFamily") ? style.choices.fontFamily : "";
            document.getElementById("inputOptions").style.fontSize = Object.hasOwn(style.choices, "fontSize") ? style.choices.fontSize : "";
            document.getElementById("inputOptions").style.fontStyle = Object.hasOwn(style.choices, "fontStyle") ? style.choices.fontStyle : "";
            document.getElementById("inputOptions").style.fontVariant = Object.hasOwn(style.choices, "fontVariant") ? style.choices.fontVariant : "";
            document.getElementById("inputOptions").style.fontWeight = Object.hasOwn(style.choices, "fontWeight") ? style.choices.fontWeight : "";
            document.getElementById("inputOptions").style.letterSpacing = Object.hasOwn(style.choices, "letterSpacing") ? style.choices.letterSpacing : "";
            document.getElementById("inputOptions").style.lineHeight = Object.hasOwn(style.choices, "lineHeight") ? style.choices.lineHeight : "";
            document.getElementById("inputOptions").style.outlineColor = Object.hasOwn( style.choices, "outlineColor") ?  style.choices.outlineColor : "";
            document.getElementById("inputOptions").style.outlineOffset = Object.hasOwn( style.choices, "outlineOffset") ?  style.choices.outlineOffset : "";
            document.getElementById("inputOptions").style.outlineStyle = Object.hasOwn( style.choices, "outlineStyle") ?  style.choices.outlineStyle : "";
            document.getElementById("inputOptions").style.outlineWidth = Object.hasOwn( style.choices, "outlineWidth") ?  style.choices.outlineWidth : "";
            document.getElementById("inputOptions").style.textDecorationColor = Object.hasOwn(style.choices, "textDecorationColor") ? style.choices.textDecorationColor : "";
            document.getElementById("inputOptions").style.textDecorationLine = Object.hasOwn(style.choices, "textDecorationLine") ? style.choices.textDecorationLine : "";
            document.getElementById("inputOptions").style.textDecorationStyle = Object.hasOwn(style.choices, "textDecorationStyle") ? style.choices.textDecorationStyle : "";
            document.getElementById("inputOptions").style.textDecorationThickness = Object.hasOwn(style.choices, "textDecorationThickness") ? style.choices.textDecorationThickness : "";
            document.getElementById("inputOptions").style.textShadow = Object.hasOwn(style.choices, "textShadow") ? style.choices.textShadow : "";
            document.getElementById("inputOptions").style.textTransform = Object.hasOwn(style.choices, "textTransform") ? style.choices.textTransform : "";
            document.getElementById("inputOptions").style.textUnderlineOffset = Object.hasOwn(style.choices, "textUnderlineOffset") ? style.choices.textUnderlineOffset : "";
        } else {
            document.getElementById("inputOptions").style = "";
        }
    }
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