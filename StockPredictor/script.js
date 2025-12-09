import { dates } from './dates.js'
import OpenAI from 'openai'

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

const OPENAI_API_KEY =
    import.meta.env.VITE_POLYGON_API_KEY;


async function FetchReport(data) {
    try {
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY
        })

        const messages = [{
            role: 'system',
            content: `You are a successful, strategic stock broker. 
            Given data on shares prices over 3 days, write a report of no more tham 150 words 
            describing the stock performance and recommending whether to buy, hold or sell.
            Use examples provided between *** to set the style of your output`
        }, {
            role: 'user',
            content: `${data}
            ***
            🚀 The Whimsical Tale of TSLA Stock 🤖
            TSLA, a stock as electric as its cars, is a rollercoaster ride powered by innovation and tweets! It's not just a car company; 
            it's a dream factory churning out robots (Optimus!), battery packs, and self-driving software.
            Analysts are currently playing a game of "Pin the Tail on the Price Target," with most settling on a Hold 🤝 rating. 
            The bulls cheer its AI dominance and energy business, while the bears grumble about high valuation (P/E over 300x!), margin pressures, and competition trying to steal its thunder. A recent downgrade by a major bank suggests the current price is a little too zippy.
            The Verdict: If you're holding a ticket from way back, you might Hold tight for the Robotaxi/Optimus reveal. 
            For new players, a Hold or cautious Sell might be wiser, waiting for a less bubbly entry point. 
            Remember: this stock is a high-speed chase, not a cozy Sunday drive!
            ***
            `
        }]

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 1.1,
            presence_penalty: 0,
            frequency_penalty: 0
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(`There was an error loading stock report ${report}`)
        loadingArea.textContent = 'Unable to access AI. Please refresh te page.'
    }
}

function RenderOutput(data) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const output = document.createElement('p')
    outputArea.appendChild(output)
    output.textContent = FetchReport(data)
    outputArea.style.display = 'flex'
}