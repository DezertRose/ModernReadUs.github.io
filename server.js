async function fetchData() {
    return  fetch('https://my-json-server.typicode.com/DezertRose/ModernReadUs.github.io/db',{
    method: "GET",  headers: {"content-type": "application/json"}})
    .then(result => result.json())
    .then(data => {return data;})
}


async function postOrder(Order) {
    return fetch('https://my-json-server.typicode.com/DezertRose/ModernReadUs.github.io/posts',{
        method: "POST",
        body: JSON.stringify(Order),
        headers: {'Content-type': 'application/json'}
    }).then(result => result.json())

    .then(data => {return data;})
    .catch(
        function (error) {
	        alert(error);
        }
    );
}
export {fetchData,postOrder};