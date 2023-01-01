
let input = document.querySelectorAll('input')
let chart = document.querySelectorAll('.col div'),
chartPar = document.querySelector('.chart'),
col = document.querySelectorAll('.col')

fetch('http://localhost:3000/voted_users')
    .then(res => res.json())
    .then(isUser => isTrue(isUser))
const isTrue = (userIp) => {

    fetch('http://localhost:3000/votings')
        .then(res => res.json())
        .then(data => loadData(data))
        .catch(err => console.log("Error is", err))
    function loadData(data) {
        let totalVote = data[0].votes + data[1].votes + data[2].votes
        fetch('https://geolocation-db.com/json/')
            .then(res => res.json())
            .then(users => CheckUsers(users.IPv4))
        function CheckUsers(user) {
            let checkUserIp = userIp.find(o => o.ip === user)
            if (checkUserIp === undefined) {
                chartPar.style.display = "none"
                input.forEach((item, index) => {
                    item.addEventListener('click', async () => {
                        let postUserIp = {
                            votes: data[index].votes + 1
                        }
                        await fetch(`http://localhost:3000/votings/${index + 1}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(postUserIp)
                        })
                        input.forEach((inp) => {
                            inp.setAttribute('disabled', "")
                        })
                        chartPar.style.display = "flex"
                        chart.forEach((dia, i) => {
                            let per = ((data[i].votes * 100) / totalVote).toFixed(1)
                            dia.setAttribute('data-per', per + "%")
                            dia.style.width = per + "%"
                        })
                        let ip ={
                            ip:user
                        }
                        await fetch('http://localhost:3000/voted_users',{
                            method:"POST",
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify(ip)
                        })
                    })
                })
            } else {
                chart.forEach((dia, i) => {
                    let per = ((data[i].votes * 100) / totalVote).toFixed(1)
                    col[i].setAttribute('data-per', per + "%")
                    dia.style.width = per + "%"
                })
                chartPar.setAttribute('data-message',"Siz ovoz berdingiz :)")
            }
        }
    }
}