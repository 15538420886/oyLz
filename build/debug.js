var jsHost = 'http://10.10.10.201:8082/';

if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (prefix){
		return this.slice(0, prefix.length) === prefix;
	};
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
}

/*window.onresize = function () {
	var dh = window.outerHeight - window.innerHeight;
	var dw = window.outerWidth - window.innerWidth;
	if (dh > 210 || dw > 64){
		window.location = "about:blank";
	}
}
window.onload = function (){
	var dh = window.outerHeight - window.innerHeight;
	var dw = window.outerWidth - window.innerWidth;
	if (dh > 210 || dw > 64){
		window.location = "about:blank";
	}
}*/
