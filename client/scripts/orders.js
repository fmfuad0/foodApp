
window.onload = loadOrders


let user = undefined
async function login() {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": "fmfuad",
            "password": "password"
        }),
        mode: "cors"
    });

    user = (await res.json()).data;
    console.log(user);
    if (user)
        return user;
    else
        return null;
}

async function loadOrders() {
    console.log("Loading orders");
    if (!user)
        await login();
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
    document.getElementById('ordersTable').innerHTML = `<tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th> 
        </tr>`
    if (orders.length === 0) {
        const el = document.createElement('h1')
        el.innerHTML = "NO ORDERS FOUND"
        document.getElementById('ordersTable').appendChild(el)
        return;
    }
    orders.forEach(order => {

        const orderElem = document.createElement('tr')
        orderElem.innerHTML =
            `<td>${order._id}</td>
            <td>${(new Date(order.createdAt).toLocaleDateString() + "\n" + new Date(order.createdAt).toLocaleTimeString())}</td>
            <td>1</td>
            <td>${order.totalOrderPrice}</td>
            <td>${order.status}</td>
            <td>
                <select name="orderActionSelector" style= "display:block; margin-bottom:10px" id="${order._id}selector">
                    <option value="" selected>Chose Order action </option>
                    <option value="view" style="background-color:gray; color:white">View Order</option>
                    <option value="cancel" style="background-color:red; color:black">Cancel Order</option>
                    <option value="deliver" style="background-color:green; color:black;">Deliver order </option>
                </select>
                <button id="${order._id}" onclick="orderActionController(this.id)"> Take action</button></td>
            `
        // console.log(orderElem);
        
        document.getElementById('ordersTable').appendChild(orderElem)
        // console.log(document.getElementById(order._id));
    });+
    console.log(orders.length+" Orders loaded");
}


async function orderActionController(orderId) {
    console.log("function called");
    if(!user)
        login()
    const action = document.getElementById(`${orderId}selector`).value
    if (!action)
        console.log("select an option");
    else {
        console.log(`${action}  ${orderId} : Execute`);
        let url;
        switch (action) {
            case "view": {
                url = `http://localhost:3000/api/v1/order/c/${orderId}`
                console.log("viewed");
                break;
            }
            case "cancel": {
                url = `http://localhost:3000/api/v1/order/cancel/c/${orderId}`
                console.log("cancel");
                break;
            }
            case "deliver": {
                const res = await fetch(`http://localhost:3000/api/v1/order/toggle/c/${orderId}/c/waiting-to-be-recieved`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.accessToken
                    },
                }); 
                console.log((await res.json()).data);
                
                url = `http://localhost:3000/api/v1/order/deliver/c/${orderId}`
                break;
            }

        }
        console.log(url);
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.accessToken
                },
            }); 
            if(res.ok){
                const data = (await res.json()).data;
                console.log(data);
                if(action==='view'){
                    document.getElementById('orderItem').innerHTML=`
                    <h2>ID: ${data._id}</h2>
                    <h3>Cart: ${data.cart}</h3>
                    <h3>Payment: ${data.payment}</h3>
                    <h3>Driver: ${data.driver}</h3>
                    <h3>Total Price: ${data.totalOrderPrice}</h3>
                    <h3>Owner: ${data.orderedBy}</h3>
                    <h3>Status: ${data.status}</h3>
                    `;
                    document.getElementById('orderViewer').removeAttribute('hidden')
                }
                console.log(`Order ${action}ed`);
            }else {
            console.log("Could not complete action");
        }
        loadOrders();
    }

}

document.getElementById('getOrders').addEventListener('click', async (e) => {
    e.preventDefault();
    console.log("selected");
    loadOrders();
})

document.getElementById('close').addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('orderItem').innerHTML=``
    document.getElementById('orderViewer').hidden=true
    // loadOrders();
})