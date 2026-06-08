window.debugOption = {
    dev : function(optionval){
        let DEFAULT_DEV_OPTION = false;

        if(optionval !== null && optionval !== undefined){
            localStorage.setItem('option_dev', optionval);
        }
        let storageVal = localStorage.getItem('option_dev');
        if(storageVal !== null && storageVal !== undefined && storageVal){
            DEFAULT_DEV_OPTION = JSON.parse(storageVal);
        }

        return DEFAULT_DEV_OPTION;
    },			//개발 Debug Option
    network : function(optionval){
        let DEFAULT_DEV_OPTION = false;

        if(optionval !== null && optionval !== undefined){
            localStorage.setItem('option_network_dev', optionval);
        }
        let storageVal = localStorage.getItem('option_network_dev');
        if(storageVal !== null && storageVal !== undefined && storageVal){
            DEFAULT_DEV_OPTION = JSON.parse(storageVal);
        }

        return DEFAULT_DEV_OPTION;
    },			//Network Debug
    encrypt : function(optionval){
        let DEFAULT_DEV_OPTION = false;

        if(optionval !== null && optionval !== undefined){
            localStorage.setItem('option_encrypt_dev', optionval);
        }
        let storageVal = localStorage.getItem('option_encrypt_dev');
        if(storageVal !== null && storageVal !== undefined && storageVal){
            DEFAULT_DEV_OPTION = JSON.parse(storageVal);
        }

        return DEFAULT_DEV_OPTION;
    },			//encrypt Debug
    timer : function(optionval){
        let DEFAULT_DEV_OPTION = false;

        if(optionval !== null && optionval !== undefined){
            localStorage.setItem('option_timer_dev', optionval);
        }
        let storageVal = localStorage.getItem('option_timer_dev');
        if(storageVal !== null && storageVal !== undefined && storageVal){
            DEFAULT_DEV_OPTION = JSON.parse(storageVal);
        }

        return DEFAULT_DEV_OPTION;
    }			//encrypt Debug
};


document.onkeydown = keycheck;
function keycheck(e) {
    let ctrl = window.event.ctrlKey;
    let alt = window.event.altKey;
    let shift = window.event.shiftKey;
    let code = window.event.keyCode;
    // if(window.debugOption.dev()){
    // 	console.log(code, e);
    // }
    if (ctrl && shift && code === 49){
    } else if (ctrl && shift && code === 50){
    } else if (ctrl && shift && code === 51){
    } else if (ctrl && shift && code === 52){
    } else if (ctrl && shift && code === 53){
    } else if (ctrl && shift && code === 54){
    } else if (ctrl && shift && code === 55){
    } else if (ctrl && shift && code === 56){
    } else if (ctrl && shift && code === 57){
    } else if (ctrl && shift && code === 65){
    } else if (ctrl && shift && code === 66){
    } else if (ctrl && shift && code === 67){   //C
    } else if (ctrl && shift && code === 68){
    } else if (ctrl && shift && code === 83){	//S
    } else if (ctrl && shift && code === 86){	//V
    } else if (ctrl && shift && code === 192){	//`
    } else if (ctrl && shift && code === 37){	//<-
    } else if (ctrl && shift && code === 39){	//->
    } else if (ctrl && shift && code === 38){	//up
    } else if (ctrl && shift && code === 40){	//down
    } else if (ctrl && alt && code === 90){			//Z
        window.debugOption.dev() === true ? window.debugOption.dev(false) : window.debugOption.dev(true);
        console.log('--------------------------------------------------------------');
        console.log('[Dev] : ' + window.debugOption.dev() + ' [Network] : ' + window.debugOption.network() + ' [Encrypt] : ' + window.debugOption.encrypt() + ' [Timer] : ' + window.debugOption.timer());
        console.log('--------------------------------------------------------------');
    } else if (ctrl && alt && code === 88){			//X
        window.debugOption.network() === true ? window.debugOption.network(false) : window.debugOption.network(true);
        console.log('--------------------------------------------------------------');
        console.log('[Dev] : ' + window.debugOption.dev() + ' [Network] : ' + window.debugOption.network() + ' [Encrypt] : ' + window.debugOption.encrypt() + ' [Timer] : ' + window.debugOption.timer());
        console.log('--------------------------------------------------------------');
    } else if (ctrl && alt && code === 67){			//C
        window.debugOption.encrypt() === true ? window.debugOption.encrypt(false) : window.debugOption.encrypt(true);
        console.log('--------------------------------------------------------------');
        console.log('[Dev] : ' + window.debugOption.dev() + ' [Network] : ' + window.debugOption.network() + ' [Encrypt] : ' + window.debugOption.encrypt() + ' [Timer] : ' + window.debugOption.timer());
        console.log('--------------------------------------------------------------');
    } else if (ctrl && alt && code === 86){			//V
        window.debugOption.timer() === true ? window.debugOption.timer(false) : window.debugOption.timer(true);
        console.log('--------------------------------------------------------------');
        console.log('[Dev] : ' + window.debugOption.dev() + ' [Network] : ' + window.debugOption.network() + ' [Encrypt] : ' + window.debugOption.encrypt() + ' [Timer] : ' + window.debugOption.timer());
        console.log('--------------------------------------------------------------');
    } else if (code === 8){		//backspace
    }
}