var getScores=function(n){var t=new RegExp("[.?!]\\s[^a-z]","g"),r=new RegExp("[aiouy]+e*|e(?!d$|ly).|[td]ed|le$","g"),e=206.835,u=1.015,i=84.6,o={},a=["!",'"',"#","$","%","&","'","(",")","*","+",",","-",".","/",":",";","<","=",">","?","@","[","]","^","_","`","{","|","}","~"],s=function(n,t){var r=Math.pow(10,t||0);return Math.floor(n*r+.5*Math.sign(n))/r},h=function(n){return o.charCount?o.charCount:(n=(n=n.split(" ").slice(0,1e3).join(" ")).replace(/\s/g,""),o.charCount=n.length)},c=function(n){return n.split("").filter(function(n){return-1===a.indexOf(n)}).join("")},l=function(n,t,r){if(t&&o.lexiconCount)return o.lexiconCount;!0!==r&&(n=n.split(" ").slice(0,1e3).join(" "));var e=(n=c(n)).split(" ").length;return t?o.lexiconCount=e:e},f=function(n,t){if(t&&o.getWords)return o.getWords;n=(n=n.split(" ").slice(0,1e3).join(" ")).toLowerCase();var r=(n=c(n)).split(" ");return t?o.getWords=r:r},p=function(n,t){if(t&&o.syllableCount)return o.syllableCount;var e=f(n,t).reduce(function(n,t){return n+(t.match(r)||[1]).length},0);return t?o.syllableCount=e:e},v=function(n,r){if(r&&o.sentenceCount)return o.sentenceCount;var e=0,u=(n=n.split(" ").slice(0,1e3).join(" ")).split(t);u.forEach(function(n){l(n,!0,!1)<=2&&(e+=1)});var i=Math.max(1,u.length-e);return r?o.sentenceCount=i:i},g=function(n){var t=l(n,!0)/v(n,!0);return s(t,2)},d=function(n){var t=p(n,!0)/l(n,!0);return s(t,2)},M=function(n){var t=function(n){return n=(n=n.split(" ").slice(0,1e3).join(" ")).replace(/\s/g,""),c(n).length}(n)/l(n,!0);return s(t,2)},C=function(n){var t=v(n,!0);if(t>=3){var r=function(n,t){var r=0;return f(n,t).forEach(function(n){p(n)>=3&&(r+=1)}),r}(n,!0),e=1.043*Math.pow(r*(30/t),.5)+3.1291;return s(e,2)}return 0},x=function(n){var t=s(100*M(n),2),r=s(100*function(n){var t=v(n,!0)/l(n,!0);return s(t,2)}(n),2);return s(.0588*t-.296*r-15.8,2)},m=[],j={};return function(){var t=j.fleschReadingEase=function(n){var t=g(n),r=d(n);return s(e-u*t-i*r,2)}(n);t<100&&t>=90?m.push(5):t<90&&t>=80?m.push(6):t<80&&t>=70?m.push(7):t<70&&t>=60?(m.push(8),m.push(9)):t<60&&t>=50?m.push(10):t<50&&t>=40?m.push(11):t<40&&t>=30?m.push(12):m.push(13);var r=j.fleschKincaidGrade=function(n){var t=g(n),r=d(n);return s(.39*t+11.8*r-15.59,2)}(n);m.push(Math.floor(r)),m.push(Math.ceil(r));var o=j.smogIndex=C(n);m.push(Math.floor(o)),m.push(Math.ceil(o));var a=j.colemanLiauIndex=x(n);m.push(Math.floor(a)),m.push(Math.ceil(a));var c=j.automatedReadabilityIndex=function(n){var t=h(n),r=l(n,!0),e=r/v(n,!0),u=4.71*s(t/r,2)+.5*s(e,2)-21.43;return s(u,2)}(n);m.push(Math.floor(c)),m.push(Math.ceil(c));var M=j.linsearWriteFormula=function(n){var t=0,r=0,e=n.split(" ").slice(0,100).join(" ");f(n,!0).slice(0,100).forEach(function(n){p(n)<3?t+=1:r+=1});var u=(t+3*r)/v(e);return u<=20&&(u-=2),s(u/2,2)}(n);m.push(Math.floor(M)),m.push(Math.ceil(M));var y=j.rix=function(n){var t=f(n,!0).filter(function(n){return n.length>6}).length,r=v(n,!0);return s(t/r,2)}(n);y>=7.2?m.push(13):y<7.2&&y>=6.2?m.push(12):y<6.2&&y>=5.3?m.push(11):y<5.3&&y>=4.5?m.push(10):y<4.5&&y>=3.7?m.push(9):y<3.7&&y>=3?m.push(8):y<3&&y>=2.4?m.push(7):y<2.4&&y>=1.8?m.push(6):y<1.8&&y>=1.3?m.push(5):y<1.3&&y>=.8?m.push(4):y<.8&&y>=.5?m.push(3):y<.5&&y>=.2?m.push(2):m.push(1),m=m.sort(function(n,t){return n-t});var E=Math.floor(m.length/2),w=s(m.length%2?m[E]:(m[E-1]+m[E])/2);j.medianGrade=w}(),j.readingTime=function(n){return s(l(n,!1,!0)/4.17,2)}(n),j};