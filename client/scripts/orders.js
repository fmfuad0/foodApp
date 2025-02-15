window.onload = loadOrders 

async function loadOrders () {
    console.log("Loading orders");

        const res = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": "fmfuad", 
                "password": "password" }),
            mode: "cors"
        });

        const user = (await res.json()).data;
        console.log(user);
        const statusFilter = document.getElementById("orderSelector").value
        console.log("Filter : ", statusFilter);
        
        
        const response = await fetch(`http://localhost:3000/api/v1/order/user-orders/c/${statusFilter}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken
            }
        });
        console.log(response.ok);
        
        const data = (await response.json());
        const orders = data.data;
        document.getElementById('ordersTable').innerHTML=`<tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th> 
        </tr>`
        if(orders.length === 0){
            const el = document.createElement('h1')
            el.innerHTML = "NO ORDERS FOUND"
            document.getElementById('ordersTable').appendChild(el)
            return ;
        }

        orders.forEach(order => {
            console.log();
            
            const orderElem = document.createElement('tr')
            orderElem.innerHTML =
            `<td>${order._id}</td>
            <td>${(new Date(order.createdAt).toLocaleDateString()+ "\n" + new Date(order.createdAt).toLocaleTimeString())}</td>
            <td>1</td>
            <td>${order.totalOrderPrice}</td>
            <td>${order.status}</td>`
        console.log(orderElem);
        
        document.getElementById('ordersTable').appendChild(orderElem)
        });
}

document.getElementById('getOrders').addEventListener('click', async (e)=>{
    e.preventDefault();
    console.log("selected");
    loadOrders();
})