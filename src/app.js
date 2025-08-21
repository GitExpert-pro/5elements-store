// Main JS for Online Clothing Store

// Utility to parse CSV (simple, assumes no commas in fields)
function parseCSV(text) {
	const lines = text.trim().split('\n');
	const headers = lines[0].split(',');
	return lines.slice(1).map(line => {
		const values = line.split(',');
		let obj = {};
		headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
		return obj;
	});
}

// Load CSV file from public/files (user must provide the file)
async function loadProducts() {
	try {
	const response = await fetch('./files/products.csv');
		if (!response.ok) throw new Error('CSV file not found');
		const csvText = await response.text();
		const products = parseCSV(csvText);
		displayProducts(products);
	} catch (err) {
		document.getElementById('product-list').innerHTML = '<p>Could not load products. Please add products.csv to public/files.</p>';
	}
}

// Display products in the UI
function displayProducts(products) {
	const container = document.getElementById('product-list');
	container.innerHTML = '';
	const placeholders = {
		'tshirt.jpg': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80',
		'jeans.jpg': 'https://images.unsplash.com/photo-1514995669114-d1c1b7c1c1c1?auto=format&fit=crop&w=200&q=80',
		'dress.jpg': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=200&q=80',
		'jacket.jpg': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
		'sneakers.jpg': 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=200&q=80'
	};
	products.forEach(product => {
		// Try local image, fallback to placeholder
	const localImg = `./repo/${product.image}`;
		const placeholderImg = placeholders[product.image] || 'https://via.placeholder.com/200?text=No+Image';
		const card = document.createElement('div');
		card.className = 'product-card';
		card.innerHTML = `
			<img src="${localImg}" alt="${product.name}" style="width:200px;height:200px;object-fit:cover;" onerror="this.onerror=null;this.src='${placeholderImg}'">
			<h2>${product.name}</h2>
			<p>${product.description || ''}</p>
			<p><strong>Price:</strong> $${product.price}</p>
			<button class="order-btn">Order</button>
		`;
		// Attach event listener for order
		card.querySelector('.order-btn').addEventListener('click', function() {
			orderProduct(product);
		});
		container.appendChild(card);
	});
}


// Order button logic: send product details to backend
async function orderProduct(product) {
	try {
		const response = await fetch('http://localhost:5000/order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(product)
		});
		const result = await response.json();
		if (result.status === 'success') {
			alert(`Order placed! Saved to ${result.file}`);
		} else {
			alert('Order failed.');
		}
	} catch (err) {
		alert('Could not place order. Is the Python server running?');
	}
}

// Initial load
window.onload = loadProducts;
