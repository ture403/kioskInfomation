/***********************************************************************************
 *  Project      : 공통 Util
 *  설명          :
 *  작성자         : LarryPark
 *  작성일         : 2025. 7. 14. - 오후 7:49:43
 * [변경이력]
 ***********************************************************************************
 * Date                 Name                Descriptions
 ***********************************************************************************
 * 2025. 7. 14.       	LarryPark          	First Creation
 ***********************************************************************************/
import {b64_md5} from './security/ghc_md5.module.js';
import {WarmhiltEncrypt, WarmhiltDecrypt} from './security/ghc_AES_Security.module.js';
import lottie from "lottie-web";
import spinnerAnimation from '../assets/json/spinner_lottie_globon.json';


let gSecKey = {
    case1 : "onione",
};

/**
 * 암호화 여부
 */
export const SEC_MODE = "security_mode";

/**
 * Function name : GenProc_SetStorage
 * Create by : JungHanYu
 * @param storage : 스토리지 선택 (Ex: sessionStorage, localStorage)
 * @param key
 * @param value
 * @param security : (SEC_MODE - 암호화 SET / 그 외 - 일반 SET)
 * Description :  Storage에 key값에 대한 value 값 부여
 */
function GenProc_SetStorage(storage, key, value, security) {
    let result;
    let chkKey = GenProc_SearchStorage(storage, key);

    if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
        chkKey = GenProc_SearchStorage(storage, b64_md5(key));
    }

    // 만약 같은 Key에 값이 있을 경우 삭제 후 SET!!!
    if(chkKey === true) {
        GenProc_RemoveStorage(storage, key);
        if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
            GenProc_RemoveStorage(storage, b64_md5(key));
        }
    }
    // value 값 암호화 저장
    if(security === SEC_MODE && (typeof WarmhiltEncrypt !== 'undefined')) {
        result = WarmhiltEncrypt(value, gSecKey.case1);
        storage[b64_md5(key)] = result;
    }else{
        result = value;
        storage[key] = result;
    }
    //console.log("스토리지에 저장하였습니다 : "+storage[key]);
}

/**
 * Function name : GenProc_GetStorage
 * Create by : JungHanYu
 * @param storage : 스토리지 선택 (Ex: sessionStorage, localStorage)
 * @param key
 * @param security : (SEC_MODE - 복호화 GET / 그 외 - 일반 GET)
 * @returns
 * Description :  Storage에 key값에 대한 return
 */
function GenProc_GetStorage(storage, key, security) {
    //console.log("스토리지 리턴 : "+storage[key]);
    let result = null;
    let getStorage = null;
    let chkKey = GenProc_SearchStorage(storage, key);

    if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
        chkKey = GenProc_SearchStorage(storage, b64_md5(key));
    }

    if(chkKey === true) {
        if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
            getStorage = storage[b64_md5(key)];
        }else{
            getStorage = storage[key];
        }

        if(security === SEC_MODE && (typeof WarmhiltDecrypt !== 'undefined')) {
            result = WarmhiltDecrypt(getStorage, gSecKey.case1);
        }else{
            result = getStorage;
        }
    }
    return result;
}

/**
 * Function name : GenProc_SearchStorage
 * Create by : JungHanYu
 * @param storage
 * @param key
 * @returns {Boolean}
 * Description :  스토리지에 해당 키에대한 값이 있을 경우 true를 반환한다.
 */
function GenProc_SearchStorage(storage, key) {
    if(storage === null || storage === undefined)
        return false;
    for(let i=0; i<storage.length; i++) {
        if(storage.key(i) === key) {
            return true;
        }
    }
    return false;
}

/**
 * Function name : GenProc_ClearStorage
 * Create by : JungHanYu
 * @param storage : 스토리지 선택 (Ex: sessionStorage, localStorage)
 * @param key
 * Description :  Key값에 대한 스토리지 삭제
 */
function GenProc_ClearStorage(storage, key, security) {
    //console.log("스토리지 삭제 : "+storage[key]);
    if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
        delete storage[b64_md5(key)];
    }else{
        delete storage[key];
    }
}

/**
 * Function name : GenProc_ClearAllStorage
 * Create by : JungHanYu
 * @param storage : 스토리지 선택 (Ex: sessionStorage, localStorage)
 * Description :  모든 스토리지 삭제
 */
function GenProc_ClearAllStorage(storage) {
    // console.log("스토리지 모두 삭제 : (Current Length - "+storage.length);
    storage.clear();
}

/**
 * Function name : GenProc_RemoveStorage
 * Create by : JungHanYu
 * @param storage
 * Description :  Stroage를 Remove한다.
 */
function GenProc_RemoveStorage(storage, key, security) {
    let chkKey = GenProc_SearchStorage(storage, key);
    if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
        chkKey = GenProc_SearchStorage(storage, b64_md5(key));
    }

    if(chkKey === true) {
        if(security === SEC_MODE && (typeof b64_md5 !== 'undefined')){
            storage.removeItem(b64_md5(key));
        }else{
            storage.removeItem(key);
        }
    }
}


/**
 * Function name	: WHBlockUI
 * Create by		: ML_Larrypark
 * @param object
 * Description :  지정영역에 Block 및 메시지 표시
 */
function WHBlockUI(targetElement = null){
    BlockUIOnElement(targetElement);
}

/**
 * Function name : WHUnBlockUI Create by : ML_Larrypark
 *
 * @param object
 * Description : 지정영역에 설정한 Block 및 메시지를 삭제
 */
function WHUnBlockUI(targetElement = null){
    UnBlockUIOnElement(targetElement);
}




/**
 * Function name	: dynamicSort
 * Create by		: Larrypark
 * @param basekey	: Object Key Value
 * @param sorttype	: 'desc' : 내림차순 / Default : 오름차순
 * @returns
 * Description		: Object Sort Method
 */
function dynamicSort(basekey, sorttype){
    let sortOrder = 1;
    if (sorttype && sorttype.toLowerCase() === "desc") {
        sortOrder = -1;
    }
    return function(a, b){
        let result = (a[basekey] < b[basekey]) ? -1 : (a[basekey] > b[basekey]) ? 1 : 0;
        return result * sortOrder;
    }
}

const  GetBrowserName = () => {
    const agt = navigator.userAgent.toLowerCase();
//	console.log('agt : ' + agt);
    if (agt.indexOf("android") !== -1) return 'Android';
    if (agt.indexOf("iphone") !== -1) return 'Iphone';
    if (agt.indexOf("ipad") !== -1) return 'Ipad';
    if (agt.indexOf("chrome") !== -1) return 'Chrome';
    if (agt.indexOf("opera") !== -1) return 'Opera';
    if (agt.indexOf("staroffice") !== -1) return 'Star Office';
    if (agt.indexOf("webtv") !== -1) return 'WebTV';
    if (agt.indexOf("beonex") !== -1) return 'Beonex';
    if (agt.indexOf("chimera") !== -1) return 'Chimera';
    if (agt.indexOf("netpositive") !== -1) return 'NetPositive';
    if (agt.indexOf("phoenix") !== -1) return 'Phoenix';
    if (agt.indexOf("firefox") !== -1) return 'Firefox';
    if (agt.indexOf("safari") !== -1) return 'Safari';
    if (agt.indexOf("skipstone") !== -1) return 'SkipStone';
    if (agt.indexOf("msie") !== -1) return 'Internet Explorer';
    if (agt.indexOf("netscape") !== -1) return 'Netscape';
    if (agt.indexOf("mozilla/5.0") !== -1) return 'Mozilla';
};

const GetIsMobile = () => {
    let browser = GetBrowserName();
    if(browser.toLowerCase() === 'android' || browser.toLowerCase() === 'iphone' || browser.toLowerCase() === 'ipad'){
        return true;
    }else{
        return false;
    }
}

const GetBrowserType = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isNative = ua.includes('onioneapp');
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);

  if (isNative) return 'NATIVE';
  if (isIOS) return 'MOBILE_IOS_WEB';
  if (isAndroid) return 'MOBILE_AOS_WEB';
  return 'PC_WEB';
}

export {
    GenProc_SetStorage,
    GenProc_GetStorage,
    GenProc_RemoveStorage,
    GenProc_SearchStorage,
    GenProc_ClearStorage,
    GenProc_ClearAllStorage,
    GetBrowserName,
    GetIsMobile,
    GetBrowserType,
    WHBlockUI,
    WHUnBlockUI,
    dynamicSort,
};


function BlockUIOnElement(targetElement = null) {
  // 중복 방지: 전체 화면 또는 특정 요소 내의 중복 체크
  const parent = targetElement || document.body;
  if (parent.querySelector(":scope > .block-ui")) return;

  const blocker = document.createElement("div");
  blocker.className = "block-ui";

  // 스타일 설정
  const isGlobal = !targetElement;
  Object.assign(blocker.style, {
    position: isGlobal ? 'fixed' : 'absolute', // 인자가 있으면 absolute
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: "9999",
  });
  // Lottie 컨테이너
  const lottieContainer = document.createElement("div");
  lottieContainer.style.width = "50px";
  lottieContainer.style.height = "50px";

  // 원하는 만큼 픽셀(px)이나 퍼센트(%) 값을 조절해 주세요. (- 값이 위로 이동합니다)
  lottieContainer.style.transform = "translateY(-100px)";

  blocker.appendChild(lottieContainer);

  lottie.loadAnimation({
    container: lottieContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: spinnerAnimation,
    // path: "/assets/json/spinner_lottie_globon.json",
  });

  parent.appendChild(blocker);

  // // 중복 방지: 전체 화면 또는 특정 요소 내의 중복 체크
  // const parent = targetElement || document.body;
  // if (parent.querySelector(':scope > .block-ui')) return;
  //
  // const blocker = document.createElement('div');
  // blocker.className = 'block-ui';
  //
  // // 스타일 설정
  // const isGlobal = !targetElement;
  // Object.assign(blocker.style, {
  //   position: isGlobal ? 'fixed' : 'absolute', //  인자가 있으면 absolute
  //   top: '0',
  //   left: '0',
  //   width: '100%',
  //   height: '100%',
  //   background: 'rgba(255,255,255,0.6)',
  //   zIndex: '9999',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // });
  //
  // // ✅ 특정 영역 차단 시, 부모 요소에 position: relative가 있어야 정확히 덮음
  // if (!isGlobal && window.getComputedStyle(parent).position === 'static') {
  //   parent.style.setProperty('position', 'relative', 'important');
  // }
  //
  // // Spinner 생성
  // const spinner = document.createElement('div');
  // spinner.className = 'spinner';
  // Object.assign(spinner.style, {
  //   width: '40px',
  //   height: '40px',
  //   border: '5px solid #ccc',
  //   borderTop: '5px solid #333',
  //   borderRadius: '50%',
  //   animation: 'spin 1s linear infinite',
  // });
  //
  // // Keyframes 주입 (한 번만)
  // if (!document.getElementById('block-ui-style')) {
  //   const style = document.createElement('style');
  //   style.id = 'block-ui-style';
  //   style.textContent = `
  //           @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  //       `;
  //   document.head.appendChild(style);
  // }
  //
  // blocker.appendChild(spinner);
  // parent.appendChild(blocker);
}

function UnBlockUIOnElement(targetElement = null) {
  const parent = targetElement || document.body;
  const blocker = parent.querySelector(':scope > .block-ui');
  if (blocker) blocker.remove();
}

// function BlockUIOnElement() {
//     // 기존 block-ui가 있으면 중복 방지
//     if (document.querySelector('.block-ui')) return;
//
//     const blocker = document.createElement('div');
//     blocker.className = 'block-ui';
//     Object.assign(blocker.style, {
//         position: 'fixed', // ✅ fixed로 수정
//         top: '0',
//         left: '0',
//         right: '0',
//         bottom: '0',
//         background: 'rgba(255,255,255,0.6)',
//         zIndex: '9999',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     });
//
//     // Spinner 생성
//     const spinner = document.createElement('div');
//     spinner.className = 'spinner';
//
//     Object.assign(spinner.style, {
//         width: '50px',
//         height: '50px',
//         border: '6px solid #ccc',
//         borderTop: '6px solid #333',
//         borderRadius: '50%',
//         animation: 'spin 1s linear infinite',
//     });
//
//     if (!document.getElementById('block-ui-style')) {
//         const style = document.createElement('style');
//         style.id = 'block-ui-style';
//         style.innerHTML = `
// 	@keyframes spin {
// 	  0%   { transform: rotate(0deg); }
// 	  100% { transform: rotate(360deg); }
// 	}
//   `;
//         document.head.appendChild(style);
//     }
//
//     blocker.appendChild(spinner);
//     document.body.appendChild(blocker); // ✅ body에 직접 append
// }
//
//
// function UnBlockUIOnElement() {
//     const blocker = document.querySelector('.block-ui');
//     if (blocker) blocker.remove();
// }


export function createGroupTimer(
    label,
    {
        collapsed = true,
        color = '#FFD700',
        enabled = process.env.NODE_ENV !== 'production', // 기본: production에서 꺼짐
    } = {}
) {
    if (!enabled) {
        // 로깅이 비활성화된 경우 빈 함수 반환
        const noop = () => {};
        return { log: noop, info: noop, warn: noop, error: noop, mark: noop, end: noop };
    }

    const start = performance.now();
    const header = `%c🔧 ${label}`;
    const style = `color: ${color}; font-weight: bold;`;

    collapsed ? console.groupCollapsed(header, style) : console.group(header, style);

    const log   = (...args) => console.log(`%c📜`, 'color: #008C8C;', ...args);
    const info  = (...args) => console.info(`%cℹ️`, 'color: #8AE634;', ...args);
    const warn  = (...args) => console.warn(`%c⚠️`, 'color: orange;', ...args);
    const error = (...args) => console.error(`%c🚨`, 'color: red;', ...args);

    const mark = (markLabel = 'mark') => {
        const sec = ((performance.now() - start) / 1000).toFixed(3);
        console.log(`%c⏱ ${markLabel}: ${sec}s`, 'color: #FFC0CB;');
    };

    const end = () => {
        const sec = ((performance.now() - start) / 1000).toFixed(3);
        console.log(`%c✅ done in ${sec}s`, 'color: #B4F0B4; font-weight: bold;');
        console.groupEnd();
        return Number(sec);
    };

    return { log, info, warn, error, mark, end };
}

export async function withGroupTimer(
    label,
    fn,
    { collapsed = true, color = '#FFD700', enabled = process.env.NODE_ENV !== 'production' } = {}
) {
    const t = createGroupTimer(label, { collapsed, color, enabled });
    if (!enabled) {
        return fn({ log: () => {}, info: () => {}, warn: () => {}, error: () => {}, mark: () => {}, end: () => {} });
    }
    try {
        const result = await fn(t);
        t.end();
        return result;
    } catch (e) {
        t.error('🚨 error:', e);
        t.end();
        throw e;
    }
}