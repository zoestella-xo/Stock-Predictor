import { dates } from './dates.js'

const tickersArr = []

document.querySelector('#ticker-input-form').addEventListener('click', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input')
    if (tickerInput.value.length > 2) {
        generateReportBtn.disabled = false
        const newTickerStr = tickerInput.value
        tickersArr.push(newTickerStr.toUpperCase())
        tickerInput.value = ''
        renderTickers()
    } else {
        const label = document.getElementsByTagName('label')[0]
        label.style.color = 'red'
        label.textContent = `You must add at least one ticker. A ticker is a 3 letter or more code for a stock. Eg TSLA for Tesla.`
    }
})


function renderTickers() {
    const tickersDiv = document.getElementById('tickers-choice-display')
    tickersDiv.innerHTML = ''
    tickersDiv.style.opacity = 1.0;
    tickersDiv.style.fontSize = '15px';
    tickersArr.forEach((ticker, index) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker + (index < tickersArr.length - 1 ? ', ' : '')
        newTickerSpan.classList.add('ticker')
        tickersDiv.appendChild(newTickerSpan)
    })
}


const generateReportBtn = document.getElementById('generate-report-btn')
generateReportBtn.addEventListener('click', fetchStock)


const loadingArea = document.getElementById('loading-panel')
const apiMessage = document.getElementById('api-message')

let POLYGON_API_KEY = null;
try {
    POLYGON_API_KEY =
        import.meta.env.VITE_POLYGON_API_KEY;
} catch (e) {
    POLYGON_API_KEY = null;
}


async function fetchStock() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArr.map(async(ticker) => {
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${POLYGON_API_KEY}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                apiMessage.textContent = 'Creating report...';
                return data;
            } else {
                const errorText = await response.text();
                loadingArea.innerText = `Error fetching ${ticker}: ${response.status} - ${errorText}`;
                return null;
            }
        }));
        await FetchReport(stockData);
        RenderOutput(stockData);
    } catch (err) {
        loadingArea.innerText = `There was an error loading stock data.`;
        console.error(`Error: ${err}`);
    }
}

async function FetchReport(data) {
    // TO DO LATER
    console.log('Stock data received:', data)
}

function RenderOutput(data) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const report = document.createElement('p')
    outputArea.appendChild(report)
    report.textContent = 'Stock data loaded. Report generation coming soon!'
    outputArea.style.display = 'flex'
}