console.log("hello")
var price=document.getElementById("priceConvert").innerText
var usdPrice=parseFloat(price.substr(2,price.length))

document.getElementById("convertBtn").addEventListener("click",function(){
    if(document.getElementById("convertBtn").innerHTML==="Price in INR"){
        var inrPrice=usdPrice*73.23
        document.getElementById("priceConvert").innerHTML="₹ "+inrPrice
        document.getElementById("convertBtn").innerHTML="Price in USD"
    }
    else
    {
        document.getElementById("priceConvert").innerHTML="$ "+usdPrice
        document.getElementById("convertBtn").innerHTML="Price in INR"
    }
    document.getElementById("notice").innerHTML="*price may varies"
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