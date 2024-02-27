const dateElement = document.getElementById("date");
let currentDate = new Date();
let dateOptions = { year: "numeric", month: "long", day: "numeric" };

dateElement.textContent = currentDate.toLocaleDateString("en-US", dateOptions)

const url = 'https://twitter-trends5.p.rapidapi.com/twitter/request.php';
const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': 'bc38d47283mshb42c4aab7e33114p140e7cjsn6eefaab8788a',
		'X-RapidAPI-Host': 'twitter-trends5.p.rapidapi.com'
	},
	body: new URLSearchParams({woeid: '23424934'})
};

let graphData = [];

fetch(url, options)
.then(res => res.json())
.then(data => {

    for(let i = 0; i <= 25; i++){
        graphData.push(
            {
                "name": data.trends[i].name,
                "queryUrl": data.trends[i].url,
                "volume": data.trends[i].volume
            }
        )
    }

    let topics = graphData.map(object => {
        return object.name
    })

    let volumes = graphData.map(object => {
        return object.volume
    })

    let queryUrls = graphData.map(object => {
        return object.queryUrl
    })

    const myChart = document.getElementById('myChart');

    let barChart = new Chart(myChart, {
        type: 'bar',
        data: {
        labels: topics,
        datasets: [{
            label: 'Total Hashtags',
            data: volumes,
            borderWidth: 2,
            labelLinks: queryUrls,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            hoverBackgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ]
        }]
        },
        options: {
            indexAxis: "y",
            scales: {
                y: {
                beginAtZero: true
                }
            }
        }
    });

    barChart.canvas.addEventListener("click", (e) => {
        clickableLabels(barChart, e);
    });
})

function openFullScreenPopup(searchQuery) {
    let url = searchQuery; // URL of the website you want to load
    let width = screen.width;
    let height = screen.height;
    let options = `width=${width}, height=${height}, top=0, left=0, fullscreen=yes, scrollbars=yes`;

    // window.open("https://twitter.com/home", '_blank', options);
    window.open(url, '_blank', options);
}

function clickableLabels(chart, click) {
    const {ctx, canvas, scales: {x, y}} = chart;

	const top = y.top;
	const left = y.left;
	const right = y.right;
	const bottom = y.bottom;
	const height = y.height / y.ticks.length;

	let rect = canvas.getBoundingClientRect();

    const xCoordinate = click.clientX - rect.left;
	const yCoordinate = click.clientY - rect.top;

    for(let i = 0; i < y.ticks.length; i++) {

		if(xCoordinate >= left && xCoordinate <= right && yCoordinate >= top + (height * i) && yCoordinate <= top + height + (height * i)) {
			
			chart.data.datasets[0].labelLinks[i];

			console.log(`https://twitter.com/${chart.data.datasets[0].labelLinks[i]}`);

			openFullScreenPopup(`https://twitter.com/${chart.data.datasets[0].labelLinks[i]}`);

		}
	}
}