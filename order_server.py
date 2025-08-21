import os
import csv
from flask import Flask, request, jsonify

app = Flask(__name__)
ORDERS_DIR = os.path.join(os.path.dirname(__file__), 'files', 'order')
os.makedirs(ORDERS_DIR, exist_ok=True)

# Helper to get next cart number
def get_next_cart_number():
    existing = [f for f in os.listdir(ORDERS_DIR) if f.startswith('cart') and f.endswith('.csv')]
    nums = [int(f[4:7]) for f in existing if f[4:7].isdigit()]
    next_num = max(nums) + 1 if nums else 1
    return f'{next_num:03d}'

@app.route('/order', methods=['POST'])
def order():
    data = request.json
    cart_num = get_next_cart_number()
    filename = f'cart{cart_num}.csv'
    filepath = os.path.join(ORDERS_DIR, filename)
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data.keys())
        writer.writeheader()
        writer.writerow(data)
    return jsonify({'status': 'success', 'file': filename})

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))  # use Render's PORT
    app.run(host="0.0.0.0", port=port, debug=True)

from flask_cors import CORS
# ...after app = Flask(__name__)
CORS(app)