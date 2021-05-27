var navLink=document.getElementsByClassName("navbar-nav")[0].getElementsByTagName("li")
console.log(navLink.length)
for(let i=0;i<navLink.length;i++)
{
    navLink[i].addEventListener("click",function(){
       var current=document.getElementsByClassName("active-link")
       current[0].className=current[0].className.replace("active-link","")
       this.className+=" active-link"
    });
}
