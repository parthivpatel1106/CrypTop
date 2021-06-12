//document.getElementsByClassName("percentChange")
for(let i=0;i<5;i++)
{
    var data=document.getElementsByClassName("percentChange")
    if(parseFloat(data[i].innerHTML)>=0)
    {
        data[i].style.color="green"
        
    }
    else{
        data[i].style.color="red"
    }
}