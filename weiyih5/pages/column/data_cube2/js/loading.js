/**
 * Created by LiuYuTao on 2016/12/8.
 */
var loadingEffect = {
    interval: null,
    start: function () {
        var t = this;
        var loadingConfig = {
            circleRadius: 150,
            dotNum: 30,
            jumpNum: 3,
            lineFadedDuaring: 1500,
            lineStayTime: 2000,
            lineFlyTime: 500
        };

        var svg = d3.select("#loading")
            .attr("width", loadingConfig.circleRadius * 2)
            .attr("height", loadingConfig.circleRadius * 2);

        var circleWidth = svg.attr("width");
        var circleHeight = svg.attr("height");

        var circles = svg.append("g")
            .attr("id", "circles");
        var data = d3.range(loadingConfig.dotNum);
        circles.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "white")
            .attr("r", 2)
            .attr("data-index", function (d) {
                return d;
            })
            .attr("cx", function (d) {
                return Math.sin(d / loadingConfig.dotNum * 6.28) * loadingConfig.circleRadius + loadingConfig.circleRadius;
            })
            .attr("cy", function (d) {
                return Math.cos(d / loadingConfig.dotNum * 6.28) * loadingConfig.circleRadius + loadingConfig.circleRadius;
            });


        function lineAnimation() {
            var dotIndex = 0;
            var jump = loadingConfig.jumpNum;
            var currentJump = jump;
            var lastRoundNum, currentRoundNum;
            currentRoundNum = lastRoundNum = 0;
            t.interval = setInterval(function () {
                dotIndex += jump;
                currentRoundNum = parseInt((dotIndex / loadingConfig.dotNum));
                if (currentRoundNum != lastRoundNum) {
                    jump++;
                    currentRoundNum = lastRoundNum++;
                }
                drawLine(dotIndex % loadingConfig.dotNum, (dotIndex + jump) % loadingConfig.dotNum);
            }, loadingConfig.lineFlyTime)
        }


        function drawLine(index1, index2) {
            var seed1 = index1 / loadingConfig.dotNum * 6.28;
            var seed2 = index2 / loadingConfig.dotNum * 6.28;
            var x1 = Math.sin(seed1) * loadingConfig.circleRadius + loadingConfig.circleRadius;
            var x2 = Math.sin(seed2) * loadingConfig.circleRadius + loadingConfig.circleRadius;
            var y1 = Math.cos(seed1) * loadingConfig.circleRadius + loadingConfig.circleRadius;
            var y2 = Math.cos(seed2) * loadingConfig.circleRadius + loadingConfig.circleRadius;
            var path = svg.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x1)
                .attr("y2", y1)
                .attr("stroke-width", 1)
                .attr("stroke", "white");

            console.log("drawLine" + index1 + "----" + index2);
            path.transition()
                .duration(loadingConfig.lineFlyTime)
                .attr("x2", x2)
                .attr("y2", y2);

            /* setTimeout(function () {
             path.transition()
             .duration(loadingConfig.lineFadedDuaring)
             .attr("opacity",0)
             .remove()
             },loadingConfig.lineStayTime)*/
        }

        lineAnimation();
    },
    stop: function () {
        clearInterval(this.interval);
        this.interval = null;
        $(".loadingMask").fadeOut().remove();
    }
};
loadingEffect.start();