
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
    // console.log(user);
    console.log("Performed Login");
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
    let url;
    switch(statusFilter){
        case "acceptedOrder":{
            document.getElementById('title').innerText = "PENDING ORDERS"
            url = `http://localhost:3000/api/v1/driver/accepted-orders/c/67a8d585f8a0ba68f4252d82`
            break;
        }
        case "preparing":{
            document.getElementById('title').innerText = "AVAILABLE ORDERS"
            url = `http://localhost:3000/api/v1/order/available-orders`
            break;
        }
        
    }
    const response = await fetch(url, {
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
            <td>${order.status}</td>
            <td>1</td>
            <td>${order.totalOrderPrice}</td>
            <td>
                <select name="orderActionSelector" style= "display:block; margin-bottom:10px" id="${order._id}selector">
                    <option value="" selected>Chose Order action </option>
                    <option value="accept" style="background-color:green; color:white">Accept Order</option>
                    <option value="decline" style="background-color:red; color:black">Decline Order</option>
                </select>
                <button id="${order._id}" onclick="orderActionController(this.id)"> Take action</button></td>
            `
        // console.log(orderElem);

        document.getElementById('ordersTable').appendChild(orderElem)
        // console.log(document.getElementById(order._id));
    }); +
        console.log(orders.length + " Orders loaded");
}


async function orderActionController(orderId) {
    console.log("function called");

    // Check if user is logged in, else prompt login
    if (!user) {
        login(); // Consider handling user login failure
        return;
    }

    const action = document.getElementById(`${orderId}selector`).value;
    
    // If no action selected
    if (!action) {
        console.log("Select an option");
        return;  // Exit early if no action is selected
    } else {
        console.log(`${action}  ${orderId} : Execute`);
        
        switch (action) {
            case "accept": {
                try {
                    console.log(user.accessToken);
                    
                    // Sending GET request to assign the driver to the order
                    const response = await fetch(`http://localhost:3000/api/v1/driver/assign/c/${orderId}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': user.accessToken
                        },
                    });
                    
                    
                    // If the response is not OK, throw an error
                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status} : `, response.message);
                    }
                    
                    // Handle successful response (assuming a JSON response)
                    const data = await response.json(); 
                    console.log("Order accepted:", data);
                    // Consider calling loadOrders() or updating UI after successful action
                    
                } catch (error) {
                    console.error("Error while accepting order:", error);
                    // Optionally display an error message to the user
                }
                break;
            }
            case "decline": {
                console.log("Order declined");
                // Add additional logic if needed for declining the order
                break;
            }
            default: 
                console.log("Unknown action selected");
        }
    }
    loadOrders();
}


document.getElementById('getOrders').addEventListener('click', async (e) => {
    e.preventDefault();
    console.log("selected");
    loadOrders();
})

document.getElementById('close').addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('orderItem').innerHTML = ``
    document.getElementById('orderViewer').hidden = true
    // loadOrders();
})