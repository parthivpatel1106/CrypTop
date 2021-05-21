var tabSwap=document.getElementsByClassName("tab-header")[0].getElementsByTagName("div");
for(let i=0;i<tabSwap.length;i++)
{
    tabSwap[i].addEventListener("click",function(){
        document.getElementsByClassName("tab-header")[0].getElementsByClassName("active")[0].classList.remove("active")
        tabSwap[i].classList.add("active")
        document.getElementsByClassName("tab-content")[0].getElementsByClassName("active")[0].classList.remove("active")
        document.getElementsByClassName("tab-content")[0].getElementsByClassName("tab-page")[i].classList.add("active")
    })
}