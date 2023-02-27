// Scatterplot
import {Component} from "react";
import * as d3 from "d3";

export default class ScatterPlotChart extends Component {

    constructor(props) {
        super(props);
        // Graph width and height - accounting for margins
        this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
        this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;

    }


    componentDidMount() {
        this.update();
    }
    // Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
    componentDidUpdate() {
        this.update();
    }
    updateScales() {

        // Calculate limits
        let xMin = d3.min(this.props.developingData, (d) => +d.x * .9);
        let xMax = d3.max(this.props.developingData, (d) => +d.x * 1.1);
        let yMin = d3.min(this.props.developingData, (d) => +d.y * .9);
        let yMax = d3.max(this.props.developingData, (d) => +d.y * 1.1);

        // Define scales
        this.xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, this.drawWidth])
        this.yScale = d3.scaleLinear().domain([yMax, yMin]).range([0, this.drawHeight])

        if (this.props.developingData.length) {
           let lg= this.calcLinear(this.props.developingData,this.props.xTitle,this.props.yTitle,xMin,yMin);
         // a function to add the  above line to the chart
            this.addLinear(lg);


        }
    }
    //create addLinear function
    addLinear(lg){
        //add the line lg to the chart
        d3.select(this.chartArea).append("path")
            .datum(lg)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return this.xScale(d.x) })
                .y(function(d) { return this.yScale(d.y) })
            )

    }
    updatePoints() {
        // Define hovers
        // Add tip
        // let tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
        //     return d.label;
        // });

        // Select all circles and bind data
        let developingCircles = d3.select(this.chartArea).selectAll('developingCircles').data(this.props.developingData);
        // Use the .enter() method to get your entering elements, and assign their positions
        developingCircles.enter().append('circle')
            .merge(developingCircles)
            .attr('r', (d) => this.props.radius)
            .attr('fill', "#f46d43")
            .attr('label', (d) => d.label)
            .style('fill-opacity', 0.3)
            .transition().duration(500)
            .attr('cx', (d) => this.xScale(d.x))
            .attr('cy', (d) => this.yScale(d.y))
            .style('stroke', "black")
            .style('stroke-width', (d) => d.selected === true ? "3px" : "0px")

        let developedCircles = d3.select(this.chartArea).selectAll('developedCircles').data(this.props.developedData);
        // Use the .enter() method to get your entering elements, and assign their positions
        developedCircles.enter().append('circle')
            .merge(developedCircles)
            .attr('r', (d) => this.props.radius)
            .attr('fill', "#66c2a5")
            .attr('label', (d) => d.label)
            .style('fill-opacity', 0.3)
            .transition().duration(500)
            .attr('cx', (d) => this.xScale(d.x))
            .attr('cy', (d) => this.yScale(d.y))
            .style('stroke', "black")
            .style('stroke-width', (d) => d.selected === true ? "3px" : "0px")

        // Use the .exit() and .remove() methods to remove elements that are no longer in the data
        developingCircles.exit().remove();
        developedCircles.exit().remove();
        // Add hovers using the d3-tip library
        // d3.select(this.chartArea).call(tip);
    }
    updateAxes() {
        let xAxisFunction = d3.axisBottom()
            .scale(this.xScale)
            .ticks(10, 's');

        let yAxisFunction = d3.axisLeft()
            .scale(this.yScale)
            .ticks(10, 's');

        d3.select(this.xAxis)
            .call(xAxisFunction);

        d3.select(this.yAxis)
            .call(yAxisFunction);
    };
    //An optimized function to  calculate linear regression using d3
    linearRegression(data,color) {
        let x = data.map(d => +d.x);
        let y = data.map(d => +d.y);
        let xBar = d3.mean(x);
        let yBar = d3.mean(y);
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < x.length; i++) {
            numerator += (x[i] - xBar) * (y[i] - yBar);
            denominator += (x[i] - xBar) * (x[i] - xBar);
        }
        let m = numerator / denominator;
        let b = yBar - m * xBar;
        let x1 = d3.min(x);
        let y1 = m * x1 + b;
        let x2 = d3.max(x);
        let y2 = m * x2 + b;
        let scaleX=this.xScale;
        let scaleY=this.yScale;
        let lineData=   [[x1, y1, x2, y2]];
        let line = d3.line()
            .x(function (d) {
                return scaleX(d);
            })
            .y(function (d) {
                return scaleY(d);
            });
        console.log(color,{lineData})
        let lines = d3.select(this.chartArea).selectAll('lines').data(lineData);
        lines.enter()
            .append('path')
            .attr('class', 'line')
            .merge(lines)
            .attr('d', line)
            .attr('stroke', color)
            .attr('stroke-width', 5)
            .attr('fill', 'none');
        lines.exit().remove();
    }
    // Calculate a linear regression from the data

    // Takes 5 parameters:
    // (1) Your data
    // (2) The column of data plotted on your x-axis
    // (3) The column of data plotted on your y-axis
    // (4) The minimum value of your x-axis
    // (5) The minimum value of your y-axis

    // Returns an object with two points, where each point is an object with an x and y coordinate

     calcLinear(data, x, y, minX, minY){
        /////////
        //SLOPE//
        /////////

        // Let n = the number of data points
        let n = data.length;

        // Get just the points
        let pts = [];
        data.forEach(function(d,i){
            let obj = {};
            obj.x = d.x;
            obj.y = d.y;
            obj.mult = obj.x*obj.y;
            pts.push(obj);
        });

        // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
        // Let b equal the sum of all x-values times the sum of all y-values
        // Let c equal n times the sum of all squared x-values
        // Let d equal the squared sum of all x-values
        let sum = 0;
        let xSum = 0;
        let ySum = 0;
        let sumSq = 0;
        pts.forEach(function(pt){
            sum = sum + pt.mult;
            xSum = xSum + parseInt(pt.x);
            ySum = ySum + parseInt(pt.y);
            sumSq = sumSq + (parseInt(pt.x) * parseInt(pt.x));
        });
        let a = sum * n;
        let b = xSum * ySum;
        let c = sumSq * n;
        let d = xSum * xSum;
console.log({a,b,c,d})
        // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
        // slope = m = (a - b) / (c - d)
        let m = (a - b) / (c - d);

        /////////////
        //INTERCEPT//
        /////////////

        // Let e equal the sum of all y-values
        let e = ySum;

        // Let f equal the slope times the sum of all x-values
        let f = m * xSum;

        // Plug the values you have calculated for e and f into the following equation for the y-intercept
        // y-intercept = b = (e - f) / n
        let bi = (e - f) / n;

        // Print the equation below the chart
console.log("y = " + m + "x + " + bi);
        // document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + bi + " ) / " + m;

        // return an object of two points
        // each point is an object with an x and y coordinate
        return {
            ptA : {
                x: minX,
                y: m * minX + bi
            },
            ptB : {
                y: minY,
                x: (minY - bi) / m
            }
        }

    }

    update() {
        d3.selectAll("circle").remove();
        d3.selectAll(".line").remove();
        this.updateScales();
        this.updateAxes();
        this.updatePoints();
    }
    render() {
        return (
            <div className="chart-wrapper">
                <svg className="chart" width={this.props.width} height={this.props.height}>
                    <text transform={`translate(${this.props.margin.left},15)`}>{this.props.title}</text>
                    <g ref={(node) => { this.chartArea = node; }}
                       transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`} />

                    {/* Axes */}
                    <g ref={(node) => { this.xAxis = node; }}
                       transform={`translate(${this.props.margin.left}, ${this.props.height - this.props.margin.bottom})`}></g>
                    <g ref={(node) => { this.yAxis = node; }}
                       transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}></g>

                    {/* Axis labels */}
                    <text className="axis-label" transform={`translate(${this.props.margin.left + this.drawWidth / 2}, 
                        ${this.props.height - this.props.margin.bottom + 30})`}>{this.props.xTitle}</text>

                    <text className="axis-label" transform={`translate(${this.props.margin.left - 30}, 
                        ${this.drawHeight / 2 + this.props.margin.top}) rotate(-90)`}>{this.props.yTitle}</text>
                </svg>
            </div>

        )
    }
}

ScatterPlotChart.defaultProps = {
    developingData: [{ x: 10, y: 20}, { x: 15, y: 35}],
    developedData: [{ x: 10, y: 20}, { x: 15, y: 35}],
    width: 300,
    height: 300,
    radius: 5,
    margin: {
        left: 50,
        right: 10,
        top: 20,
        bottom: 50
    },
    xTitle: "X Title",
    yTitle: "Life Expectancy",
};
