var winWidth, winHeight;
var margin = 90; // Margin from canvas edge
var font = null;
var useEmail = false;
var swapInProgress = false;

var data = 
    {
        "phone": "222 555 6342",
        "company": "Pierce & Pierce",
        "duties": "MERGERS AND ACQUISITIONS",
        "name": "Patrick Bateman",
        "position": "Vice President",
        "street": "358 Exchange Place,",
        "cityAndState": "New York, N.Y.",
        "zip": "100099",
        "fax": "212 555 6388",
        "telex": "10 4534",
        "email": "pat@bateman.com"
    }

function GetFormData()
{
    var form = document.getElementById("form");
    var formData = new FormData(form);
   
    for (var pair of formData.entries()) 
    {
        console.log(pair[0]+ ', '+ pair[1]);
        data[pair[0]] = pair[1];
    }

    console.log(data);
    return data;
}

function preload() {

    font = loadFont('assets/fonts/Copperplate Gothic Bold Regular.ttf');
}

function setup()
{
    textFont(font);
    pixelDensity(3);
    var canParent = document.getElementById("canvasParent");
    winWidth = canParent.offsetWidth;
    winHeight = canParent.offsetHeight;
    var myCanvas = createCanvas(winWidth, winHeight);
    myCanvas.parent(canParent);
}

function draw() 
{
    background(000);
    background(255);
    // set phone number
    textSize(32);
    text(data.phone, margin, margin);

    // set company name
    var w = textWidth(data.company);
    text(data.company, winWidth-(margin+w), margin);

    // set duties
    textSize(16);
    w = textWidth(data.duties);
    var compWidth = textWidth(data.company);
    var companyDiff = Math.abs(compWidth - w);

    text(data.duties, winWidth-(margin+compWidth+(w/2)), margin+30);

    // set name
    textSize(32);
    var lastName = data.name.split(" ");
    lastName = lastName.length > 1 ? lastName[1] : "LastNameMissing";
    var name = data.name.split(" ")[0] + " " + lastName.toUpperCase();
    w = textWidth(name);
    text(name, (winWidth/2)-w/2, winHeight/2);

    // set position
    textSize(24);

    // capitalize first letter of each word
    var finalName = "";
    var position = data.position.split(" ").forEach(function(word) { finalName += word.charAt(0).toUpperCase() + word.slice(1) + " "; });
    data.position = finalName.trim();

    w = textWidth(data.position);
    text(data.position, (winWidth/2)-w/2, (winHeight/2) + margin/2); 

    textSize(19);
    tSize = 19;

    // set bottom text 
    if (!useEmail)
    {
    var bottomText = `${data.street},  ${data.cityAndState}  ${data.zip}  FAX:  ${data.fax}  TELEX:  ${data.telex}`;
    }
    else
    {
        var bottomText = `${data.street},  ${data.cityAndState}  ${data.zip}  EMAIL:  ${data.email}`;
    }
    var bottomTextWidth = textWidth(bottomText);
    text(bottomText, (winWidth/2)-(bottomTextWidth/2), winHeight-margin);
}


function SaveImage()
{
    saveCanvas(`${data.name}_AmericanPsycho`, 'jpg');
}

// If use email checkbox is checked, swap the email with the fax and hide the telex field
function swapEmail()
{
    if (useEmail)
    {
        var fax = document.getElementById("faxLabel");
        
        var faxField = document.getElementById("fax");
        
        // update fax field to email
        faxField.setAttribute("id", "email");
        faxField.setAttribute("name", "email");

        var telex = document.getElementById("telex");
       
        //hide telex 
        telex.style.display = "none";

        // remove required attribute from telex
        document.getElementById("telex").removeAttribute("required");

        document.getElementById("telexLabel").style.display = "none";
        // update fax label to email
        fax.innerHTML = "Email";
        fax.setAttribute("for", "email");
        fax.setAttribute("id", "emailLabel");
    }
    else
    {
        var fax = document.getElementById("emailLabel");
        var telex = document.getElementById("telex");
        
        // update fax field to email
        var emailField = document.getElementById("email");
        emailField.setAttribute("id", "fax");
        emailField.setAttribute("name", "fax");
 
        //show telex 
        telex.style.display = "block";
        document.getElementById("telexLabel").style.display = "block";

        // add required attribute to telex
        document.getElementById("telex").setAttribute("required", "true");

        // update fax label to email
        fax.innerHTML = "Fax";
        fax.setAttribute("for", "fax");
        fax.setAttribute("id", "faxLabel"); 
    }
    swapInProgress = false;
}

timeout = setTimeout(function()
    {
        console.log("Timeout");

        // Add event listener to radio buttons
        var radioButtons = document.querySelectorAll('input[type=radio][name="useType"]');
        radioButtons.forEach(function(radioButton)
            {
                radioButton.addEventListener("change", function()
                    {
                        console.log("Radio button changed");
                        console.log(this.id);
                        useEmail = this.id === "useEmail"
                        swapInProgress = true;
                        swapEmail();
                    });
            });

        document.getElementById("save").addEventListener("click", function()
            {
                console.log("Save button clicked");
                SaveImage();
            });

        document.getElementById("form").addEventListener("submit", function(event)
            {
                event.preventDefault();
                console.log("Form submitted");
                data = GetFormData();
            });

    }, 1000);
