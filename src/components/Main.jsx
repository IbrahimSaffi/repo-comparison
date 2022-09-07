import { useRef, useState } from "react"

export default function Main() {
    let q = useRef(null)
    let [repos, setRepos] = useState([])
    let [popularRepo, setPopular] = useState(null)
    async function getRepo(q) {
        let baseUrl = `https://api.github.com`
        try {
            let res = await fetch(`${baseUrl}/repos/${q.split("/")[0]}/${q.split("/")[1]}`, {
                method: "GET",
                auth: "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",
            })
            let data = await res.json()
            let newReposArr = repos.slice()
            let duplicate = false
            newReposArr.forEach(ele=>{
                if(data.id===ele.id){
                    duplicate= true
                }
            })
            if (!duplicate) {
                newReposArr.push(data)
                console.log(data)
            }
            setRepos(newReposArr)
            if (newReposArr.length > 1) {
                
                let popular =null
                let maxNum = 0
                newReposArr.forEach(ele=>{
                    if(ele.stargazers_count>maxNum){
                        maxNum=ele.stargazers_count
                        popular=ele.id
                    }
                })
                setPopular(popular)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    function deleteRepo(i){
      let newRepoList= repos.slice()
      newRepoList.splice(i,1)
      setRepos(newRepoList)
    }
    return (
        <div className="container">
            <h1>Compare Wars</h1>
            <input ref={q} type="text" required />
            <button onClick={() => {
                if (q.current.value.includes("/")) {
                    getRepo(q.current.value)
                }
            }} className="blk-btn">Add to Comparison</button>
            <div className="cards">
            {repos.map((ele,i) => {
                return <div  className={ele.id===popularRepo?"card pop":"card"} >
                    <h1>{ele.full_name}</h1>
                    <p>{ele.description}</p>
                    <h1>Stars: {ele.stargazers_count}</h1>
                    <h1>Forks: {ele.forks_count}</h1>
                    <div className="row" >
                        <button className="rem" onClick={()=>deleteRepo(i)} >Remove</button>
                        <a target="_blank" href={ele.html_url}>
                            <button className="blk-btn" >
                                View Repo
                            </button>

                        </a>
                    </div>
                </div>
            })}
        </div>
            </div>
    )
}