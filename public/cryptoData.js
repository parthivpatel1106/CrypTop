console.log("hello")
var price=document.getElementById("priceConvert").innerText
var market=document.getElementById("marketConvert").innerText
var usdPrice=parseFloat(price.substr(2,price.length))
var marketCap=parseFloat(market.substr(2,market.length))

document.getElementById("convertBtn").addEventListener("click",function(){
    if(document.getElementById("convertBtn").innerHTML==="Price in INR"){
        var inrPrice=usdPrice*73.23
        var inrMarket=marketCap*73.23.toFixed(0)
        document.getElementById("priceConvert").innerHTML="₹ "+inrPrice
        document.getElementById("marketConvert").innerHTML="₹ "+inrMarket
        document.getElementById("convertBtn").innerHTML="Price in USD"
    }
    else
    {
        document.getElementById("priceConvert").innerHTML="$ "+usdPrice
        document.getElementById("marketConvert").innerHTML="$ "+marketCap
        document.getElementById("convertBtn").innerHTML="Price in INR"
    }
    document.getElementById("notice").innerHTML="*price may varies"
})


document.getElementById("watchlistBtn").addEventListener("click",function(){
    document.getElementById("watchListNotice").innerHTML="Added to watchlist"
})


for(let i=0;i<3;i++)
{
    var data=document.getElementsByClassName("percentData")
    console.log(data.length)
    if(parseFloat(data[i].innerHTML)>=0)
    {
        data[i].style.color="green"
    }
    else if(parseFloat(data[i].innerHTML)<0)
    {
        data[i].style.color="red"
    }
}

const chartData = {
    labels: [
      'World Crypto currency total marketcap',
      'current coin market cap',
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [2000000000000,marketCap ],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 4
    }]
  };
var ctx = document.getElementById('myChart')
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: {
        plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});