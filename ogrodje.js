vDom = 0;
counter = 0;
copyVDOM = 0;

function drawElement(element)
{
    const newElement = document.createElement(element.type);

    if (element.props.length != 0 && element.props.length != undefined)
        for (let i = 0; i < element.props.length; ++i) 
            newElement.setAttribute(element.props[i].type, element.props[i].value);

    for (let i = 0; i < element.children.length; ++i) {
        
        if (element.children[i].type == "text") {
            newElement.innerHTML = element.children[i].value;
        } else {
            const newElementChild = drawElement(element.children[i]);
            newElement.appendChild(newElementChild);
        }
    }

    return newElement;
}

function redrawElement(elementId, newElement)
{   
    let temp = performance.now();

    const element = document.getElementById(elementId);

    if (element !== undefined) {

        const replacementObj = drawElement(newElement);

        if (element !== null)
            element.parentNode.replaceChild(replacementObj, element);
    }

    counter += (performance.now() - temp);
}

function check()
{
    time1 = performance.now();
    vDom = diff(vDom, copyVDOM);
    console.log("Elapsed time: ", performance.now() - time1);

    console.log("Counter is: ", counter);
}

function diff(parentObj, newObj)
{
    //pridobivanje id parentObj
    let parentObjId = 0;

    for (let i = 0; i < parentObj.props.length; ++i) {
        if (parentObj.props[i].type === "id") {
            parentObjId = parentObj.props[i].value;
            break;
        }
    }

    //po potrebi zamenjamo oznako
    if (parentObj.type !== newObj.type) {

        parentObj.type = newObj.type;
        redrawElement(parentObjId, parentObj);
    }

    //po potrebi zamenjamo atribute
    if (JSON.stringify(parentObj.props) !== JSON.stringify(newObj.props)) {

        parentObj.props = newObj.props;
        redrawElement(parentObjId, parentObj);
    }

    //preverjanje otrok
    for (let i = 0; i < newObj.children.length; ++i) {

        if ((parentObj.children[i] === undefined || parentObj.children[i] === null) && newObj.children[i] !== undefined) {
            for (let j = 0; j < parentObj.props.length; ++j) {
                if (parentObj.props[j].type === "id") {

                    let temp = performance.now();
                    document.getElementById(parentObj.props[j].value).appendChild(drawElement(newObj.children[i]));
                    counter += (performance.now() - temp);

                    //dodaj k otrokom parentObj
                    parentObj.children.push(newObj.children[i]);

                    return parentObj;
                }
            }
        }

        //tekstovni element
        if (parentObj.children[i].props === undefined) {

            if (parentObj.children[i].type == "text" && parentObj.children[i].value !== newObj.children[i].value) {

                parentObj.children[i] = newObj.children[i];
                redrawElement(parentObjId, parentObj);
            }

            return parentObj;
        }

        for (let j = 0; j < parentObj.children[i].props.length; ++j) {

            if (parentObj.children[i].props[j].type === "id") {

                for (let k = 0; k < newObj.children[i].props.length; ++k) {

                    if (newObj.children[i].props[k].type === "id") {

                        if (parentObj.children[i].props[j].value === newObj.children[i].props[k].value) {

                            parentObj.children[i] = diff(parentObj.children[i], newObj.children[i]);

                        } else {
                            //element je bil dodan ali ne obstaja
                            let objToBeDeleted = document.getElementById(newObj.children[i].props[k].value);

                            //ne obstaja, dodaj
                            if (objToBeDeleted === undefined || objToBeDeleted === null) {
                                
                                //preveri, ali je kaj na tem mestu
                                let secondObj = document.getElementById(parentObj.children[i].props[j].value);

                                if (secondObj === undefined || secondObj === null) {
                                    parentObj.children[i] = newObj.children[i];
                                }
                                else {

                                    let temp = performance.now();
                                    secondObj.prepend(drawElement(newObj.children[i]));
                                    counter += (performance.now() - temp);

                                    parentObj.children.splice(i, 0, newObj.children[i]);
                                }

                                return parentObj;

                            } else {

                                let temp = performance.now();
                                objToBeDeleted.remove();
                                counter += (performance.now() - temp);

                                parentObj.children.splice(i, 1);
                                return parentObj;    
                            }
                        }

                        break;
                    }
                }

                break;
            }
        }
    }

    //ce je bil zadnji element izbrisan
    if (parentObj.children.length > newObj.children.length) {

        parentObj.children.pop();
        redrawElement(parentObjId, parentObj);
    }

    return parentObj;
}