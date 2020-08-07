import * as d3 from 'd3'
import random from 'random'
import './style.scss'


window.start = () => {

	let width = 800, height = 500

	const makeData = (n, xrange, yrange) => (
		new Array(n).fill(1)
		.map(a => [random.int(1, xrange), random.int(1, yrange)])
		.sort((a, b) => b[0] - a[0])
	)

	let data = makeData(25, 200, 200)
	let data2 = makeData(25, 200, 200)

	let scX = d3.scaleLinear()
	.domain(d3.extent(data.concat(data2), d => d[0]))
	.range([0, width - 10])

	let scY = d3.scaleLinear()
	.domain(d3.extent(data.concat(data2), d => d[1]))
	.range([height - 10, 0])

	let svg = d3.select('svg')
	.attr('width', width).attr('height', height)
	.style('border', '0.5px solid black')

	let xAxis = d3.axisTop().scale(scX)
	let yAxis = d3.axisRight().scale(scY)

	svg.append('g')
	.attr('transform', `translate(0, ${height})`)
	.call(xAxis)

	svg.append('g').call(yAxis)

	let lineMkr = d3.line().x(d => scX(d[0])).y(d => scY(d[1]))

	let lineGrph = svg.append('g')
	.append('path')
	.attr('fill', 'none')
	.attr('stroke', 'black')
	.attr('d', lineMkr(data))

	let dots = svg.append('g')
	.selectAll('circle')
	.data(data).enter().append('circle')
	.attr('cx', d => scX(d[0]))
	.attr('cy', d => scY(d[1]))
	.attr('fill', 'blue')
	.attr('stroke-width', '.5')
	.attr('stroke', 'black')
	.attr('r', 4)

	lineGrph.call(animateLineGraph)

	console.log(data)

	let ds = 1

	function animateLineGraph(lg) {
		let len = lg.node().getTotalLength()

		lg.attr('stroke-dasharray', len + ' ' + len)
		.attr('stroke-dashoffset', -len)
		.transition()
		.duration(500)
		.ease(d3.easeCubic)
		.attr('stroke-dashoffset', 0)
	}

	svg.on('click', () => {
		[data, data2] = [data2, data]
		console.log(data)
		ds == 1 ? ds = 2 : ds = 1

		let len = lineGrph.node().getTotalLength()

		dots.data(data)
		.transition().duration(500)
		.attr('cx', d => scX(d[0]))
		.attr('cy', d => scY(d[1]))
		.attr('fill', ds == 1 ? 'blue' : 'red')
		.attr('r', 4)
		.attr('stroke-width', '.5')
		.attr('stroke', 'black')

		lineGrph.attr('d', lineMkr(data))

		lineGrph.call(animateLineGraph)
	})


}
