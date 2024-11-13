vDom = {
    type: 'html',
    props: [
        {
            type: 'id',
            value: 'rootDOM'
        }
    ],
    children: [
        {
            type: 'head',
            props: [
                {
                    type: 'id',
                    value: 'head'
                }
            ],
            children: [
                {
                    type: 'title',
                    props: [
                        {
                            type: 'id',
                            value: 'title'
                        }
                    ],
                    children: [
                        {
                            type: 'text',
                            value: 'ST RV1'
                        }
                    ]
                }
            ]
        },
        {
            type: 'body',
            props: [
                {
                    type: 'id',
                    value: 'body'
                }
            ],
            children: [
                {
                    type: 'button',
                    props: [
                        {
                            type: 'type',
                            value: 'button'
                        },
                        {
                            type: 'onclick',
                            value: 'generateDifferences()'
                        },
                        {
                            type: 'id',
                            value: 'generateDifferencesButton'
                        }
                    ],
                    children: [
                        {
                            type: 'text',
                            value: 'Generate Differences'
                        }
                    ]
                },
                {
                    type: 'button',
                    props: [
                        {
                            type: 'type',
                            value: 'button'
                        },
                        {
                            type: 'onclick',
                            value: 'check()'
                        },
                        {
                            type: 'id',
                            value: 'diffButton'
                        }
                    ],
                    children: [
                        {
                            type: 'text',
                            value: 'Diff'
                        }
                    ]
                },
                {
                    type: 'br',
                    props: [
                        {
                            type: 'id',
                            value: 'br'
                        }
                    ],
                    children: []
                }
            ]
        }
    ]
};

const repetitions = 500;
const items = 10000;

//generiranje komentarjev in dodajanje v DOM
for (let i = 0; i < items; ++i) {

    let newElement = {
        type: "p",
        props: [
            {
                type: "id",
                value: "element" + (i + 1)
            }
        ],
        children: [
            {
                type: "text",
                value: "Element " + (i + 1)
            }
        ]
    }

    vDom.children[1].children.push(newElement);
}

//risanje DOM
const rootElement = document.getElementById("root");
rootElement.appendChild(drawElement(vDom));

function generateDifferences()
{
    copyVDOM = structuredClone(vDom);

    //generiranje unikatnih indeksov
    var randomNumberArray = [];

    while (randomNumberArray.length < repetitions) {

        let randomNumber = Math.floor((Math.random() * items) + 1);

        if (randomNumberArray.indexOf(randomNumber) === -1)
            randomNumberArray.push(randomNumber);
    }
    
    for (let i = 0; i < randomNumberArray.length; ++i) {

        //začnemo od 3, prvi trije elementi so dva gumba in <br>
        //-1, ker generiramo nakljucna stevila od 1 do 10000
        //s tem dostopamo do elementov iz obsega od 3 do 10002

        copyVDOM.children[1].children[randomNumberArray[i] + 2].props.push({
            type: 'style',
            value: 'background-color: #4CAF50;'
        });

        copyVDOM.children[1].children[randomNumberArray[i] + 2].children[0].value = "TEXT CHANGED";
    }
}