// Scatter-plot
import {Component} from "react";
import * as d3 from "d3";
import {linearRegression, linearRegressionLine} from 'simple-statistics';
const DEVELOPING_COLOR = "#f46d43";
const DEVELOPED_COLOR = "#66c2a5";
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
           let lg2= this.calcLinear2(this.props.developingData,xMin,xMax);
          this.addLinear(lg2,DEVELOPING_COLOR);

        }
        if (this.props.developedData.length) {
            let lg2= this.calcLinear2(this.props.developedData,xMin,xMax);
            this.addLinear(lg2,DEVELOPED_COLOR);
        }
    }
    // a function named LinearRegressionLine to calculate the linear regression line using simple-statistics library
    calcLinear2(data,xMin,xMax){
        let regression = linearRegression(data.map(d => {
           return [Number(d.x), Number(d.y)]
        }))
        let line = linearRegressionLine(regression);
        const xCoordinates = [xMin, xMax];

        return xCoordinates.map(d => ({
            x: d,                         // We pick x and y arbitrarily, just make sure they match d3.line accessors
            y: line(d)
        }));
    }

    addLinear(lg,color="red"){
        let scaleX=this.xScale;
        let scaleY=this.yScale;
        let line =d3.line()
            .x(d => scaleX(d.x))
            .y(d => scaleY(d.y))
        let lines = d3.select(this.chartArea).selectAll('line').data([lg]);
        lines.enter()
            .append('path')
            .attr('class', 'line')
            .merge(lines)
            .attr('d', line)
            .attr('stroke', color)
            .attr('stroke-width', 4)
            .attr('fill', 'none');
        lines.exit().remove();
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
            .attr('fill', DEVELOPING_COLOR)
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
            .attr('fill', DEVELOPED_COLOR)
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
