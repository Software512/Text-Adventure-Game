var gameFile = {
    "name": "template",
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
                "disableUndo": true
            }
        }
    }
}

document.body.appendChild(getScreenObject(gameFile.screens, "screens"))

function getScreenObject(object, name) {
    let newElement = document.createElement("details");
    newElement.setAttribute("open", "");
    newElement.id = name;
    const description = document.createElement("summary");
    description.appendChild(document.createTextNode(name));
    newElement.appendChild(description);
    let goesto = document.createElement("input");
    goesto.setAttribute("type", "checkbox");
    if (!Object.hasOwn(object, "goto")) {
        newElement.appendChild(goesto);
        if (Object.hasOwn(object, "header")) {
            let header = document.createElement("input");
            header.value = object.header;
            newElement.appendChild(header);
        }
        let text = document.createElement("input");
        text.value = object.text;
        newElement.appendChild(text);
        let type = document.createElement("input");
        type.setAttribute("type", "checkbox");
        if (object.type == "end") {
            type.setAttribute("checked", "checked");
            newElement.appendChild(type);
        } else {
            newElement.appendChild(type);
            const options = document.createElement("details");
            options.setAttribute("open", "");
            const optionsName = document.createElement("summary");
            optionsName.appendChild(document.createTextNode("options"));
            options.appendChild(optionsName);
            newElement.appendChild(options);
            for (childObject in object.options) {

                options.appendChild(getScreenObject(Object.getOwnPropertyDescriptor(object.options, childObject).value, childObject));
            }
        }
    } else {
        goesto.setAttribute("checked", "checked");
        newElement.appendChild(goesto);
        let goto = document.createElement("input");
        goto.value = object.goto;
        newElement.appendChild(goto);
    }



    return newElement;
}