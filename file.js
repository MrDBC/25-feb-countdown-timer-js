let isPaused= true;
let timeAtStart ;
let timeLeft = 0;
let cntClicks=0;
const url = window.location.href


hrInput= document.getElementById('hrs-input')
minInput = document.getElementById('mins-input');
secInput = document.getElementById('secs-input');

const pause=()=> isPaused= true;

const start=()=>{

    // cntClicks count the no of clicks on the start button done so far
    // it will decide the state and what is displayed on the button (i.e., innerText)
    // if the no of clicks are odd, the state is running and (PAUSE is displayed on the button)
    // if the no of clicks are even, the staet is on hold & (RESUME is displayed on the button)
    cntClicks = !cntClicks;
    const startButton = document.getElementById('start-button')

    if( cntClicks%2 !=0 ){      // running state
        startButton.innerText= 'pause' 
    }else{                      // paused state
        pause();
        startButton.innerText= 'resume'
        return;
    }

    
        
    // get the values enterd by the user on the input boxes
    let hr = hrInput.value ;
    let min = minInput.value;
    let sec = secInput.value;

    // check for non - numeric invalid inputs 
    if( isNaN(hr) || isNaN(min) || isNaN(sec)){
        alert('input provided should be numbers')
        reset()
        return;
    }

    // calculate the total no of seconds at the start
    // this statement executes only once (at the beginning)
    timeLeft =  Number(hr)*3600 + Number(min)*60 + Number(sec) ; 

    // this variable should be constant once initialized 
    // ( im using this for knowing when to disable input boxes) (we will know about it later)
    if( timeAtStart == undefined)
        timeAtStart = timeLeft;

    // more checks for going out of bounds: both lower limit & upper limit checks
    // and display alert msgs appropriately
    let boolNegative = ( Math.min(min, Math.min(hr, sec)) ) < 0 ;
    let boolExceeding60 = Math.max(min, sec) > 59;

    if( boolNegative && !boolExceeding60)
        alert("input values can't be negative. try again!!!")            
    else if( !boolNegative && boolExceeding60)
        alert("minutes and/or seconds values cant exceed 59. try again!!!")
    else if( boolNegative && boolExceeding60)
        alert("input values can't be negative & minutes and/or seconds values cant exceed 59.  try again!!!")   
    
    // reload the page to take in fresh inputs again
    if( boolNegative || boolExceeding60){
        reset();
        return;
    }   

    // after checking for all invalid inputs, we can safely start our
    // setInterval function 
    isPaused= false
    
}

// setInterval function : this is the main function that does the countDOWN
let countdown = setInterval(()=> {
       
    // only count-down when the "isPaused" is disabled, (i.e, we are in start/resume state)
    if(!isPaused){

        // once we run out of time, do 3 things: 1. popup msg with sound 2.clear setInterval
        // 3. return (otherwise negative values will be printed on the input boxes)
        if( timeLeft == 0){
            soundAndPopup() ;
            clearInterval(countdown);
            return; 
        }

        // for intermediate time we want the input field to be disabled for the users
        if( timeLeft <= timeAtStart){
            hrInput.disabled = true;
            minInput.disabled = true;
            secInput.disabled = true;
        }
        // do every 1 second or 1000 millisecond
        timeLeft -=1;

        // re-calculate the new hr, min & sec values ; and
        // put them back for display in the input boxes
        let hr = Math.floor(timeLeft/3600);
        let min = Math.floor( (timeLeft- (hr * 3600))/ 60 );
        let sec = Math.floor((timeLeft- (hr*3600 + min * 60)));
        // console.log(hr, min, sec)

        hrInput.value = hr.toString().padStart(2,'0');
        minInput.value = min.toString().padStart(2,'0');
        secInput.value = sec.toString().padStart(2,'0');
    }
    

}, 1000);


const soundAndPopup=()=>{
    const alarm = document.getElementById('alarm-audio');

    // play audio in loop till user clicks on "dismiss"
    alarm.play();
    alarm.loop = true;

    var popUp = document.getElementById("popup");

    // Get the <button> element that closes the popUp
    var closeBtn = document.getElementsByClassName("close")[0];

    // until now, popup was hidden (see the css part)
    // but when time left =0, display the popup
    popUp.style.display = "block";

    // When the user clicks on "dismiss" btn, close the popUp & reset state
    closeBtn.addEventListener('click',  ()=> {
        popUp.style.display = "none";
        alarm.pause();
        reset();
    })
   
}

// just reset the state by reloading the page
const reset = ()=>{
    window.location = url ;
}