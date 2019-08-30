/**
 * Created by LiuYuTao on 2016/11/21.
 */

function remTrans(num) {
    return (num / 75);
}


function WavesAndBoat(option) {
    var wavesCon = option.svg.append("g");
    this.scene = option.scene;
    this.boatConfig = $.extend(commConfig.boatConfig, option);
    this.wave0 = wavesCon.append("path")
        .attr("style", "fill:url(#downGradient);");
    this.boatX = width * this.boatConfig.floatRange[0];
    this.boatY = height - commConfig.waveConfig.waveHeight[1] - commConfig.boatConfig.height - (typeof this.boatConfig.boat.offset!="undefined" ? this.boatConfig.boat.offset : 0);
    if (option.boat) {
        this.boat = wavesCon.append("image")
            .attr("class", "boat")
            .attr("xlink:href", "images/weixiaobao/" + this.boatConfig.boat.url)
            .attr("width", this.boatConfig.width)
            .attr("height", this.boatConfig.height)
            .attr("x", this.boatX)
            .attr("y", this.boatY);
    } else {
        this.boat = null;
    }

    if (this.scene == "downloadApp") {
        this.boat = wavesCon.append("g");
        this.boat.jumped = false;


        this.boat.append("image")
            .attr("class", "wxb")
            .attr("xlink:href", "images/weixiaobao/jump.png")
            .attr("width", width * 214 / 750)
            .attr("height", height * 186 / 1334)
            .attr("x", 104)
            .attr("y", height * 54 / 1334);

        this.boat.append("image")
            .attr("class", "boat")
            .attr("xlink:href", "images/weixiaobao/download-boat.png")
            .attr("width", width * 380 / 750)
            .attr("height", height * 214 / 1334)
            .attr("x", 0)
            .attr("y", height * 108 / 1334);

        this.boatX = 0;
    }


    this.wave1 = wavesCon.append("path")
        .attr("style", "fill:url(#downGradient);");

    this.wave2 = wavesCon.append("path")
        .attr("style", "fill:url(#downGradient);");

    var wavepoints = [];    // 二维数组
}

WavesAndBoat.prototype.setPath = function (El, data) {

    var area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function (d) {
            return d.left
        })
        .y1(height)
        .y0(function (d) {
            return yScale(d.top)
        });
    El.datum(data)
        .attr("d", area);
};
/*三个波的浪峰数据*/
WavesAndBoat.prototype.render = function (elapsed) {
    var boatConfig = commConfig.boatConfig;
    if (elapsed % 5 == 0) {
        var wavepoints = this.buildPoints(elapsed);
        this.setPath(this.wave0, wavepoints[0]);
        this.setPath(this.wave1, wavepoints[1]);
        this.setPath(this.wave2, wavepoints[2]);
    }

    if (this.scene == "downloadApp") {
        if (!this.boat.jumped) {

            var seed = elapsed % 100;

            if ((this.boatX + commConfig.boatConfig.width / 2) < width / 2) {
                this.boatX += boatConfig.speed * 5;
                this.boatY = height - commConfig.waveConfig.waveHeight[1] * .7
                    - commConfig.boatConfig.height + Math.sin(seed / 1000 + 1.07) * 10;
                var boatCenterX = this.boatX + commConfig.boatConfig.width / 2;
                var boatCenterY = this.boatY;
                var boatRotate = "rotate(" + (Math.sin(elapsed / 200) * 3) + "," + boatCenterX + "," + boatCenterY + ")";
                this.boat.attr("transform", "scale(0.95) translate(" + this.boatX + "," + this.boatY + ") " + boatRotate);
            } else {
                this.boat.select(".wxb").transition()
                    .delay(1000)
                    .attr("y", "-30");
                this.boat.jumped = true;
            }
        }
    } else {
        if (this.boat) {
            var seed = elapsed % 100;
            var boatX = +this.boat.attr("x");
            if (boatX <= boatConfig.floatRange[0] * width) {
                boatConfig.speed = Math.abs(boatConfig.speed);
            }
            if (boatX >= boatConfig.floatRange[1] * width) {
                boatConfig.speed = -Math.abs(boatConfig.speed);
            }
            boatX += boatConfig.speed;
            var boatY = height - commConfig.waveConfig.waveHeight[1] * 0.6 - commConfig.boatConfig.height - Math.sin(seed / 1000 + 1.07) + (this.boatConfig.boat.offset ? this.boatConfig.boat.offset : 0);
            var boatCenterX = boatX + boatConfig.centerX;
            var boatCenterY = boatY + boatConfig.centerY;
            var boatRotate = "rotate(" + (this.boatConfig.boat.angle + Math.sin(elapsed / 100) * 5) + "," + boatCenterX + "," + boatCenterY + ")";
            this.boat.attr("x", boatX)
                .attr("y", boatY)
                .attr("transform", boatRotate);

        }
    }
};

WavesAndBoat.prototype.buildPoints = function (elapsed) {
    var wavepoints = [];
    var waveConfig = commConfig.waveConfig;
    for (i = 0; i < 3; i++) {
        tempArr = [];
        for (var j = 0; j <= waveConfig.waveNums[i]; j++) {
            xScale.domain([0, waveConfig.waveNums[i]]);
            var left = 0;
            if (j != 0 && j != waveConfig.waveNums[i]) {
                left = xScale(j) + Math.random() * 15 - 8
            } else {
                left = xScale(j);
            }
            var top = 0;
            var sinSeed = elapsed / 10 + (j + j % 12) * 100 + i * 150,
                sinHeight = Math.sin(sinSeed / 8) * waveConfig.waveRange[i];
            top = Math.sin(sinSeed / 10) * sinHeight + height - waveConfig.waveHeight[i];

            tempArr.push({
                top: top,
                left: left
            });
        }

        wavepoints.push(tempArr);
    }
    return wavepoints;
};

function GreenDots(option) {
    var greenDotConfig = commConfig.greenDotConfig;
    var greenDotsCon = option.svg.append("g")
        .attr("width", width)
        .attr("height", height);
    var dot, dots = [];
    var l = greenDotConfig.num;
    for (var i = 0; i < l; i++) {
        dot = greenDotsCon.append("circle")
            .attr("r", Math.random() * (greenDotConfig.sizeRange[1] - greenDotConfig.sizeRange[0]) + greenDotConfig.sizeRange[0])
            .attr("style", "fill:" + greenDotConfig.color + ";opacity:" + ((greenDotConfig.opacity[1] - greenDotConfig.opacity[0]) * Math.random() + greenDotConfig.opacity[0]));


        var xSpeed = Math.abs((greenDotConfig.xSpeed[1] - greenDotConfig.xSpeed[0]) * Math.random() + greenDotConfig.xSpeed[0]);
        var ySpeed = Math.abs((greenDotConfig.ySpeed[1] - greenDotConfig.ySpeed[0]) * Math.random() + greenDotConfig.ySpeed[0]);
        dots.push({
            El: dot,
            x: Math.random() * width,
            y: Math.random() * height,
            xSpeed: commConfig.greenDotConfig.direction ? xSpeed : -xSpeed,
            ySpeed: ySpeed
        });
    }

    this.dots = dots;

}

function Stars(option) {
    var con = option.svg.append("g");
    var star, stars = [];
    if (option.stars) {
        function setBox(url) {
            switch (url) {
                case "star01.png":
                    this.attr("width", 25 * 2)
                        .attr("height", 25 * 2);
                    break;
                case "star02.png":
                    this.attr("width", 25 * 2)
                        .attr("height", 25 * 2);
                    break;
                case "star03.png":
                    this.attr("width", 25 * 2)
                        .attr("height", 25 * 2);
                    break;
                case "star04.png":
                    this.attr("width", 30 * 2)
                        .attr("height", 32 * 2);
                    break;
                case "star05.png":
                    this.attr("width", 73 * 2)
                        .attr("height", 47 * 2);
                    break;
            }
            return this;
        }

        var image;
        var l = option.stars.length;
        for (var i = 0; i < l; i++) {
            console.log("insert star");
            star = option.stars[i];
            image = con.append("image")
                .attr("xlink:href", "images/stars/star0" + star.index + ".png")
                .attr("x", width * (star.position.x / 750))
                .attr("y", height * (star.position.y / 1334))
                .attr("width", width * (commConfig.starConfig["star" + star.index].w / 750))
                .attr("height", height * (commConfig.starConfig["star" + star.index].h / 1334));

            setBox.call(image, star.url);
            stars.push(image);
        }

        this.stars = stars;

    } else {
        this.stars = [];
    }
}

GreenDots.prototype.render = function (elapsed) {
    var dots = this.dots;
    var l = dots.length;
    var obj;
    for (var i = 0; i < l; i++) {
        obj = dots[i];
        obj.x = obj.x + obj.xSpeed;
        obj.y = obj.y + obj.ySpeed;
        if (obj.x < 0) {
            obj.x = Math.random() * width * 1.5;
            obj.y = 0;
        }
        if (obj.y > height) {
            obj.y = 0;
            obj.x = Math.random() * width;
        }
        obj.El.attr("cx", obj.x)
            .attr("cy", obj.y)
    }
};

function Bubble(option) {
    var bubblesConfig = commConfig.bubblesConfig;
    var Bwidth2 = (bubblesConfig.sizeRange[1] - bubblesConfig.sizeRange[0]) * Math.random() + bubblesConfig.sizeRange[0];
    this.bubble = option.bubblesCon.append("image")
        .attr("xlink:href", "images/bubbles/5.png")
        .attr("width", Bwidth2)
        .attr("height", Bwidth2);

    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.setNewDirection();
}

Bubble.prototype.setNewDirection = function () {
    var bubblesConfig = commConfig.bubblesConfig;
    this.animTime = Math.random() * 5000;
    this.animingTime = 0;
    var seed1 = Math.sin(Math.random() * 6.28);
    var seed2 = Math.sin(Math.random() * 6.28);
    this.xSpeed = (bubblesConfig.xSpeed[1] - bubblesConfig.xSpeed[0]) * seed1 + (seed1 >= 0 ? bubblesConfig.xSpeed[0] : -bubblesConfig.xSpeed[0]);
    this.ySpeed = (bubblesConfig.ySpeed[1] - bubblesConfig.ySpeed[0]) * seed2 + (seed2 >= 0 ? bubblesConfig.ySpeed[0] : -bubblesConfig.ySpeed[0]);
};

Bubble.prototype.move = function () {
    if (this.animingTime < this.animTime) {
        this.x = this.x + this.xSpeed;
        this.y = this.y + this.ySpeed;
        this.animingTime += commConfig.bubblesConfig.timeStep;
    } else {
        this.setNewDirection();
    }

    if (this.x > width || this.x < 0) {
        this.ySpeed = -this.ySpeed;
        this.x = Math.random() * width;
    }
    if (this.y > height || this.y < 0) {
        this.xSpeed = -this.xSpeed;
        this.y = Math.random() * height;
    }

    this.bubble
        .attr("x", this.x)
        .attr("y", this.y);

};

function Bubbles(option) {
    var bubblesCon = option.svg.append("g")
        .attr("class", "bubblesCon")
        .attr("width", width)
        .attr("height", height);
    var bubblesConfig = commConfig.bubblesConfig;
    var bubble, bubbles = [];
    for (var i = 0; i < bubblesConfig.num; i++) {
        bubbles.push(new Bubble({bubblesCon: bubblesCon}));
    }
    this.bubbles = bubbles;
}

Bubbles.prototype.render = function (elapsed) {
    var l = this.bubbles.length;
    for (var i = 0; i < l; i++) {
        this.bubbles[i].move();
    }
};

function TagCloud() {
    var tagEle = "querySelectorAll" in document ? document.querySelectorAll(".tag") : getClass("tag"),
        paper = "querySelectorAll" in document ? document.querySelector(".tagBall") : getClass("tagBall")[0];
    var padding = width * .1;
    var RADIUS = width * 0.4,
        fallLength = width * 0.9,
        tags = [],
        angleX = -0.005,
        angleY = 0,
        CX = paper.offsetWidth / 2 + padding / 2,
        CY = paper.offsetHeight / 2 + padding,
        EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
        EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

    function getClass(className) {
        var ele = document.getElementsByTagName("*");
        var classEle = [];
        for (var i = 0; i < ele.length; i++) {
            var cn = ele[i].className;
            if (cn === className) {
                classEle.push(ele[i]);
            }
        }
        return classEle;
    }

    function innit() {
        for (var i = 0; i < tagEle.length; i++) {
            var a, b;
            var k = (2 * (i + 1) - 1) / tagEle.length - 1;
            var a = Math.acos(k);
            var b = a * Math.sqrt(tagEle.length * Math.PI);
            // var a = Math.random()*2*Math.PI;
            // var b = Math.random()*2*Math.PI;
            var x = RADIUS * Math.sin(a) * Math.cos(b);
            var y = RADIUS * Math.sin(a) * Math.sin(b);
            var z = RADIUS * Math.cos(a);
            console.log("x,y,z" + x + "," + y + "," + z)
            var t = new tag(tagEle[i], x, y, z);
            tags.push(t);
            t.move();
        }
    }

    Array.prototype.forEach = function (callback) {
        var l = this.length;
        for (var i = 0; i < l; i++) {
            callback.call(this[i]);
        }
    };

    function animate() {
        rotateX();
        rotateY();
        tags.forEach(function () {
            this.move();
        })
    }

    function rotateX() {
        var cos = Math.cos(angleX);
        var sin = Math.sin(angleX);
        tags.forEach(function () {
            var y1 = this.y * cos - this.z * sin;
            var z1 = this.z * cos + this.y * sin;
            this.y = y1;
            this.z = z1;
        });
    }

    function rotateY() {
        var cos = Math.cos(angleY);
        var sin = Math.sin(angleY);
        tags.forEach(function () {
            this.x = this.x * cos - this.z * sin;
            this.z = this.z * cos + this.x * sin;
        });
    }

    var tag = function (ele, x, y, z) {
        this.ele = ele;
        this.x = x;
        this.y = y;
        this.z = z;
    };

    tag.prototype = {
        move: function () {
            var scale = fallLength / (fallLength - this.z);
            var alpha = (this.z + RADIUS) / (2 * RADIUS);
            this.ele.style.fontSize = 30 / 75 * scale + "rem";
            this.ele.style.opacity = alpha + 0.5;
            this.ele.style.filter = "alpha(opacity = " + (alpha + 0.5) * 100 + ")";
            this.ele.style.zIndex = parseInt(scale * 100);
            this.ele.style.left = (this.x + CX - this.ele.offsetWidth / 2) + "px";
            this.ele.style.top = ((this.y + CY - this.ele.offsetHeight / 2) / 1.6 ) + "px";
        }
    };
    innit();
    this.render = animate;
}

function SceneConstructor(options) {
    var t = this;
    this.scene = options.scene;
    this.timer = null;
    this.config = {};

    this.svg = d3.select("#item-" + options.scene)
        .select("svg.sceneSvg");
    this.svg.attr("height", height);

    switch (options.scene) {
        case "index":
            this.config = $.extend({
                boat: {
                    url: "index-2.png",
                    angle: -10,
                    offset: 0
                },
                stars: [
                    {
                        index: 3,
                        position: {
                            x: 82,
                            y: 57
                        }
                    },
                    {
                        index: 2,
                        position: {
                            x: 629,
                            y: 170
                        }
                    },
                    {
                        index: 4,
                        position: {
                            x: 625,
                            y: 972
                        }
                    },
                    {
                        index: 5,
                        position: {
                            x: 135,
                            y: 872
                        }
                    }
                ]
            }, this.config);
            break;
        case "dearTeacher":
            this.config = $.extend({
                boat: {
                    url: "statics-3.png",
                    angle: 0,
                    offset: -3
                },
                stars: [
                    {
                        index: 3,
                        position: {
                            x: 82,
                            y: 57
                        }
                    },
                    {
                        index: 2,
                        position: {
                            x: 629,
                            y: 170
                        }
                    },
                    {
                        index: 4,
                        position: {
                            x: 625,
                            y: 972
                        }
                    },
                    {
                        index: 5,
                        position: {
                            x: 135,
                            y: 872
                        }
                    }
                ]
            }, this.config);
            break;
        case "lastYear":
            this.config = $.extend({
                boat: {
                    url: "statics2-4.png",
                    angle: 5,
                    offset: -3
                }
            }, this.config);
            break;
        case "noRecord":
            this.config = $.extend({
                boat: {
                    url: "no-data-5.png",
                    angle: -7,
                    offset: 20
                }
                /*  stars:[
                 {
                 index:3,
                 position:{
                 x:30,
                 y:239
                 }
                 },
                 {
                 index:6,
                 position:{
                 x:481,
                 y:984
                 }
                 }
                 ]
                 */

            }, this.config);
            break;
        case "pieChart":
            this.config = $.extend({
                boat: false,
                stars: [
                    {
                        index: 2,
                        position: {
                            x: 78,
                            y: 55
                        }
                    }
                ]
            }, this.config);
            break;
        case "youLearn":
            this.config = $.extend({
                boat: {
                    url: "only-one-6.png",
                    angle: -6,
                    offset: 15
                },
                stars: [
                    {
                        index: 3,
                        position: {
                            x: 77,
                            y: 65
                        }
                    }
                ]
            }, this.config);
            break;
        case "yourRelation":
            this.config = $.extend({
                boat: {
                    url: "relations1-8.png",
                    angle: 10,
                    offset: height * 10/1334
                },
                stars: [
                    {
                        index: 2,
                        position: {
                            x: 79,
                            y: 52
                        }
                    },
                    {
                        index: 1,
                        position: {
                            x: 612,
                            y: 970
                        }
                    }
                ]
            }, this.config);
            break;
        case "yourRelation-no":
            this.config = $.extend({
                boat: {
                    url: "relations2-7.png",
                    angle: 0,
                    offset:-height*10/1334
                }
            }, this.config);
            break;
        /*您的名片*/
        case "yourCard":
            this.config = $.extend({
                boat: false,
                stars: [
                    {
                        index: 2,
                        position: {
                            x: 79,
                            y: 52
                        }
                    },
                    {
                        index: 1,
                        position: {
                            x: 612,
                            y: 970
                        }
                    }
                ]
            }, this.config);
            t.tagCloud = new TagCloud();
            break;
        case "share":
            this.config = $.extend({}, this.config);
            break;
        case "downloadApp":
            this.config = $.extend({}, this.config);
            break;
    }


    this.wavesAndBoat = new WavesAndBoat({scene: this.scene, svg: this.svg, boat: this.config.boat});
    this.greenDots = new GreenDots({svg: this.svg});
    try {
        this.stars = new Stars({
            svg: this.svg,
            stars: this.config.stars
        });
    } catch (e) {
        console.info(e.message);
    }
    this.bubbles = new Bubbles({svg: this.svg});
}

SceneConstructor.prototype = {
    render: function (elapsed) {
        var t = this;
        t.wavesAndBoat.render(elapsed);
        t.greenDots.render(elapsed);
        t.bubbles.render(elapsed);
        if (t.tagCloud) {
            t.tagCloud.render();
        }
    },
    start: function () {
        var t = this;
        var elapsed = 0;
        debug && console.log(this.scene + "-start");
        this.timer = setInterval(function () {
            t.render(elapsed);
            elapsed += 4;
        }, 30);
        if (this.scene == "yourCard") {
            if ($("#Qrcode").has("canvas").size() == 0) {
                $("#Qrcode").qrcode({
                    text: "https://m.allinmd.cn/pages/column/data_cube2/feedback.html?customerId=" + shareCustomerId,
                    width: 220,
                    height: 220,
                    correctLevel: 0
                });
            }
        }
    },
    stop: function () {
        clearInterval(this.timer);
        this.timer = null;
        debug && console.log(this.scene + "-stop");
        this.svg.selectAll("g").remove();
    }
};

