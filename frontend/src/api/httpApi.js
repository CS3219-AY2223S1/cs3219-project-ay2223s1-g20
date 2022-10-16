// Prototype for frontend


// fetch to access API in question service
export function getQuestionFromQuestionService(req){
    return fetch('http://localhost:8383/question/id/'+req.params.id, { 
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())
        .then((response)=> {
            console.log("fetch from question service");
            console.log(response);
            return response;
        }).catch((error) => {
            throw new Error("Unable to retrieve question")
        })
}
