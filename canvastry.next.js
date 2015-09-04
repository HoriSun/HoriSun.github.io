var getwindowsize = function(){
    ret = {};
    ret.x = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    ret.y = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
    
    return ret; 
}


var c=document.getElementById("myCanvas");
var wsize = getwindowsize();
c.height = Math.min(wsize.x, wsize.y);
c.width = c.height;
var cxt=c.getContext("2d");

var center = {
    x: c.width/2,
    y: c.height/2,
};

function onresize(){
    wsize = getwindowsize();
    c.height = Math.min(wsize.x, wsize.y);
    c.width = c.height;
    center.x = c.width/2;
    center.y = c.height/2;
}

window.addEventListener("resize",onresize,false);
onresize();

function urlparser(){
    var ret = {};
    var option = unescape(window.location.href);
    var r = /[?&]([^?=#&]*)=([^?=#&]*)/g;
    var temp;
    while(temp=r.exec(option)) ret[temp[1]]=temp[2];
    return ret;
}

function getQueryString(name,dft) {
    var d = urlparser();
    if(name in d)return d[name];
    else return dft;
}

function linspace(){
    var a=0,b,c=1,g=arguments,ret=[];
    if(g.length===0) //()
        return null;
    else if(g.length===1)//(b)
        b = g[0];
    else if(g.length>=2){//(a,b)
        a = g[0];
        b = g[1];
        if(g.length>=3)//(a,b,c)
            c = g[2];
    }
    for(var i=a;i<b;i+=c){
        ret.push(i);
    }
    return ret;
}

var a = getQueryString('a',10);
function draw_1(){
    cxt.moveTo(center.x,center.y);
    console.log(a);
    var r = 1*center.y;
    var pi = 3.14159265358979323846264;
    crd = linspace(a).map(function(x){var t=pi*2/a*x; return [Math.cos(t)*r+center.x,Math.sin(t)*r+center.y];});
    var i = 0;
    var acc = 1;
    for(var i=0;i<a;i++){
        cxt.moveTo(crd[i][0],crd[i][1]);
        var j=(i+parseInt(a/3))%a;
        //console.log(j);
        cxt.lineTo(crd[j][0],crd[j][1]);
        //console.log(i,crd[i][0],crd[i][1]);
    }
    //cxt.stroke();
}


function drawCurve(crd, closed){
    //closed = !!closed;
    var l = crd.x.length;
    cxt.moveTo(crd.x[0],crd.y[0]);
    for(var i=1;i<l;i++){
        cxt.lineTo(crd.x[i],crd.y[i]);
    }
    if(closed)
        cxt.lineTo(crd.x[0],crd.y[0]);
}

var pi = 3.14159265358979323846264;

function draw_2()
{
    var end = pi*a;
    var t=linspace(0,end,0.1);
    var crd;
    var k = getQueryString('k',4);
    for(var i=0;i<k;i++){
        crd = {
            x : t.map(function(x){return x*Math.cos(x+pi*2/k*i)/end*center.y+center.x;}),
            y : t.map(function(x){return x*Math.sin(x+pi*2/k*i)/end*center.y+center.y;}),
        };
        drawCurve(crd);
        crd = {
            x : t.map(function(x){return x*Math.cos(-(x+pi*2/k*i))/end*center.y+center.x;}),
            y : t.map(function(x){return x*Math.sin(-(x+pi*2/k*i))/end*center.y+center.y;}),
        };
        drawCurve(crd);

    }
    //console.log(linspace(t.length).map(function(x){return [crd.x[x],crd.y[x]]}));
}
size = {x:center.x*2, y:center.y*2}
function clean(){cxt.clearRect(0,0,size.x,size.y)}
function clear(){var o = cxt.fillStyle;cxt.fillStyle="#fff";cxt.fillRect(0,0,size.x,size.y); cxt.fillStyle=o;}
function refresh(){clear();cxt.stroke();}

function draw_3(){
    var s = parseFloat(getQueryString("s",100));
    var th0 = parseFloat(getQueryString("th0",0.5));
    var t=linspace(0,s);
    var x,y,th = pi*2/s;
    th0 = th*th0;
    var r = center.y;
    var offset = parseFloat(getQueryString("offset",10));
    var k = 3.6,thk;
    for(var j=0;j<k;j++){
        thk = pi*2/k*j;
        for(var i=0;i<s;i++){
            cxt.moveTo(center.x+offset*Math.cos(thk),center.y+offset*Math.sin(thk));
            cxt.lineTo(r*Math.cos(th*i+th0)+offset*Math.cos(thk)+center.x,r*Math.sin(th*i+th0)+center.y+offset*Math.sin(thk));
        }
    }
}

var euler = 2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274;

function rotate(crd, th){
    var ret = linspace(crd.x.length).map(function(x){return [crd.x[x],crd.y[x]]});
    return {
        x : ret.map(function(x){return  x[0]*Math.cos(th)+x[1]*Math.sin(th)}),
        y : ret.map(function(x){return -x[0]*Math.sin(th)+x[1]*Math.cos(th)}),
    };
}

function translate(crd,x,y){
    return {
        x : crd.x.map(function(i){return i+x}),
        y : crd.y.map(function(i){return i+y}),
    }
}

function mirror(crd){
    return {
        x : crd.x.map(function(i){return -i}),
        y : crd.y,
    }
}

function draw_4(){
    var end = pi*a;
    var t=linspace(0,end,0.1);
    var crd;
    var k = getQueryString('k',10);
    var s = getQueryString('s',10);
    var al=1,b=1;
    for(var i=0;i<k;i++){
        //console.log(linspace(t.length).map(function(x){return [crd.x[x],crd.y[x]]}));
/*
        cxt.beginPath();
        drawCurve(crd);
        cxt.closePath();
        cxt.fillStyle = "#00ffff";
        cxt.fill();
*/
        crd = {
            x : t.map(
                function(r){
                    var phi = Math.log(r/al)/b;
                    return (r*Math.cos(phi))*s;
                }),
            y : t.map(
                function(r){
                    var phi = Math.log(r/al)/b;
                    return (r*Math.sin(phi))*s;
                }),
        };
        cxt.beginPath();
        drawCurve(translate(rotate(crd,pi*2/k*i),center.x,center.y));
        //drawCurve(translate(mirror(rotate(crd,pi*2/k*i)),center.x,center.y));
        cxt.lineWidth = 1;
        cxt.lineJoin = "round"; 
        cxt.stroke();

        cxt.beginPath();
        //drawCurve(translate(rotate(crd,pi*2/k*i),center.x,center.y));
        drawCurve(translate(mirror(rotate(crd,pi*2/k*i)),center.x,center.y));
        cxt.lineWidth = 1;
        cxt.lineJoin = "round"; 
        cxt.stroke();

/*
        crd = {
            x : t.map(
                function(w){
                    var phi = -(w+pi*2/k*i);
                    return r*(Math.cos(phi)+phi*Math.sin(phi))*12+center.x;
                }),
            y : t.map(
                function(w){
                    var phi = -(w+pi*2/k*i);
                    return r*(Math.sin(phi)-phi*Math.cos(phi))*12+center.y;
                }),
        };
        cxt.beginPath();
        drawCurve(crd);
        cxt.lineWidth = 1;
        cxt.lineJoin = "round"; 
        //cxt.stroke();
*/
    }
}

cxt.moveTo(0,center.y);cxt.lineTo(center.x*2,center.y);
cxt.moveTo(center.x,0);cxt.lineTo(center.x,center.y*2);
//draw_1();
//draw_2();
//draw_3();
//draw_4();

function draw_5(th, a, r){
    cxt.beginPath();
    if(th == null)
        th = [0, 0, 0]; // theta, angle offset, start value, use th[k]*pi
    if(a == null)
        a = [0.003, 0.027, 0.081]; // angular velocity , a[k]*pi
    if(r == null)
        r = [1, 0.3, 0.09];
    var num = th.length;
    var s = parseFloat(getQueryString("s",100));
    var th0 = parseFloat(getQueryString("th0",0.5));
    var k = 100000;
    var t = linspace(k);
    var x,y;
    x = y = 0;
    for(var i=0;i<num;i++){
        th[i] += a[i];
        y += Math.sin(th[i]) * r[i];
        x += Math.cos(th[i]) * r[i];
    }
    cxt.moveTo(center.x * (1 + x/2),
               center.y * (1 + y/2));
    for(var j=0;j<k;j++){
        x = y = 0;
        for(var i=0;i<num;i++){
            th[i] += a[i];
            y += Math.sin(th[i]) * r[i];
            x += Math.cos(th[i]) * r[i];
        }
        cxt.lineTo(center.x * (1 + x/2),
                   center.y * (1 + y/2));
    }
}

function draw_6(th, a, r, k){
    cxt.beginPath();
    if(th == null)
        th = [0, 0, 0]; // theta, angle offset, start value, use th[k]*pi
    if(r == null)
        r = [1, 0.3, 0.09];
    if(a == null)
        a = 0.001
    a = r.map(function(x){return a*r[0]/x}); // angular velocity , a[k]*pi
    var num = r.length || a.length || th.length;
    var s = parseFloat(getQueryString("s",100));
    var th0 = parseFloat(getQueryString("th0",0.5));
    if(k == null)
        k = 100000;
    var t = linspace(k);
    var x,y;
    x = y = 0;
    for(var i=0;i<num;i++){
        th[i] += a[i];
        y += Math.sin(th[i]) * r[i];
        x += Math.cos(th[i]) * r[i];
    }
    cxt.moveTo(center.x * (1 + x/3),
               center.y * (1 + y/3));
    for(var j=0;j<k;j++){
        x = y = 0;
        for(var i=0;i<num;i++){
            th[i] += a[i];
            y += Math.sin(th[i]) * r[i];
            x += Math.cos(th[i]) * r[i];
        }
        cxt.lineTo(center.x * (1 + x/3),
                   center.y * (1 + y/3));
    }
}


var timer = setInterval((function(){
    var a = [5,4,16].map(function(x){return x/1000});
    var r = [16, 4];
    var r_;
    r_ = r.map(function(x){return x/r[0]});
    var a0 = a[0];
    var i = 0;
    return function(){
        //if(i>=100){
        //    clearInterval(timer);
        //    return;
        //}
        i += 1;
        a[0] = i*a0;
        //r[2] = 0;
        r[1] = i*0.001;
        r[0] = 1;
        if(r[1]>=r[0]){
            clearInterval(timer);
            return;
        }
        r_ = r.map(function(x){return x/r[0]});
        draw_6(null,0.01,r_,r[1]/0.01*1000);
        refresh();
    }
})(),1000/60);
