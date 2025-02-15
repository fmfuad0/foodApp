


const loginSection = document.getElementById('loginSection');
const foodListSection = document.getElementById('foodListSection');
const cartSection = document.getElementById('cartSection');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const getFoodBtn = document.getElementById('getFoodBtn');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const foodList = document.getElementById('foodList');
const cartList = document.getElementById('cartList');
let user ;



async function verify() {
    if(user.accessToken){
        console.log("User is verified");
        return true;
    }
    else
        return false;
}


async function displayFoodList() {
    try {
        console.log(user.accessToken);
        
        const response = await fetch('http://localhost:3000/api/v1/foods/get-foods', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken
            }
        });
        
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            foodList.innerHTML = '';
            data.data.forEach((food) => {
                const foodEl = document.createElement('div');
                foodEl.innerHTML = `<h3>${food.title}</h3>
                                    <p>${food.description}</p>
                                    <p>Price: ${food.price}</p>
                                    <button onclick="addToCart('${food._id}')">Add to Cart</button>`;
                foodList.appendChild(foodEl);
            });
        } else {
            console.log('Fetch failed');
            console.log(data);
        }
    } catch (error) {
        console.log('Error fetching foods:', error);
    }
}

async function addToCart(foodId) {
    try {
        console.log("Add to cart:", foodId);

        const response = await fetch(`http://localhost:3000/api/v1/cart/add/c/${foodId}/c/1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken

            }
        });

        const data = await response.json();
        // console.log(data);

        if (response.ok) {
            console.log("Food added to cart:", data.data); // Log the data from the server if successful
        } else {
            console.log('Add to cart failed');
            console.log(data);
        }
        displayCart();
    } catch (error) {
        console.log('Error adding to cart:', error);
    }
}
async function removeFromCart(foodId, qty) {
    try {
        console.log("Remove from cart:", foodId);

        const response = await fetch(`http://localhost:3000/api/v1/cart/remove/c/${foodId}/c/${qty}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken
            }
        });
        console.log(response.ok);

        // Check if the response is actually JSON
        const contentType = response.headers.get("Content-Type");
        let data = {};
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            console.error("Expected JSON, but received:", contentType);
            throw new Error("Invalid response format");
        }

        if (response.ok) {
            console.log("Food removed from cart:", data.data); // Log the data from the server if successful
        } else {
            console.log('Remove from cart failed');
            console.log(data);
        }
        await displayCart();
    } catch (error) {
        console.log('Error removing from cart:', error);
    }
}


async function displayCart(req, res) {
    // console.log(user);
    const response = await fetch(`http://localhost:3000/api/v1/cart/get-cart`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': user.accessToken
        }
    });

    if (response.ok) {
        const data = await response.json();
        // console.log(data.data[0].foods);
        const cart = data.data[0];
        if (data.data.length === 0) {
            cartList.innerHTML = '';
            const foodEl = document.createElement('div');
            foodEl.innerHTML = `<h3>Your cart is empty</h3>`;
            cartList.appendChild(foodEl);
            document.getElementById('totalPrice').innerHTML = `0`;

            return;
        }
        else {
            const foods = cart.foods
            cartList.innerHTML = '';
            foods.forEach((food) => {
                const foodEl = document.createElement('div');
                foodEl.innerHTML = `<h3>${food.foodItem}</h3>
            <p>Qty: ${food.qty}</p>
                                <p>Price: ${(food.qty * food.price)}</p>
                                <button onclick="removeFromCart('${food.foodItem}', '${food.qty}')">Remove from Cart</button>`;
                cartList.appendChild(foodEl);
                document.getElementById('totalPrice').innerHTML = `${cart.totalAmount}`;
                console.log("Displayed cart"); // Log the data from the server if successful
            });
        }
    } else {
        console.log('Display cart failed');
        return res.status(400).json({ message: 'Error fetching cart' });
    }

}


getFoodBtn.addEventListener('click', async (event) => {
    // console.log("User : ", user)
    event.preventDefault();
    console.log("clicked");
    foodList.setAttribute('style', 'display: block;');
    await displayFoodList();
    
});

loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log(username, password);
    const messageEl = document.getElementById('loginError');
    console.log("clicked");

    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.data;
            document.getElementById('foodListSection').classList.remove('hidden');
            loginSection.classList.add('hidden');
            loginSection.classList.add('hidden');
            cartSection.setAttribute('style', 'display: block;');
            loginSection.setAttribute('style', 'display: none;');
            logoutBtn.setAttribute('style', 'display: block;');
            user = currentUser
            await displayCart();
            
        } else {
            messageEl.style.color = 'red';
            messageEl.innerHTML = `Error: Wrong username or password`;
        }
    } catch (error) {
        messageEl.style.color = 'red';
        messageEl.innerHTML = `Error: ${error.message}`;
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    loginSection.classList.remove('hidden');
    foodListSection.classList.add('hidden');
    cartSection.classList.add('hidden');
});

// Handle placing an order
placeOrderBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/v1/order/place/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.accessToken
            }
        });
        const data = await response.json();
        if(!data)
            return ;

        if (response.ok) {
            // console.log("order data : ", data.data);
            console.log("Order placed successfully");

        } else {
            console.log('Order placement failed');
            console.log(data.errors);
        }
        displayCart();
        window.location.href = "http://127.0.0.1:3000/client/html/orders.html";
    } catch (error) {
        console.log('Error placing order:', error);
    }
});