var saveURL;
var gameFile;
// I never declared the variable "screens", but it exists.


function getScreenObject(object, name, currentpath) {
    const detailsElement = document.createElement("details")
    detailsElement.setAttribute("open", "");
    detailsElement.id = currentpath;
    const newElement = document.createElement("div");
    const description = document.createElement("summary");
    let goestoLabel;
    let goesto;
    if (currentpath != "screens") {
        const descriptionInput = document.createElement("input");
        descriptionInput.id = currentpath + ".descriptionInput";
        descriptionInput.value = currentpath.split(".").at(-1);
        description.appendChild(descriptionInput);
        const deleteButton = document.createElement("button");
        deleteButton.id = currentpath + ".deleteButton";
        deleteButton.appendChild(document.createTextNode("X"));
        description.appendChild(deleteButton);
        detailsElement.appendChild(description);
        let purposeLabel = document.createElement("label");
        purposeLabel.setAttribute("for", currentpath + ".purpose");
        purposeLabel.textContent = "Purpose: ";
        purposeLabel.id = currentpath + ".purposeLabel";
        newElement.appendChild(purposeLabel);
        let purpose = document.createElement("input");
        purpose.value = object.purpose;
        purpose.id = currentpath + ".purpose";
        newElement.appendChild(purpose);
        newElement.appendChild(document.createElement("br"));
        goestoLabel = document.createElement("label");
        goestoLabel.setAttribute("for", currentpath + ".goesto");
        goestoLabel.textContent = "Option goes to other screen: ";
        goestoLabel.id = currentpath + ".goestoLabel";
        newElement.appendChild(goestoLabel);
        goesto = document.createElement("input");
        goesto.setAttribute("type", "checkbox");
        goesto.id = currentpath + ".goesto";
    } else {
        description.appendChild(document.createTextNode("screens"));
        detailsElement.appendChild(description);
    }

    if (!Object.hasOwn(object, "goto")) {
        if (currentpath != "screens") {
            newElement.appendChild(goesto);
            newElement.appendChild(document.createElement("br"));
        }
        let headerLabel = document.createElement("label");
        headerLabel.setAttribute("for", currentpath + ".header");
        headerLabel.textContent = "Header: ";
        headerLabel.id = currentpath + ".headerLabel";
        newElement.appendChild(headerLabel);
        let header = document.createElement("input");
        header.id = currentpath + ".header";
        newElement.appendChild(header);
        if (Object.hasOwn(object, "header")) {
            header.value = object.header;
        }
        newElement.appendChild(document.createElement("br"));
        let textLabel = document.createElement("label");
        textLabel.setAttribute("for", currentpath + ".text");
        textLabel.textContent = "Text: ";
        textLabel.id = currentpath + ".textLabel";
        newElement.appendChild(textLabel);
        let text = document.createElement("textarea");
        text.value = object.text;
        text.id = currentpath + ".text";
        newElement.appendChild(text);
        newElement.appendChild(document.createElement("br"));
        let typeLabel = document.createElement("label");
        typeLabel.setAttribute("for", currentpath + ".type");
        typeLabel.textContent = "Is end screen: ";
        typeLabel.id = currentpath + ".typeLabel";
        newElement.appendChild(typeLabel);
        let type = document.createElement("input");
        type.setAttribute("type", "checkbox");
        type.id = currentpath + ".type";
        if (object.type == "end") {
            type.setAttribute("checked", "checked");
            newElement.appendChild(type);
        } else {
            newElement.appendChild(type);
            const options = document.createElement("details");
            options.setAttribute("open", "");
            const optionsName = document.createElement("summary");
            optionsName.appendChild(document.createTextNode("options "));
            const addOption = document.createElement("button");
            addOption.id = currentpath + ".addOption";
            addOption.appendChild(document.createTextNode("+"));
            optionsName.appendChild(addOption);
            options.appendChild(optionsName);
            newElement.appendChild(options);
            for (childObject in object.options) {
                let optionDiv = document.createElement("div");
                optionDiv.appendChild(getScreenObject(Object.getOwnPropertyDescriptor(object.options, childObject).value, childObject, currentpath + "." + childObject));
                options.appendChild(optionDiv);
            }
        }
    } else if (currentpath != "screens") {
        goesto.setAttribute("checked", "checked");
        newElement.appendChild(goesto);
        newElement.appendChild(document.createElement("br"));
        let gotoLabel = document.createElement("label");
        gotoLabel.setAttribute("for", currentpath + ".goto");
        gotoLabel.textContent = "Go to: ";
        gotoLabel.id = currentpath + ".gotoLabel";
        newElement.appendChild(gotoLabel);
        let goto = document.createElement("input");
        goto.value = object.goto;
        goto.id = currentpath + ".goto";
        newElement.appendChild(goto);
    }
    detailsElement.appendChild(newElement);
    return detailsElement;
}

document.getElementById("load").addEventListener("click", () => {
    if (!confirm("This will reset any unsaved work. Do you want to continue?")) {
        return;
    }
    document.getElementById("gameUpload").click();
});

document.getElementById("newGame").addEventListener("click", () => {
    if (!confirm("This will reset any unsaved work. Do you want to continue?")) {
        return;
    }
    newGame();
});

document.getElementById("gameUpload").addEventListener("input", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        try {
            gameFile = JSON.parse(reader.result);
            screens.remove();
            document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"));
        } catch {
            alert("Error in game file.");
        }
    }, false);

    if (file) {
        reader.readAsText(file);
    }
});

document.body.addEventListener("input", (e) => {
    if (e.target.id == "name") {
        if (e.target.value) {
            gameFile.name = e.target.value;
        } else {
            gameFile.name = "New Game";
        }
    } else if (e.target.id.endsWith(".header")) {
        getValueFromPath(e.target.id.slice(0, -7)).header = e.target.value;
    } else if (e.target.id.endsWith(".text")) {
        getValueFromPath(e.target.id.slice(0, -5)).text = e.target.value;
    } else if (e.target.id.endsWith(".purpose")) {
        getValueFromPath(e.target.id.slice(0, -8)).purpose = e.target.value;
    } else if (e.target.id.endsWith(".goesto")) {
        if (e.target.checked) {
            getValueFromPath(e.target.id.slice(0, -7)).goto = "screens";
            screens.remove();
            document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"))
        } else {
            Reflect.deleteProperty(getValueFromPath(e.target.id.slice(0, -7)), "goto");
            screens.remove();
            document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"))
        }
    } else if (e.target.id.endsWith(".type")) {
        if (e.target.checked) {
            getValueFromPath(e.target.id.slice(0, -5)).type = "end";
            screens.remove();
            document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"))
        } else {
            Reflect.deleteProperty(getValueFromPath(e.target.id.slice(0, -5)), "type");
            screens.remove();
            document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"))
        }
    } else if (e.target.id.endsWith(".goto")) {
        getValueFromPath(e.target.id.slice(0, -5)).goto = e.target.value;
    } else if (e.target.id.endsWith(".descriptionInput")) {
        if (!Object.hasOwn(getValueFromPath(e.target.parentElement.parentElement.id.replace(/\.[^.]*$/, "")).options, e.target.value)) {
            Object.defineProperty(getValueFromPath(e.target.parentElement.parentElement.id.replace(/\.[^.]*$/, "")).options, e.target.value, {
                value: getValueFromPath(e.target.parentElement.parentElement.id),
                configurable: true,
                enumerable: true,
            });
            Reflect.deleteProperty(getValueFromPath(e.target.parentElement.parentElement.id.replace(/\.[^.]*$/, "")).options, e.target.parentElement.parentElement.id.split(".")[e.target.parentElement.parentElement.id.split(".").length - 1]);
            var originalID = e.target.parentElement.parentElement.id;
            for (element of document.querySelectorAll("#" + CSS.escape(originalID) + " *, #" + CSS.escape(originalID))) {
                if (element.id) {
                    element.id = element.id.replace(originalID, originalID.replace(/\.[^.]*$/, "") + "." + e.target.value);
                }
            }
        }
    }
    updateSaveButton();
});

document.body.addEventListener("click", (e) => {
    if (e.target.id.endsWith(".deleteButton")) {
        Reflect.deleteProperty(getValueFromPath(e.target.parentElement.parentElement.id.replace(/\.[^.]*$/, "")).options, e.target.parentElement.parentElement.id.split(".")[e.target.parentElement.parentElement.id.split(".").length - 1]);
        screens.remove();
        document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"));
        updateSaveButton();
    } else if (e.target.id.endsWith(".addOption")) {
        let optionName = "newOption";
        let i = 1;
        while (Object.hasOwn(getValueFromPath(e.target.parentElement.parentElement.parentElement.parentElement.id).options, optionName + i)) {
            if (Object.hasOwn(getValueFromPath(e.target.parentElement.parentElement.parentElement.parentElement.id).options, optionName + i)) {
                i++
            }
        }
        optionName += i;
        Object.defineProperty(getValueFromPath(e.target.parentElement.parentElement.parentElement.parentElement.id).options, optionName, {
            value: { text: "", options: {}, purpose: "" },
            configurable: true,
            enumerable: true,
        });
        screens.remove();
        document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"));
        updateSaveButton();
    }
});

function getValueFromPath(path) {
    let object = gameFile;
    try {
        let i = 0;
        for (const property of path.split(".")) {
            object = Object.getOwnPropertyDescriptor(i > 0 ? object.options : object, property).value;
            i++;
        }
        return object;
    } catch {
        alert("The editor tried to access non-existent path in game file " + path + ".");
    }
}

function updateSaveButton() {
    if (saveURL) {
        URL.revokeObjectURL(saveURL);

    }
    saveURL = URL.createObjectURL(new Blob([JSON.stringify(gameFile)], { type: "application/json" }));
    document.getElementById("saveLink").href = saveURL;
    document.getElementById("saveLink").download = gameFile.name;
}

function newGame() {
    gameFile = {
        "name": "New Game",
        "screens": {
            "text": "Example",
            "header": "example",
            "options": {
                "door 1": {
                    "purpose": "open door 1",
                    "text": "Behind door 1 is a portal leading back to the beginning.",
                    "options": {
                        "continue": {
                            "purpose": "go through the portal",
                            "goto": "screens"
                        }
                    }
                },
                "Door 2": {
                    "purpose": "open door 2",
                    "type": "end",
                    "style": "death",
                    "text": "There was a lion behind the door and it ate you.",
                    "disableUndo": true,
                    "options": {}
                }
            }
        }
    }
    
    if (document.querySelector("#screens")) {
        screens.remove();
    }
    document.body.appendChild(getScreenObject(gameFile.screens, "screens", "screens"));
    updateSaveButton();
}

newGame();