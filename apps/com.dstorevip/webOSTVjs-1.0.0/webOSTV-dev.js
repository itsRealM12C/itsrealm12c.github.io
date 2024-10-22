window.webOSDev=function(e){function t(n){if(r[n])return r[n].exports
var o=r[n]={i:n,l:!1,exports:{}}
return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={}
return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e}
return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=6)}([function(e,t,r){"use strict"
function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a={},u=function(e){var t=e
return"/"!==t.slice(-1)&&(t+="/"),t},s=t.LS2Request=function(){function e(){n(this,e),this.bridge=null,this.cancelled=!1,this.subscribe=!1}return i(e,[{key:"send",value:function(e){var t=e.service,r=void 0===t?"":t,n=e.method,i=void 0===n?"":n,s=e.parameters,c=void 0===s?{}:s,l=e.onSuccess,d=void 0===l?function(){}:l,f=e.onFailure,v=void 0===f?function(){}:f,h=e.onComplete,p=void 0===h?function(){}:h,m=e.subscribe,b=void 0!==m&&m
if(!window.PalmServiceBridge){var y={errorCode:-1,errorText:"PalmServiceBridge is not found.",returnValue:!1}
return v(y),p(y),console.error("PalmServiceBridge is not found."),this}this.ts&&a[this.ts]&&delete a[this.ts]
var O=o({},c)
return this.subscribe=b,this.subscribe&&(O.subscribe=this.subscribe),O.subscribe&&(this.subscribe=O.subscribe),this.ts=Date.now(),a[this.ts]=this,this.bridge=new PalmServiceBridge,this.bridge.onservicecallback=this.callback.bind(this,d,v,p),this.bridge.call(u(r)+i,JSON.stringify(O)),this}},{key:"callback",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:""
if(!this.cancelled){var o={}
try{o=JSON.parse(n)}catch(e){o={errorCode:-1,errorText:n,returnValue:!1}}var i=o,a=i.errorCode,u=i.returnValue
void 0!==a||!1===u?(o.returnValue=!1,t(o)):(o.returnValue=!0,e(o)),r(o),this.subscribe||this.cancel()}}},{key:"cancel",value:function(){this.cancelled=!0,null!==this.bridge&&(this.bridge.cancel(),this.bridge=null),this.ts&&a[this.ts]&&delete a[this.ts]}}]),e}(),c={request:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=o({service:e},t)
return(new s).send(r)}}
t.default=c},function(e,t,r){"use strict"
function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.drmAgent=t.DRM=void 0
var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=r(5),u=r(0),s={NOT_ERROR:-1,CLIENT_NOT_LOADED:0,VENDOR_ERROR:500,API_NOT_SUPPORTED:501,WRONG_CLIENT_ID:502,KEY_NOT_FOUND:503,INVALID_PARAMS:504,UNSUPPORTED_DRM_TYPE:505,INVALID_KEY_FORMAT:506,INVALID_TIME_INFO:507,UNKNOWN_ERROR:599},c={PLAYREADY:"playready",WIDEVINE:"widevine",VERIMATRIX:"viewrights_web"},l={UNLOADED:0,LOADING:1,LOADED:2,UNLOADING:3},d=function(e){var t=e.method,r=e.parameters,n=e.onComplete;(new u.LS2Request).send({service:"luna://com.webos.service.drm",onComplete:n,method:t,parameters:r})},f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
setTimeout(function(){return e(t)},0)},v=function(e){return e.state===l.LOADED&&""!==e.getClientId()},h=function(e,t){var r=t.errorCode,n=void 0===r?s.UNKNOWN_ERROR:r,o=t.errorText,i=void 0===o?"Unknown error.":o,a={errorCode:n,errorText:i}
return e.setError(a),a},p=function(e){var t="",r=""
switch(e){case c.PLAYREADY:t="application/vnd.ms-playready.initiator+xml",r="urn:dvb:casystemid:19219"
break
case c.WIDEVINE:t="application/widevine+xml",r="urn:dvb:casystemid:19156"
break
case c.VERIMATRIX:t="json",r="0x5601"}return{msgType:t,drmSystemId:r}},m={errorCode:s.CLIENT_NOT_LOADED,errorText:"DRM client is not loaded."},b=function(){function e(t){n(this,e),this.clientId="",this.drmType=t,this.errorCode=s.NOT_ERROR,this.errorText="",this.state=l.UNLOADED}return i(e,[{key:"getClientId",value:function(){return this.clientId}},{key:"getDrmType",value:function(){return this.drmType}},{key:"getErrorCode",value:function(){return this.errorCode}},{key:"getErrorText",value:function(){return this.errorText}},{key:"setError",value:function(e){var t=e.errorCode,r=e.errorText
this.errorCode=t,this.errorText=r}},{key:"isLoaded",value:function(e){var t=this,r=e.onSuccess,n=void 0===r?function(){}:r,i=e.onFailure,u=void 0===i?function(){}:i
d({method:"isLoaded",parameters:{appId:(0,a.fetchAppId)()},onComplete:function(e){if(!0===e.returnValue){if(t.clientId=e.clientId||"",t.state=e.loadStatus?l.LOADED:l.UNLOADED,!0===e.loadStatus&&e.drmType!==t.drmType){var r={errorCode:s.UNKNOWN_ERROR,errorText:"DRM types of set and loaded are not matched."}
return u(h(t,r))}var i=o({},e)
return delete i.returnValue,n(i)}return u(h(t,e))}})}},{key:"load",value:function(e){var t=this,r=e.onSuccess,n=void 0===r?function(){}:r,o=e.onFailure,i=void 0===o?function(){}:o
if(this.state===l.LOADING||this.state===l.LOADED)return void f(n,{isLoaded:!0,clientId:this.clientId})
var u={appId:(0,a.fetchAppId)(),drmType:this.drmType}
this.state=l.LOADING,d({method:"load",onComplete:function(e){return!0===e.returnValue?(t.clientId=e.clientId,t.state=l.LOADED,n({clientId:t.clientId})):i(h(t,e))},parameters:u})}},{key:"unload",value:function(e){var t=this,r=e.onSuccess,n=void 0===r?function(){}:r,o=e.onFailure,i=void 0===o?function(){}:o
if(!v(this))return void f(i,h(this,m))
var a={clientId:this.clientId}
this.state=l.UNLOADING,d({method:"unload",onComplete:function(e){return!0===e.returnValue?(t.clientId="",t.state=l.UNLOADED,n()):i(h(t,e))},parameters:a})}},{key:"getRightsError",value:function(e){var t=this,r=e.onSuccess,n=void 0===r?function(){}:r,i=e.onFailure,a=void 0===i?function(){}:i
if(!v(this))return void f(a,h(this,m))
d({method:"getRightsError",parameters:{clientId:this.clientId,subscribe:!0},onComplete:function(e){if(!0===e.returnValue){var r=o({},e)
return delete r.returnValue,n(r)}return a(h(t,e))}})}},{key:"sendDrmMessage",value:function(e){var t=this,r=e.msg,n=void 0===r?"":r,i=e.onSuccess,a=void 0===i?function(){}:i,u=e.onFailure,s=void 0===u?function(){}:u
if(!v(this))return void f(s,h(this,m))
var c=p(this.drmType),l=o({clientId:this.clientId,msg:n},c)
d({method:"sendDrmMessage",onComplete:function(e){if(!0===e.returnValue){var r=o({},e)
return delete r.returnValue,a(r)}return s(h(t,e))},parameters:l})}}]),e}()
t.DRM={Error:s,Type:c},t.drmAgent=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:""
return""===e?null:new b(e)},t.default=b},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})
var n=r(0),o=function(e){var t=e.onSuccess,r=void 0===t?function(){}:t,o=e.onFailure,i=void 0===o?function(){}:o
if(-1===navigator.userAgent.indexOf("Chrome"))return void setTimeout(function(){return i({errorCode:"ERROR.000",errorText:"Not supported."})},0);(new n.LS2Request).send({service:"luna://com.webos.service.sm",method:"deviceid/getIDs",parameters:{idType:["LGUDID"]},onComplete:function(e){if(!0===e.returnValue){var t=e.idList.filter(function(e){return"LGUDID"===e.idType})[0].idValue
return void r({id:t})}i({errorCode:e.errorCode,errorText:e.errorText})}})}
t.default=o},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0}),t.launchParams=t.launch=t.APP=void 0
var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},o=r(0),i=t.APP={BROWSER:"APP_BROWSER"},a=function(e){var t=e.parameters,r=e.onSuccess,n=e.onFailure;(new o.LS2Request).send({service:"luna://com.webos.applicationManager",method:"launch",parameters:t,onComplete:function(e){var t=e.returnValue,o=e.errorCode,i=e.errorText
return!0===t?r():n({errorCode:o,errorText:i})}})}
t.launch=function(e){var t=e.id,r=void 0===t?"":t,o=e.params,u=void 0===o?{}:o,s=e.onSuccess,c=void 0===s?function(){}:s,l=e.onFailure,d=void 0===l?function(){}:l,f=n({},{id:r,params:u})
i.BROWSER===r&&(f.params.target=u.target||"",f.params.fullMode=!0,f.id="com.webos.app.browser"),a({parameters:f,onSuccess:c,onFailure:d})},t.launchParams=function(){var e={}
if(window.PalmSystem&&""!==window.PalmSystem.launchParams)try{e=JSON.parse(window.PalmSystem.launchParams)}catch(e){console.error("JSON parsing error")}return e}},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})
var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},o=r(0),i=function(e){var t=e.service,r=e.subscribe,i=e.onSuccess,a=e.onFailure;(new o.LS2Request).send({service:t,method:"getStatus",parameters:{subscribe:r},onComplete:function(e){var t=n({},e)
if(delete t.returnValue,!0===e.returnValue)return delete t.subscribe,void i(t)
delete t.returnValue,a(t)}})},a={getStatus:function(e){var t=e.onSuccess,r=void 0===t?function(){}:t,n=e.onFailure,o=void 0===n?function(){}:n,a=e.subscribe,u=void 0!==a&&a,s="webos.service"
navigator.userAgent.indexOf("537.41")>-1&&(s="palm"),i({service:"luna://com."+s+".connectionmanager",subscribe:u,onSuccess:r,onFailure:o})}}
t.default=a},function(e,t,r){"use strict"
Object.defineProperty(t,"__esModule",{value:!0})
var n=t.fetchAppId=function(){return window.PalmSystem&&window.PalmSystem.identifier?window.PalmSystem.identifier.split(" ")[0]:""},o={}
t.fetchAppInfo=function(e,t){if(0===Object.keys(o).length){var r=function(t,r){if(!t&&r)try{o=JSON.parse(r),e&&e(o)}catch(t){console.error("Unable to parse appinfo.json file for",n()),e&&e()}else e&&e()},i=new window.XMLHttpRequest
i.onreadystatechange=function(){4===i.readyState&&(i.status>=200&&i.status<300||0===i.status?r(null,i.responseText):r({status:404}))}
try{i.open("GET",t||"appinfo.json",!0),i.send(null)}catch(e){r({status:404})}}else e&&e(o)},t.fetchAppRootPath=function(){var e=window.location.href
if("baseURI"in window.document)e=window.document.baseURI
else{var t=window.document.getElementsByTagName("base")
t.length>0&&(e=t[0].href)}var r=e.match(new RegExp(".*://[^#]*/"))
return r?r[0]:""},t.platformBack=function(){if(window.PalmSystem&&window.PalmSystem.platformBack)return window.PalmSystem.platformBack()}},function(e,t,r){"use strict"
function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.LGUDID=t.launchParams=t.launch=t.drmAgent=t.DRM=t.connection=t.APP=void 0
var o=r(3),i=r(1),a=r(4),u=n(a),s=r(2),c=n(s)
t.APP=o.APP,t.connection=u.default,t.DRM=i.DRM,t.drmAgent=i.drmAgent,t.launch=o.launch,t.launchParams=o.launchParams,t.LGUDID=c.default}])
